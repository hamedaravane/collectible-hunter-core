import DatabaseManager from "./database-manager";
import ObjktApi from "./api";
import Tools from "./tools";

export default class UpdateTokens {
    private readonly objktApi: ObjktApi = new ObjktApi();
    private readonly tools: Tools = new Tools();
    private readonly databaseManager: DatabaseManager = new DatabaseManager();

    async updatePriceTokens(): Promise<void> {
        const tokens = await this.databaseManager.getTokens();
        let currentIndex = 0;

        const intervalId = setInterval(async () => {
            const slicedTokens = tokens.slice(currentIndex, currentIndex + 119);

            const tokenIds = slicedTokens.map((token) => token.id);

            for (const tokenId of tokenIds) {
                const token = await this.databaseManager.getTokenById(tokenId);
                if (token) {
                    const tokenPk = token.token_pk;
                    const tokenEvents = await this.objktApi.getTokenEvents(tokenPk);
                    const currentPrice = this.tools.getFirstSecondaryPrice(tokenEvents);
                    if (currentPrice) {
                        await this.databaseManager.updateLatestSaleTimestamp(tokenId, this.tools.getFirstSecondaryPriceTimestamp(tokenEvents))
                    }
                    console.log(tokenId, token.primary_price, currentPrice);
                    await this.databaseManager.updateLatestPrice(tokenId, currentPrice);
                }
            }

            currentIndex += 119; // move the current index forward
            if (currentIndex >= tokens.length) {
                clearInterval(intervalId); // stop the interval if we've processed
            }
        }, 60000);

        await this.databaseManager.closeConnection();
    }

    async updatePriceVariation() {
        const tokens = await this.databaseManager.getTokens();

        const tokenIds = tokens.map((token) => token.id);

        for (const tokenId of tokenIds) {
            const token = await this.databaseManager.getTokenById(tokenId);
            if (token) {
                const priceVariation = this.tools.calculatePriceChange(token.primary_price, token.secondary_price);
                console.log(token.primary_price, token.secondary_price, priceVariation);
                await this.databaseManager.postPriceVariations(tokenId, priceVariation);
            }
        }
        await this.databaseManager.closeConnection();
    }
}