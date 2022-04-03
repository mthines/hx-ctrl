/**
 * Sleep for X amount of milisecounds
 */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
