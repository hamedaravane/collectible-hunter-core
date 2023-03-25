import {MarketplaceEventType, SortDirection, TokenEvent, TokenPk} from './model/token';
import axios, {AxiosRequestConfig} from "axios";

export default class ObjktApi {
    private readonly url: string = 'https://data.objkt.com/v3/graphql';
    private readonly config: AxiosRequestConfig = {
        headers: {
            "Content-Type": 'application/json',
            "Accept": '*',
        }
    };

    async getTokens(): Promise<number[]> {
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
            limit: 120,
            order_by: [
                { id: SortDirection.DESCENDING },
                { timestamp: SortDirection.DESCENDING },
            ],
            where: { marketplace_event_type: { _eq: MarketplaceEventType.LIST_BUY } },
        };

        const response = await axios.post(this.url, {query, variables}, this.config);
        const tokens: TokenPk[] = response.data.data.event;

        return tokens.map((obj) => obj.token_pk).filter((pk, index, pks) => pks.indexOf(pk) === index);
    }

    async getTokenEvents(tokenPk: number): Promise<TokenEvent[]> {
        const query = `
          query GetTokenEvents($where: event_bool_exp!, $order_by: [event_order_by!]) {
            event(
              where: $where
              order_by: $order_by
            ) {
            amount
            creator {
              address
              alias
              email
              facebook
              instagram
              twitter
              tzdomain
            }
            event_type
            fa_contract
            marketplace {
              name
              contract
              group
              subgroup
            }
            marketplace_contract
            marketplace_event_type
            price
            recipient_address
            timestamp
            token {
              name
              mime
              pk
              average
              lowest_ask
              highest_offer
              supply
              token_id
              royalties {
                amount
                decimals
              }
            }
          }
        }`;

        const variables = {
            where: {
                timestamp: { _is_null: false },
                reverted: { _neq: true },
                token_pk: { _eq: tokenPk },
            },
            order_by: [
                { id: SortDirection.ASCENDING },
                { timestamp: SortDirection.ASCENDING },
            ],
        };

        const response = await axios.post(this.url, {query, variables}, this.config);
        return response.data.data.event;
    }
}