export enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc',
}

export enum MarketplaceEventType {
    NULL = 'null',
    LIST_BUY = 'list_buy',
    LIST_CREATE = 'list_create',
    LIST_CANCEL = 'list_cancel',
    OFFER_CREATE = 'offer_create'
}

export enum EventType {
    NULL = 'null',
    MINT = 'mint',
    TRANSFER = 'transfer',
}

export interface Creator {
    address: string;
    profile_address: string;
    alias: string | null;
    email: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    tzdomain: string | null;
}

export interface Event {
    amount: number;
    creator: Creator;
    event_type: EventType;
    fa_contract: string;
    marketplace: Marketplace;
    marketplace_contract: string;
    marketplace_event_type: MarketplaceEventType;
    price: number;
    recipient_address: string;
    timestamp: Date;
    token: Token;
}

export interface Marketplace {
    name: string;
    contract: string;
    group: string;
    subgroup: string;
}

export interface Token {
    name: string;
    mime: string;
    pk: number;
    average: number;
    lowest_ask: number;
    highest_offer: number;
    supply: number;
    token_id: number;
    royalties: Royalty[];
}

export interface Royalty {
    amount: number;
    decimals: number;
}

export interface TokenDetails {
    address: string;
    profile_address: string;
    alias: string | null;
    twitter: string | null;
    email: string | null;
    facebook: string | null;
    instagram: string | null;
    tzdomain: string | null;
    token_address: string;
    marketplace: string;
    image: string;
    price: number;
    secondary_price: number;
    royalty: number;
    editions: number;
    sold_editions: number;
    mint_date: Date;
    list_date: Date;
    token_pk: number;
    sold_rate: number;
    average_collect_actions: number;
    overall: number;
}
