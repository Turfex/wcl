/**
 * Number of decimal digits to round to
 */
const scale = 3;

/**
 * Exact points you want for specific ranks
 * You can freely change these values
 */
const RANK_POINTS = {
    1: 200,
    2: 180,
    3: 165,
    4: 150,
    5: 140,
    10: 120,
    25: 90,
    50: 60,
    75: 35,
    100: 20,
    150: 5,
};

/**
 * Linear interpolation between defined rank points
 */
function interpolate(rank, table) {
    const keys = Object.keys(table)
        .map(Number)
        .sort((a, b) => a - b);

    if (rank <= keys[0]) return table[keys[0]];
    if (rank >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

    for (let i = 0; i < keys.length - 1; i++) {
        const r1 = keys[i];
        const r2 = keys[i + 1];

        if (rank >= r1 && rank <= r2) {
            const t = (rank - r1) / (r2 - r1);
            return table[r1] + t * (table[r2] - table[r1]);
        }
    }
}

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 150) return 0;
    if (rank > 75 && percent < 100) return 0;

    let base = interpolate(rank, RANK_POINTS);

    let factor =
        (percent - (minPercent - 1)) /
        (100 - (minPercent - 1));

    factor = Math.max(0, Math.min(1, factor));

    let result =
        percent === 100
            ? base
            : base * (2 / 3) * factor;

    return Math.max(round(result), 0);
}

/**
 * Round number to fixed decimal scale
 */
export function round(num) {
    if (!('' + num).includes('e')) {
        return +(
            Math.round(num + 'e+' + scale) +
            'e-' +
            scale
        );
    } else {
        const arr = ('' + num).split('e');
        const sig = +arr[1] + scale > 0 ? '+' : '';
        return +(
            Math.round(
                +arr[0] + 'e' + sig + (+arr[1] + scale)
            ) +
            'e-' +
            scale
        );
    }
}
