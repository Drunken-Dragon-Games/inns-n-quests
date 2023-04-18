import { useEffect, useState } from "react"

const useAnimatedText = (text: string, duration: number, animate: boolean): string => {
    const [renderText, setRenderText] = useState(text.substring(0, 1))
    useEffect(() => {
        if (!animate) return setRenderText(text)
        const momentsAmount = duration / 100
        let moment = 0
        const interval = setInterval(() => {
            const renderText = text.substring(0, Math.max(1, Math.floor(text.length * moment / momentsAmount)))
            setRenderText(renderText)
            if (moment++ > momentsAmount) clearInterval(interval)
        }, 100)
        return () => clearInterval(interval)
    }, [text, duration])
    return renderText
}

export const AnimatedText = ({ text, duration, animate }: { text: string, duration: number, animate: boolean }) => {
    const renderText = useAnimatedText(text, duration, animate)
    return <span>{renderText}</span>
}
