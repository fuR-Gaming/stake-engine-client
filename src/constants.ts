/**
 * Constants for amount conversion between different systems
 * 
 * @description
 * The Stake Engine RGS uses different multipliers for amount representation:
 * - API amounts: 1,000,000 = $1.00 (6 decimal places)
 * - Book amounts: 100 = $1.00 (2 decimal places)
 */

/** In API, amount 1000000 is 1 dollar. */
export const API_AMOUNT_MULTIPLIER = 1000000;

/** In books, amount 100 is 1 dollar. */
export const BOOK_AMOUNT_MULTIPLIER = 100;