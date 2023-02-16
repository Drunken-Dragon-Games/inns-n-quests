import { useState, useEffect } from "react"

/**
 * Computes the height of an image based on its width and the original image's width and height
 * 
 * @param src The image source
 * @param desiredWidth The intended width of the image
 */
export const useComputeHeightFromOriginalImage = (src: string, desiredWidth: number): number => {
    const [desiredHeight, setHeight] = useState<number>(0)
    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            const height = (desiredWidth * img.height) / img.width
            setHeight(Math.round(height * 10) / 10)
        }
    }, [src])
    return desiredHeight
}
