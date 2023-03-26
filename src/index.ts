import ObjktApi from "./api";
import Tools from "./tools";
import DatabaseManager from "./database-manager";

const objktApi = new ObjktApi();
const tools = new Tools();
const databaseManager = new DatabaseManager();

async function test() {
    const tokens = await objktApi.getTokens();
    for (const token of tokens) {
        const tokenEvents = await objktApi.getTokenEvents(token);
        if (!tools.checkIfIBought(tokenEvents) && tools.checkAvailability(tokenEvents)) {
            const tokenDetails = tools.getTokenDetails(tokenEvents);
            console.log(tokenDetails);
            await databaseManager.saveToken(tokenDetails)
        }
    }
    await databaseManager.closeConnection();
}

async function updatePriceTokens(): Promise<void> {
    const tokens = await databaseManager.getTokens();

    const tokenIds = tokens.map((token) => token.id);

    for (const [index, tokenId] of tokenIds.entries()) {
        const tokenPk = tokens[index].token_pk;
        const tokenEvents = await objktApi.getTokenEvents(tokenPk);
        const currentPrice = tools.getLatestPrice(tokenEvents);
        console.log(tokenId, currentPrice);
        await databaseManager.updateLatestPrice(tokenId, currentPrice);
    }
    await databaseManager.closeConnection();
}

async function updatePriceVariation() {
    const tokens = await databaseManager.getTokens();

    const tokenIds = tokens.map((token) => token.id);

    for (const tokenId of tokenIds) {
        const token = await databaseManager.getTokenById(tokenId);
        const priceVariation = tools.calculatePriceChange(token?.primary_price, token?.secondary_price);
        await databaseManager.postPriceVariations(tokenId, priceVariation)
    }

    await databaseManager.closeConnection()
}

test();
// updatePriceVariation().then(r => r)