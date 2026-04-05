/**
 * Verhoeff algorithm for checksum verification of Aadhaar numbers
 */
const multiplicationTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const permutationTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const inverseTable = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates the format and checksum of an Aadhaar card number.
 * @param {string} number - The 12-digit Aadhaar number string
 * @returns {boolean} - Returns true if the number is valid
 */
export const validateAadhaar = (number) => {
    // 1. Must be a string of exactly 12 digits
    if (!/^\d{12}$/.test(number)) return false;

    // 2. Cannot start with 0 or 1 (usually starts with 2-9)
    if (number[0] === '0' || number[0] === '1') return false;

    // 3. Verhoeff algorithm check
    let checksum = 0;
    const digits = number.split('').reverse().map(Number);

    for (let i = 0; i < digits.length; i++) {
        checksum = multiplicationTable[checksum][permutationTable[i % 8][digits[i]]];
    }

    return checksum === 0;
};
