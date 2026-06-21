const assert = require("node:assert/strict");
const { test } = require("node:test");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const { buildApp } = require("../dist/app.js");
const { config } = require("../dist/config.js");
const { GatewayError } = require("../dist/errors.js");

function response(status, body) {
  return {
    status,
    data: Buffer.from(JSON.stringify(body)),
    headers: { "content-type": "application/json; charset=utf-8" }
  };
}

function clients(overrides = {}) {
  const defaultClient = (name) => ({
    name,
    async request() {
      return response(200, { service: name });
    }
  });

  return {
    users: defaultClient("users"),
    portfolios: defaultClient("portfolios"),
    evaluations: defaultClient("evaluations"),
    ...overrides
  };
}

function accessToken(sub = "user-1", role = "user") {
  return jwt.sign(
    { sub, role, type: "access" },
    config.jwtSecret,
    { algorithm: "HS256", expiresIn: "5m" }
  );
}

test("public login is forwarded without an access token", async () => {
  let forwarded;
  const app = buildApp(clients({
    users: {
      name: "users",
      async request(options) {
        forwarded = options;
        return response(200, { accessToken: "token" });
      }
    }
  }));

  const result = await request(app)
    .post("/api/auth/login")
    .send({ email: "person@example.com", password: "secret" });

  assert.equal(result.status, 200);
  assert.equal(forwarded.url, "/auth/login");
  assert.equal(forwarded.method, "POST");
  assert.deepEqual(forwarded.data, {
    email: "person@example.com",
    password: "secret"
  });
});

test("evaluation routes reject missing access tokens", async () => {
  let called = false;
  const app = buildApp(clients({
    evaluations: {
      name: "evaluations",
      async request() {
        called = true;
        return response(200, {});
      }
    }
  }));

  const result = await request(app).post("/api/evaluations").send({
    portfolioId: "portfolio-1"
  });

  assert.equal(result.status, 401);
  assert.equal(called, false);
});

test("authenticated portfolio requests preserve path, query, body, and token", async () => {
  let forwarded;
  const token = accessToken();
  const app = buildApp(clients({
    portfolios: {
      name: "portfolios",
      async request(options) {
        forwarded = options;
        return response(200, { id: "portfolio-1" });
      }
    }
  }));

  const result = await request(app)
    .patch("/api/portfolios/update/portfolio-1?include=holdings")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Long term" });

  assert.equal(result.status, 200);
  assert.equal(forwarded.url, "/portfolios/update/portfolio-1");
  assert.deepEqual(forwarded.params, { include: "holdings" });
  assert.deepEqual(forwarded.data, { name: "Long term" });
  assert.equal(forwarded.headers.authorization, `Bearer ${token}`);
  assert.equal(typeof forwarded.headers["x-request-id"], "string");
});

test("upstream failures produce a gateway error response", async () => {
  const app = buildApp(clients({
    evaluations: {
      name: "evaluations",
      async request() {
        throw new GatewayError(502, "evaluations service is unavailable", "evaluations");
      }
    }
  }));

  const result = await request(app)
    .get("/api/evaluations")
    .set("Authorization", `Bearer ${accessToken()}`);

  assert.equal(result.status, 502);
  assert.equal(result.body.message, "evaluations service is unavailable");
  assert.equal(typeof result.body.requestId, "string");
});
