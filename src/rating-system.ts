import { TokenDetails } from "./model/token";
import { isInRange } from "./utility/helper";

export default class RatingSystem {
    priceRating(price: number): number {
        const ranges = [
            { range: [0, 1], rating: 70 },
            { range: [1, 5], rating: 100 },
            { range: [5, 10], rating: 80 },
            { range: [10, 20], rating: 60 },
            { range: [20, 50], rating: 50 },
            { range: [50, 100], rating: 30 },
            { range: [100, 200], rating: 20 },
            { range: [200, 500], rating: 10 },
            { range: [500, Infinity], rating: 5 },
        ];

        const matchingRange = ranges.find(
            (rangeObj: { range: number[]; rating: number }) =>
                isInRange(price, rangeObj.range),
        );

        return matchingRange ? matchingRange.rating : 0;
    }

    royaltyRating(royalty: number): number {
        const ranges = [
            { range: [0, 5], rating: 50 },
            { range: [5, 10], rating: 70 },
            { range: [10, 16], rating: 100 },
            { range: [16, 20], rating: 80 },
            { range: [20, 25], rating: 60 },
            { range: [25, 50], rating: 10 },
            { range: [50, 100], rating: 0 },
        ];

        const matchingRange = ranges.find(
            (rangeObj: { range: number[]; rating: number }) =>
                isInRange(royalty, rangeObj.range),
        );

        return matchingRange ? matchingRange.rating : 0;
    }

    editionRating(edition: number): number {
        const ranges = [
            { range: [0, 5], rating: 10 },
            { range: [5, 10], rating: 50 },
            { range: [10, 16], rating: 100 },
            { range: [16, 20], rating: 80 },
            { range: [20, 30], rating: 60 },
            { range: [30, 50], rating: 40 },
            { range: [50, 100], rating: 20 },
            { range: [100, Infinity], rating: 0 },
        ];

        const matchingRange = ranges.find(
            (rangeObj: { range: number[]; rating: number }) =>
                isInRange(edition, rangeObj.range),
        );

        return matchingRange ? matchingRange.rating : 0;
    }

    soldRating(edition: number): number {
        const ranges = [
            { range: [0, 0.1], rating: 0 },
            { range: [0.1, 0.3], rating: 10 },
            { range: [0.3, 0.5], rating: 30 },
            { range: [0.5, 0.7], rating: 70 },
            { range: [0.7, 0.81], rating: 100 },
            { range: [0.81, 0.9], rating: 60 },
            { range: [0.9, 1], rating: 20 },
        ];

        const matchingRange = ranges.find(
            (rangeObj: { range: number[]; rating: number }) =>
                isInRange(edition, rangeObj.range),
        );

        return matchingRange ? matchingRange.rating : 0;
    }

    averageCollectTimeRating(average: number): number {
        const ranges = [
            { range: [0, 120], rating: 100 }, // 2 minutes
            { range: [120, 300], rating: 90 }, // 5 minutes
            { range: [300, 900], rating: 80 }, // 15 minutes
            { range: [900, 1800], rating: 70 }, // 30 minutes
            { range: [1800, 3600], rating: 60 }, // 1 hour
            { range: [3600, 7200], rating: 50 }, // 2 hour
            { range: [7200, 18000], rating: 40 }, // 5 hour
            { range: [18000, 36000], rating: 30 }, // 10 hour
            { range: [36000, 86400], rating: 20 }, // 1 day
            { range: [86400, Infinity], rating: 0 }, // more than 1 day
        ];

        const matchingRange = ranges.find(
            (rangeObj: { range: number[]; rating: number }) =>
                isInRange(average, rangeObj.range),
        );

        return matchingRange ? matchingRange.rating : 0;
    }

    calculateOverallScore(tokenDetails: TokenDetails): number {
        const weights: Record<string, number> = {
            price: 1.5,
            royalty: 1.2,
            editions: 2,
            soldRate: 3,
            collectTime: 7,
        };

        const price = this.priceRating(tokenDetails.primary_price!);
        const royalty = this.royaltyRating(tokenDetails.royalty);
        const editions = this.editionRating(tokenDetails.editions);
        const soldRate = this.soldRating(tokenDetails.sold_rate);
        const collectTime = this.averageCollectTimeRating(
            tokenDetails.average_collects,
        );

        const weightedScores = {
            price: price * weights.price,
            royalty: royalty * weights.royalty,
            editions: editions * weights.editions,
            soldRate: soldRate * weights.soldRate,
            collectTime: collectTime * weights.collectTime,
        };

        const sumOfWeights = Object.values(weights).reduce(
            (acc, val) => acc + val,
            0,
        );

        return (
            Object.values(weightedScores).reduce((acc, val) => acc + val, 0) /
            sumOfWeights
        );
    }
}