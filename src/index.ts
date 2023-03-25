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

async function updateTokens(): Promise<void> {
    await databaseManager.getTokens();
    // console.log(tokens)
    // await databaseManager.closeConnection();
    // const tokenPks = tokens.map((token) => token.token_pk);
    // const tokenPrices = tokens.map((token) => token.primary_price);
    //
    // for (const [index, tokenPk] of tokenPks.entries()) {
    //     console.log('salam', index, tokenPk)
    // }
    await databaseManager.closeConnection();
}

// test();
updateTokens().then(r => r)