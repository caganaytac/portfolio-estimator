## Further commits are comming.


# Portfolio Estimator

A lightweight fintech backend application that enables individuals and companies to build, analyze, and optimize investment portfolios. The platform provides portfolio evaluation, diversification analysis, risk assessment, and AI-powered portfolio reallocation recommendations.

## Overview

Portfolio Estimator helps investors understand their portfolio composition and identify opportunities for diversification and risk reduction.

The application supports multiple asset classes, including:

- Stocks
- ETFs
- Gold
- Bonds
- Cryptocurrencies

Users can create portfolios, track asset allocations, evaluate risk exposure, and receive AI-generated recommendations based on quantitative portfolio metrics.

---

# Features

## Authentication & Authorization

- User registration
- Secure login
- JWT authentication
- Refresh token support
- Role-based access control

### User Types

- Individual Investor
- Corporate Investor

---
## Portfolio Management

- Create portfolios
- Update portfolios
- Delete portfolios
- Track holdings
- Calculate portfolio value
- Asset allocation overview

---

## Asset Management

Supported asset types:

- Stocks
- ETFs
- Bonds
- Gold
- Crypto

Asset metadata includes:

- Ticker symbol
- Asset name
- Asset type
- Country
- Industry/Sector
- Risk classification

---

## Portfolio Evaluation

### Risk Analysis

Calculates:

- Portfolio risk score
- Concentration risk
- Volatility score
- Asset class exposure

### Diversification Analysis
Measures:

- Country diversification
- Industry diversification
- Asset diversification
- Concentration metrics

### Exposure Analysis

Portfolio breakdown by:

- Country
- Industry
- Asset class
- Individual holdings

---

## AI Portfolio Advisor

The AI module does not calculate portfolio metrics.

Instead:

1. Evaluation Service computes portfolio metrics.
2. Metrics are sent to the AI API.
3. AI generates:
   - Portfolio summary
   - Risk explanation
   - Diversification insights
   - Reallocation recommendations

Example recommendation:

> Your portfolio is heavily concentrated in U.S. technology equities. Consider increasing exposure to international ETFs and fixed-income assets to improve diversification.

---
