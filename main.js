import { createGrid, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

ModuleRegistry.registerModules([AllCommunityModule]);

const subscription = gql`
  subscription LivePnlSubscription {
    live_pnl {
      instrument_id
      symbol
      net_position
      latest_price
      market_value
      avg_cost_basis
      theoretical_pnl
    }
  }
`;

const fields = subscription.loc.source.body.match(/^\s*(\w+)\s*$/gm).map(f => f.trim());

const gridApi = createGrid(document.querySelector('#grid'), {
  theme: 'legacy',
  columnDefs: fields.map(field => ({ field })),
  rowData: []
});

const client = new ApolloClient({
  link: new GraphQLWsLink(createClient({ url: 'ws://localhost:4000/graphql' })),
  cache: new InMemoryCache()
});

const rows = {};

client.subscribe({ query: subscription }).subscribe(({ data }) => {
  if (data?.live_pnl) {
    rows[data.live_pnl.instrument_id] = data.live_pnl;
    gridApi.setGridOption('rowData', Object.values(rows));
  }
});