import { useEffect, useState } from "react"

/**
 * Calls a function every second, passing the current time as a parameter.
 * 
 * @param f Function to call every second
 */
export const useClockSeconds = (f: (now: Date) => void) => {
    useEffect(() => {
        const timer = setInterval(() => f(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])
}

/**
 * Returns a number that animates from one value to another.
 * 
 * @param from the starting value
 * @param to the ending value
 * @param animate if true, the number will animate from the starting value to the ending value
 * @returns 
 */
export const useNumberAnimation = (from: number, to: number, animate: boolean = false, duration: number = 2000): number => {
    const [amount, setAmount] = useState(from)
    useEffect(() => {
        setAmount(from)
        if (animate) {
            const interval = setInterval(() => {
                setAmount((amount) => {
                    const newAmount = (
                        to > from ? Math.min(to, amount + ((to - from) / (duration / 100))) : 
                        to < from ? Math.max(to, amount - ((from - to) / (duration / 100))) :
                        to
                    )
                    if (newAmount == to) clearInterval(interval)
                    return newAmount
                })
            }, 100)
            return () => clearInterval(interval)
        } else {
            setAmount(to)
        }
    }, [from, to, animate])
    return Math.round(amount)
}
