import DatabaseManager from "./database-manager";
import ObjktApi from "./api";
import Tools from "./tools";

export default class SaveTokens {
    private readonly objktApi: ObjktApi = new ObjktApi();
    private readonly tools: Tools = new Tools();
    private readonly databaseManager: DatabaseManager = new DatabaseManager();

    async save() {
        const tokens = await this.objktApi.getTokens();
        for (const token of tokens) {
            const tokenEvents = await this.objktApi.getTokenEvents(token);
            if (!this.tools.checkIfIBought(tokenEvents) && this.tools.checkAvailability(tokenEvents)) {
                const tokenDetails = this.tools.getTokenDetails(tokenEvents);
                console.log(tokenDetails);
                await this.databaseManager.saveToken(tokenDetails)
            }
        }
        await this.databaseManager.closeConnection();
    }
}