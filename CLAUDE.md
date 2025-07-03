# Tycostream Demo Specifications

## Overview
Ultra-minimal demo (62 lines total) to test the tycostream GraphQL server:
- Single HTML page with Ag-Grid
- Apollo Client WebSocket subscriptions  
- Auto-updating real-time data grid
- Zero configuration, maximum simplicity

## Files
- `index.html` - Basic HTML with grid container
- `main.js` - Complete implementation
- `package.json` - Dependencies only

## GraphQL Schema
```graphql
type live_pnl {
  instrument_id: ID!
  symbol: String!
  net_position: Float!
  latest_price: Float!
  market_value: Float!
  avg_cost_basis: Float!
  theoretical_pnl: Float!
}

type Subscription {
  live_pnl: live_pnl!
}
```

## Key Features
- DRY: Field names defined once in GraphQL, extracted for grid columns
- Real-time: WebSocket subscription automatically updates grid
- Clean: No unnecessary config files, error handling, or logging
- Fast: Vite hot reload for development

## Usage
```bash
npm install
npm run dev
# Open http://localhost:5173
```