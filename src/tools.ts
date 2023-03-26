import {Creator, EventType, MarketplaceEventType, TokenDetails, TokenEvent} from "./model/token";
import RatingSystem from "./rating-system";

export default class Tools {
    private readonly minimumListToken = 1;
    private readonly maximumListToken = 100;
    private readonly minimumSoldToken = 2;

    constructor(private ratingSystem = new RatingSystem()) {
    }

    /**
     * Calculate events of a token and returns details of the token
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {TokenDetails} The details of the token.
     */
    getTokenDetails(events: TokenEvent[]): TokenDetails {
        const tokenDetails = {
            ...this.findArtist(events),
            token_address: this.getTokenAddress(events),
            token_pk: this.getTokenPk(events),
            image: this.getTokenImage(events),
            marketplace: this.getMarketplaceName(events),
            primary_price: this.getPrimaryPrice(events),
            royalty: this.calculateRoyalty(events),
            editions: this.amountOfListEdition(events),
            sold_editions: this.amountOfPurchases(events),
            mint_date: this.getMintDate(events),
            list_date: this.getListDate(events),
            sold_rate: this.soldRate(events),
            average_collects: this.averagePurchaseActionsTime(events),
        } as TokenDetails;

        tokenDetails['overall_score'] = this.ratingSystem.calculateOverallScore(tokenDetails);

        return tokenDetails;
    }

    calculatePriceChange(initialPrice: number, currentPrice: number): number {
        const percentageChange = ((currentPrice - initialPrice) / initialPrice) * 100;
        const formattedPercentageChange = percentageChange.toFixed(2);
        return Number(formattedPercentageChange)
    }

    /**
     * Finds the timestamp of the first "mint" event in an array of token events.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {Date} The timestamp of the first "mint" event, or null if no "mint" event was found.
     */
    getMintDate(events: TokenEvent[]): Date | undefined {
        for (const event of events) {
            if (event.event_type == EventType.MINT) {
                return new Date(event.timestamp);
            }
        }
    }

    /**
     * Finds the timestamp of the first "list" event in an array of token events.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {Date} The timestamp of the first "mint" event, or null if no "list" event was found.
     */
    getListDate(events: TokenEvent[]): Date | undefined {
        for (const event of events) {
            if (event.marketplace_event_type == MarketplaceEventType.LIST_CREATE) {
                return new Date(event.timestamp);
            }
        }
    }

    getTokenPk(events: TokenEvent[]): number {
        return events[0].token.pk;
    }

    /**
     * Returns the name of marketplace which token is listed at.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {string} The name of marketplace.
     */
    getMarketplaceName(events: TokenEvent[]): string | undefined {
        for (const event of events) {
            if (event.marketplace) {
                if (event.marketplace.group) {
                    return event.marketplace.group;
                }
            }
        }
    }

    /**
     * This function checks that I bought this token or not.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {boolean} The final result which is true if I already bought this token.
     */
    checkIfIBought(events: TokenEvent[]): boolean {
        for (const event of events) {
            if (
                event.recipient_address === 'tz1ibW4sjBmVJEuCnaBzqRcvrU5mzNJfd9Ni' &&
                event.event_type === EventType.TRANSFER
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * This function returns the latest price of list token.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number} The latest price.
     */
    getLatestPrice(events: TokenEvent[]) {
        let price = 0;
        for (const event of events) {
            if (event.marketplace_event_type === MarketplaceEventType.LIST_BUY) {
                price = event.price / 1000000;
            }
        }
        return price;
    }

    /**
     * This function returns the price of list token.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number} The primary price.
     */
    getPrimaryPrice(events: TokenEvent[]): number | undefined {
        const artistAddress = this.findArtist(events).address;
        let price = 0;
        for (const event of events) {
            if (event.marketplace_event_type === MarketplaceEventType.LIST_BUY && artistAddress === event.creator.address) {
                price = event.price / 1000000;
            }
        }
        return price;
    }

    /**
     * Calculates the total royalty percentage that should be paid to the artist based on an array of token events.
     * @param {TokenEvent[]} events An array of token events.
     * @returns The total royalty percentage as a number.
     */
    calculateRoyalty(events: TokenEvent[]): number {
        const totalRoyaltyAmount = events[0]?.token?.royalties?.reduce(
            (total, royalty) => {
                const royaltyAmount = royalty.amount / 10 ** royalty.decimals;
                return total + royaltyAmount;
            },
            0,
        );
        return totalRoyaltyAmount * 100;
    }

    /**
     * Returns an array of timestamps (in seconds) for every buy action in the given list of token events.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number[]} An array of timestamps (in seconds) for every buy action in the events list.
     */
    getListOfPurchaseTimestamps(events: TokenEvent[]): number[] {
        const purchaseTimestamps = [];
        for (const event of events) {
            if (event.marketplace_event_type === MarketplaceEventType.LIST_BUY) {
                const date = Math.floor(
                    new Date(event.timestamp).getTime() / 1000 / 60,
                );
                purchaseTimestamps.push(date);
            }
        }
        return purchaseTimestamps;
    }

    /**
     * This function checks if token has available primary editions or not.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {boolean} The availability of token.
     */
    checkAvailability(events: TokenEvent[]): boolean {
        const listEdition = this.amountOfListEdition(events);
        const soldEdition = this.amountOfPurchases(events);
        if (listEdition > this.minimumListToken) {
            if (listEdition < this.maximumListToken) {
                if (soldEdition > this.minimumSoldToken) {
                    if (listEdition > soldEdition) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * This function returns the amount of editions which listed.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number} The amount of editions which listed.
     */
    amountOfListEdition(events: TokenEvent[]): number {
        let amountOfList = 0;
        const artist = this.findArtist(events);
        for (const event of events) {
            if (
                event.marketplace_event_type === MarketplaceEventType.LIST_CREATE &&
                artist.address === event.creator.address
            ) {
                amountOfList += event.amount;
            }
            if (
                event.marketplace_event_type === MarketplaceEventType.LIST_CANCEL &&
                artist.address === event.creator.address
            ) {
                amountOfList -= event.amount;
            }
        }
        return amountOfList;
    }

    /**
     * This function returns the amount of editions which has been sold.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number} The amount of editions which has been sold.
     */
    amountOfPurchases(events: TokenEvent[]): number {
        let amount = 0;
        for (const event of events) {
            if (event.marketplace_event_type === MarketplaceEventType.LIST_BUY) {
                amount++;
            }
        }
        return amount;
    }

    /**
     * This function returns the amount of editions which has been transferred.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number} The amount of editions which has been transferred.
     */
    amountOfTransfers(events: TokenEvent[]): number {
        let iterator = 0;
        for (const event of events) {
            if (event.event_type === EventType.TRANSFER) {
                if (event.creator.address === this.findArtist(events).address) {
                    iterator++;
                }
            }
        }
        return iterator;
    }

    /**
     * This function find the address of creator of the token.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {Creator} The details of creator of the token.
     */
    findArtist(events: TokenEvent[]): Creator {
        const firstEvent = events[0];

        return {
            address: firstEvent.creator.address,
            profile_address: `https://objkt.com/profile/${firstEvent.creator.address}`,
            alias: firstEvent.creator.alias,
            twitter: firstEvent.creator.twitter,
            email: firstEvent.creator.email,
            facebook: firstEvent.creator.facebook,
            instagram: firstEvent.creator.instagram,
            tzdomain: firstEvent.creator.tzdomain,
        };
    }

    getTokenAddress(events: TokenEvent[]): string {
        const firstEvent = events[0];
        return (
            'https://objkt.com/asset/' +
            firstEvent.fa_contract +
            '/' +
            firstEvent.token.token_id
        );
    }

    getTokenImage(events: TokenEvent[]): string {
        const firstEvent = events[0];
        return (
            'https://assets.objkt.media/file/assets-003/' +
            firstEvent.fa_contract +
            '/' +
            firstEvent.token.token_id +
            '/thumb288'
        );
    }

    /**
     * Calculates the average time (in seconds) between purchases in the given list of token events.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number} The average time (in seconds) between purchases.
     */
    averagePurchaseActionsTime(events: TokenEvent[]): number {
        const purchaseTimestamps = this.getListOfPurchaseTimestamps(events);
        const differences = purchaseTimestamps
            .slice(1)
            .map((timestamp, i) => timestamp - purchaseTimestamps[i]);
        const averageDifference =
            differences.reduce((sum, difference) => sum + difference, 0) /
            differences.length;
        return Math.floor(averageDifference);
    }

    /**
     * Calculates the sold rate (the percentage of listed editions that have been sold) for the given list of token events.
     * @param {TokenEvent[]} events - An array of token events.
     * @returns {number} The sold rate (as a decimal) for the given list of token events.
     */
    soldRate(events: TokenEvent[]) {
        const listEdition = this.amountOfListEdition(events);
        const purchase = this.amountOfPurchases(events);
        return purchase / listEdition;
    }
}