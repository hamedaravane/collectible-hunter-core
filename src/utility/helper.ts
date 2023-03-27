export function isInRange(value: number, range: number[]): boolean {
    return value >= range[0] && value < range[1];
}

export function timestampModifier(value: string): number {
    return new Date(value).getTime() / 1000;
}
