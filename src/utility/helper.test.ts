import {timestampModifier} from './helper';

describe('timestampModifier', () => {
    test('should convert a string to a Date object', () => {
        const dateString = '2023-03-23T15:21:00+00:00';
        const expectedDate = new Date(dateString);

        const result = timestampModifier(dateString);

        expect(result).toEqual(expectedDate);
    });
});