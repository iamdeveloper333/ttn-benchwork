const express = require("express");
const app = express();
const csv = require("csvtojson");
const mysql = require("mysql2/promise");
const https = require("https");

require("dotenv").config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const connectionConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
};

const triggeredBy = "aarav";

async function implementDataMigrations() {
  const connection = await mysql.createConnection(connectionConfig);
  await connection.connect();
  console.log("Connected to MySQL");
  let migrationLogId;
  let migratedRecords = 0;
  let skippedRecords = 0;

  try {
    const [migrationLog] = await connection.execute(
      "INSERT INTO migration_logs (migration_file_name, s3_file_path, triggered_by) VALUES (?, ?, ?)",
      [process.env.CSV_FILE, process.env.AWS_S3_PATH, triggeredBy]
    );
    migrationLogId = migrationLog.insertId;

    https
      .get(`${process.env.AWS_S3_PATH}/${process.env.CSV_FILE}`, (response) => {
        response.pipe(csv()).subscribe(
          async (jsonObj) => {
            try {
              if (jsonObj.alert_trigger_date) {
                const [day, month, year] =
                  jsonObj.alert_trigger_date.split("/");
                jsonObj.alert_trigger_date = `${year}-${month}-${day}`;
              }

              const sql = `
                  INSERT INTO customer_cases (
                    source, account_number, first_name, last_name, customer_number,
                    case_reference, alert_trigger_date, triggered_by_rule, record_type,
                    notes, senior_analyst_user_id, investigating_analyst_user_id,
                    case_outcome, category_of_match, attachments
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
              const values = [
                jsonObj.source,
                jsonObj.account_number,
                jsonObj.first_name,
                jsonObj.last_name,
                jsonObj.customer_number,
                jsonObj.case_reference,
                jsonObj.alert_trigger_date,
                jsonObj.triggered_by_rule,
                jsonObj.record_type,
                jsonObj.notes,
                jsonObj.senior_analyst_user_id,
                jsonObj.investigating_analyst_user_id,
                jsonObj.case_outcome,
                jsonObj.category_of_match,
                jsonObj.attachments,
              ];

              await connection.execute(sql, values);
              migratedRecords++;
            } catch (error) {
              skippedRecords++;
              await connection.execute(
                "INSERT INTO migration_errors (migration_log_id, record_data, error_message) VALUES (?, ?, ?)",
                [migrationLogId, JSON.stringify(jsonObj), error.message]
              );
            }
          },
          (err) => {
            console.error("Error processing CSV:", err);
          },
          async () => {
            console.log(
              "CSV file successfully processed and uploaded to MySQL"
            );
            await connection.execute(
              "UPDATE migration_logs SET migrated_records = ?, skipped_records = ? WHERE id = ?",
              [migratedRecords, skippedRecords, migrationLogId]
            );
            connection.end();
          }
        );
      })
      .on("error", (err) => {
        console.error("Error downloading CSV file:", err);
      });
  } catch (error) {
    console.error("Error:", error);
    if (connection) {
      connection.end();
    }
  }
}

implementDataMigrations();

app.listen(process.env.PORT, () => {
  console.log(`SERVER STARTED ON ${process.env.PORT} PORT`);
});
