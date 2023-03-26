import {TokenDetails} from "./model/token";
import {TokenEntity} from "./entity/token.entity";
import { AppDataSource } from "./data-source"

export default class DatabaseManager {

    async saveToken(tokenDetails: TokenDetails): Promise<void> {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const token = new TokenEntity();
        token.creator_address = tokenDetails.address;
        token.creator_profile_address = tokenDetails.profile_address;
        token.creator_alias = tokenDetails.alias;
        token.creator_twitter = tokenDetails.twitter;
        token.creator_email = tokenDetails.email;
        token.creator_facebook = tokenDetails.facebook;
        token.creator_instagram = tokenDetails.instagram;
        token.creator_tzdomain = tokenDetails.tzdomain;
        token.token_address = tokenDetails.token_address;
        token.marketplace = tokenDetails.marketplace;
        token.token_image = tokenDetails.image;
        token.token_pk = tokenDetails.token_pk;
        token.primary_price = tokenDetails.primary_price;
        token.secondary_price = tokenDetails.secondary_price!;
        token.royalty = tokenDetails.royalty;
        token.editions = tokenDetails.editions;
        token.sold_editions = tokenDetails.sold_editions;
        token.mint_date = tokenDetails.mint_date;
        token.list_date = tokenDetails.list_date;
        token.sold_rate = tokenDetails.sold_rate;
        token.average_collects = tokenDetails.average_collects;
        token.overall_score = tokenDetails.overall_score;
        token.price_variation = tokenDetails.price_variation;
        token.first_secondary_sold_date = tokenDetails.first_secondary_sold_date;

        const existingToken = await AppDataSource.getRepository(TokenEntity).findOne({
            where: { token_pk: token.token_pk }
        })
        if (existingToken === null) {
            await AppDataSource.getRepository(TokenEntity).save(token);
        }
    }

    async closeConnection(): Promise<void> {
        await AppDataSource.destroy();
    }

    async getTokens() {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        console.log(AppDataSource.isInitialized)
        const tokenRepository = AppDataSource.getRepository(TokenEntity);
        return await tokenRepository.find();
    }

    async getTokenById(tokenId: string) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const tokenRepository = AppDataSource.getRepository(TokenEntity);
        return await tokenRepository.findOneBy({ id: tokenId})
    }

    async updateLatestPrice(tokenId: string, currentPrice: number | undefined) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const tokenRepository = AppDataSource.getRepository(TokenEntity);
        if (currentPrice) {
            await tokenRepository.update(tokenId, { secondary_price: currentPrice })
        }
    }

    async postPriceVariations(tokenPk: number, priceVariation: number) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const tokenRepository = AppDataSource.getRepository(TokenEntity);
    }
}
