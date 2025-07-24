import { createGrid, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

ModuleRegistry.registerModules([AllCommunityModule]);

const fields = [
  'instrument_id',
  'symbol',
  'net_position',
  'latest_price',
  'market_value',
  'avg_cost_basis',
  'theoretical_pnl'
];

const subscription = gql`
  subscription LivePnlSubscription {
    live_pnl {
      operation
      data {
        ${fields.join('\n')}
      }
    }
  }
`;

const gridApi = createGrid(document.querySelector('#grid'), {
  theme: 'legacy',
  columnDefs: fields.map(field => ({ field })),
  rowData: [],
  getRowId: params => String(params.data.instrument_id)
});

const client = new ApolloClient({
  link: new GraphQLWsLink(createClient({ url: 'ws://localhost:4000/graphql' })),
  cache: new InMemoryCache()
});

client.subscribe({ query: subscription }).subscribe(({ data }) => {
  if (data?.live_pnl) {
    const { operation, data: rowData } = data.live_pnl;
    
    if (operation === 'DELETE' && rowData) {
      gridApi.applyTransaction({ remove: [rowData] });
    } else if (operation === 'UPDATE' && rowData) {
      gridApi.applyTransaction({ update: [rowData] });
    } else if (operation === 'INSERT' && rowData) {
      gridApi.applyTransaction({ add: [rowData] });
    }
  }
});