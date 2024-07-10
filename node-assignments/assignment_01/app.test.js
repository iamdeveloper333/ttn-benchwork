const request = require("supertest");
const app = require("./index");

describe("Testing Operation API", () => {
  it("should add two numbers", async () => {
    const response = await request(app)
      .get("/api/calculate/add")
      .query({ first: 20, second: 30 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "success", result: 50 });
  });

  it("should subtract two numbers", async () => {
    const response = await request(app)
      .get("/api/calculate/subtract")
      .query({ first: 40, second: 30 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "success", result: 10 });
  });

  it("should multiply two numbers", async () => {
    const response = await request(app)
      .get("/api/calculate/multiply")
      .query({ first: 20, second: 30 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "success", result: 600 });
  });

  it("should divide two numbers", async () => {
    const response = await request(app)
      .get("/api/calculate/divide")
      .query({ first: 60, second: 30 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "success", result: 2 });
  });

  it("should percentage two numbers", async () => {
    const response = await request(app)
      .get("/api/calculate/percentage")
      .query({ first: 4, second: 20 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "success", result: 20 });
  });
});
