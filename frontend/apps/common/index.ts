export * from "./backend-api"
export * from "./common-css"
export * from "./components"
export * from "./internal-state-effects"
export * from "./staking-quests"
export * from "./time-effects"
export * from "./units"
export * from "./token-displayer"

export type IdSet<T> = { [id: string]: T }

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined
}

export function isEmpty<TValue>(value: TValue | null | undefined): value is null | undefined {
    return value == null || value == undefined
}

export const not = (x: boolean): boolean => !x

/**
 * Taken from https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
export const simpleHash = (s: string): number => {
    let h = 0, l = s.length, i = 0
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0
    return h
}