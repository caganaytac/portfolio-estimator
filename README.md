# Portfolio Estimator

A lightweight fintech backend that enables individuals and companies to build, analyze, and optimize investment portfolios. The platform provides portfolio evaluation, diversification analysis, risk assessment, and AI-powered portfolio reallocation recommendations.

Portfolio Estimator helps investors understand their portfolio composition and identify opportunities for diversification and risk reduction across multiple asset classes — stocks, ETFs, gold, bonds, and cryptocurrencies.

---

## Architecture

The system is built as a set of independent microservices, each owning its own database and communicating over REST. Authentication is handled via shared-secret JWTs (HS256): `users-service` issues tokens at login, and every other service verifies them locally — no inter-service calls are needed just to confirm a request is authenticated. Moreover all routes can be managed over API Gateway.


See [`diagram.png`](./diagram.png) for the full system diagram.

**Why microservices for a project this size?** Each service is independently deployable and owns its own data — `portfolios-service` never queries `users-service`'s database directly, and trusts JWT claims for identity instead. This was a deliberate architectural choice to practice service boundaries, ownership checks, and stateless auth verification, even at a scale where a monolith would also have been a reasonable option.

---

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Web framework:** Express
- **ORM:** TypeORM
- **Database:** PostgreSQL (one database per service)
- **Auth:** JWT (HS256), shared secret across services, access + refresh token pattern
- **Validation:** class-validator / DTOs at the API boundary
- **AI:** openAI

---

## Services

### `users-service`
Handles registration, login, and identity. Issues access and refresh tokens. Supports two user types — Individual Investor and Corporate Investor — with role-based access control (admin, user) For example, to add/update/delete an asset like SpaceX stock, you need to be an admin.

### `portfolios-service`
Owns portfolios, holdings, and the asset catalog. Enforces ownership at the API layer (a user can only see/modify their own portfolios) and restricts asset management (create/update/delete) to admin users. Computes live portfolio rollups — total value, cost basis, unrealized P&L — by joining holdings against current asset prices.

### `evaluations-service`
Computes portfolio-level risk and diversification metrics: concentration risk, volatility score, asset class / country / industry exposure. Feeds these computed metrics into an external AI API to generate a plain-language portfolio summary and reallocation recommendations. The AI layer **never** computes financial metrics itself — it only narrates numbers this service has already calculated deterministically.

---

## Features

### Authentication & Authorization
- User registration and secure login
- JWT authentication with refresh token support
- Role-based access control (admin-only asset management)
- Two user types: Individual Investor, Corporate Investor

### Portfolio Management
- Create, update, delete portfolios
- Track holdings (quantity, average purchase price, purchase date)
- Live portfolio valuation and unrealized P&L
- Asset allocation overview

### Asset Management
- Supported asset types: Stocks, ETFs, Bonds, Gold, Crypto
- Asset metadata: ticker symbol, name, asset class, currency, exchange, sector/industry, risk classification

### Portfolio Evaluation
- **Risk analysis** — portfolio risk score, concentration risk, volatility score, asset class exposure
- **Diversification analysis** — country, industry, and asset diversification, concentration metrics
- **Exposure analysis** — breakdown by country, industry, asset class, and individual holding

### AI Portfolio Advisor
The AI module does not calculate portfolio metrics. Instead:
1. `evaluations-service` computes portfolio metrics deterministically.
2. Metrics are sent to an AI API (here: gpt-5).
3. The AI generates a portfolio summary, risk explanation, diversification insights, and reallocation suggestions. There, multi-agent orchestration takes place by synthesising responses of single agents.

> Example: *"Your portfolio is heavily concentrated in U.S. technology equities. Consider increasing exposure to international ETFs and fixed-income assets to improve diversification."*

---

## Getting Started

### Prerequisites
- Node.js (version: _fill in_)
- PostgreSQL (one database per service)
- npm

### Setup

```bash
git clone https://github.com/caganaytac/portfolio-estimator.git
cd portfolio-estimator/workspace

# repeat for each service: users-service, portfolios-service, evaluations-service or just api-gateway
cd <service-name>
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, etc. — see below
npm run dev
```

### Required environment variables (per service)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for this service's database |
| `JWT_SECRET` | Shared HS256 secret — **must be identical across all services** |
| `JWT_EXPIRES_IN` | Access token lifetime (e.g. `1h`) |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens |
| `PORT` | Port this service listens on |

**`evaluations-service` additionally requires:**

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | A valid OpenAI API key, used to generate the AI portfolio summary and reallocation recommendations. Without a valid key, the AI Portfolio Advisor feature will fail — all other endpoints (risk/diversification metrics) work independently of this. |

### Running tests

```bash
npm test
```

---

## Demo Accounts

`users-service` includes role-based access control — some endpoints (e.g. asset management in `portfolios-service`) are restricted to `admin` users. Role (`admin` / `user`) and user type (`Individual` / `Corporate`) are independent — an admin can be either an individual or a corporate account.

For local testing, seed accounts are created via a seed script rather than committed to the repo as plaintext credentials:

| Status | Purpose |
|---|---|
| `admin` | Can create/update/delete assets, in addition to normal portfolio access |
| `user` | Standard access — own portfolios and holdings only |

To create these locally:

```bash
cd users-service
npm run seed
```

Seed credentials are read from environment variables (see `.env.example` in `users-service`) and are **not** committed to version control. Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` and `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` in your local `.env` before running the seed script.

---

## Project Status

This project is under active development. Current focus: completing the `portfolios-service` REST layer (controllers, routers, ownership/admin authorization) and the React frontend.

Planned next:
- [ ] `evaluations-service` risk/diversification calculations
- [ ] AI advisor integration
- [ ] Frontend (React)

---

## License

MIT — see [LICENSE](./LICENSE).
