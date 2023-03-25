import { MarketplaceEventType, SortDirection } from './model/token';

export default class ObjktApi {
    private readonly url: string = 'https://data.objkt.com/v3/graphql';
    private readonly headers: Record<string, string> = {
        'content-type': 'application/json',
        'Accept-Encoding': '*',
    };

    async getTokens() {
        const query = `
          query GetTokens($limit: Int!, $order_by: [event_order_by!], $where: event_bool_exp!) {
          event(
            order_by: $order_by
            limit: $limit
            where: $where
            ) {
            token_pk
          }
        }`;

        const variables = {
            limit: 10,
            order_by: [
                { id: SortDirection.DESCENDING },
                { timestamp: SortDirection.DESCENDING },
            ],
            where: { marketplace_event_type: { _eq: MarketplaceEventType.LIST_BUY } },
        };


    }
}