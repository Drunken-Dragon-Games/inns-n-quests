import { useEffect } from "react"

export const useClockSeconds = (f: (now: Date) => void) => {
    useEffect(() => {
        const timer = setInterval(() => f(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])
}
