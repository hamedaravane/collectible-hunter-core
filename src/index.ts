import SaveTokens from "./save-tokens";
import UpdateTokens from "./update-tokens";

const saveTokens: SaveTokens = new SaveTokens();
const updateTokens: UpdateTokens = new UpdateTokens();

async function main() {
    await saveTokens.save();

    // await updateTokens.updatePriceTokens();
    // await updateTokens.updatePriceVariation();

    // await updateTokens.updateOverallScore();
}

main().then(() => console.log('application have been executed'))