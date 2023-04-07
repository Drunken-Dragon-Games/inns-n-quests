import { useEffect, useRef, useState } from "react"

/**
 * Effect hook that remembers the last value of a variable. 
 * Useful for remembering the last value before a state change within a component.
 * 
 * @param currentValue 
 * @param initialValue 
 * @returns 
 */
export const useRememberLastValue = <T>(currentValue: T, initialValue: T): T => {
    const valueRef = useRef<T>(initialValue)
    const lastValue = valueRef.current
    useEffect(() => {
        valueRef.current = currentValue
    }, [currentValue])
    return lastValue
}

/**
 * This is useful for animating the removal of elements from an array.
 * Returns all the previous and current values with a flag indicating whether the value is currently in the array.
 * 
 * @param currentValues 
 * @param initialValues 
 * @returns 
 */
export const useTagRemovals = <T>(currentValues: T[], initialValues: T[], reverse: boolean = false): { value: T, display: boolean}[] => {
    const lastValuesRef = useRef(initialValues)
    const lastValues = lastValuesRef.current
    const [difference, setDifference] = useState<{value: T, display: boolean}[]>([])
    useEffect(() => {
        lastValuesRef.current = currentValues
        const uniqueValues = Array.from(new Set([...lastValues, ...currentValues]))
        const result = uniqueValues.map(value => ({ value, display: currentValues.includes(value) }))
        setDifference(reverse ? result.reverse() : result)
    }, [currentValues])
    return difference
}

/**
 * Allows components to react to changes in the local storage api.
 * 
 * @param key 
 * @param fallbackValue 
 * @returns 
 */
export function useLocalStorage<T>(key: string, fallbackValue?: T) {
    const [value, setValue] = useState(fallbackValue);
    useEffect(() => {
        const stored = localStorage.getItem(key);
        setValue(stored ? JSON.parse(stored) : fallbackValue);
    }, [fallbackValue, key]);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}