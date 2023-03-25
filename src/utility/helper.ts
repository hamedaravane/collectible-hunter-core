export function isInRange(value: number, range: number[]): boolean {
    return value >= range[0] && value < range[1];
}