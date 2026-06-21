# API Gateway

The gateway is the client-facing entry point for the portfolio estimator. It
validates access tokens, applies common HTTP controls, and forwards requests to
the users, portfolios, and evaluations services.

## Setup

Copy `.env.example` to `.env`. `JWT_SECRET` must match the secret used to issue
tokens in `users-service` and to verify them in the other services.

```bash
npm install
npm run dev
```

The default gateway URL is `http://localhost:3000`.

## Routes

| Gateway prefix | Downstream prefix | Service | Authentication |
| --- | --- | --- | --- |
| `/api/auth` | `/auth` | users | Login, refresh, and registration are public; other routes require an access token |
| `/api/users` | `/users` | users | Required |
| `/api/persons` | `/persons` | users | Required |
| `/api/corporates` | `/corporates` | users | Required |
| `/api/portfolios` | `/portfolios` | portfolios | Required |
| `/api/assets` | `/assets` | portfolios | Required |
| `/api/evaluations` | `/evaluations` | evaluations | Required |

`GET /health` and `GET /metrics` are handled by the gateway itself.

The gateway preserves the bearer token so downstream services can enforce
resource ownership. In particular, the evaluations service calls the
portfolios service with that token before creating an evaluation run.

## Verification

```bash
npm test
npm audit --omit=dev
```
