import Tools from './tools';
import RatingSystem from './rating-system';
import {eventMock} from "./mock/event-mock";

describe('Tools', () => {
    let tools: Tools;

    beforeEach(() => {
        tools = new Tools(new RatingSystem());
    });

    describe('calculatePriceChange', () => {
        test('calculates percentage change correctly', () => {
            expect(tools.calculatePriceChange(100, 120)).toBe(20);
            expect(tools.calculatePriceChange(50, 25)).toBe(-50);
            expect(tools.calculatePriceChange(0, 0)).toBeNull();
            expect(tools.calculatePriceChange(undefined, 100)).toBeNull();
            expect(tools.calculatePriceChange(100, undefined)).toBeNull();
            expect(tools.calculatePriceChange(undefined, undefined)).toBeNull();
        });
    });

    describe('averagePurchaseActionsTime', () => {
        it('calculates the average time between purchases correctly', () => {
            const averageTime = tools.averagePurchaseActionsTime(eventMock);

            expect(averageTime).toBe(60);
        });
    });
});
