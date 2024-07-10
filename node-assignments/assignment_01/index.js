const express = require("express");
const app = express();
const helper = require("./helper");

app.get("/api/calculate/:operation", (req, res) => {
  const { operation } = req.params;
  const { first: firstValue, second: secondValue } = req.query;
  let result;

  try {
    if (operation === "add") {
      result = helper.addition(Number(firstValue), Number(secondValue));
    } else if (operation === "subtract") {
      result = helper.subtraction(Number(firstValue), Number(secondValue));
    } else if (operation === "multiply") {
      result = helper.multiplication(Number(firstValue), Number(secondValue));
    } else if (operation === "divide") {
      result = helper.division(Number(firstValue), Number(secondValue));
    } else if (operation === "percentage") {
      result = helper.percentage(Number(firstValue), Number(secondValue));
    }

    res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "success",
      result,
    });
  }
});

module.exports = app;
