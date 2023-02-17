
/**
 * A simple class to help with layout.
 * Inteded to be used together with the css-in-js library styled-components.
 */
export class Units {

    constructor(
        private readonly units: string, 
        private readonly scale: number
    ) {}

    public u(amount?: number): string {
        if (amount) return `${amount * this.scale}${this.units}`
        else return ""
    }
}

export const vmax = (scale: number) => new Units("vmax", scale)

export const vmax1 = new Units("vmax", 1)

export const px = (scale: number) => new Units("px", scale)

export const px1 = new Units("px", 1)

export const em = (scale: number) => new Units("em", scale)

export const em1 = new Units("em", 1)

export const rem = (scale: number) => new Units("rem", scale)

export const rem1 = new Units("rem", 1)

export const vw = (scale: number) => new Units("vw", scale)

export const vw1 = new Units("vw", 1)

export const vh = (scale: number) => new Units("vh", scale)

export const vh1 = new Units("vh", 1)

export const percent = (scale: number) => new Units("%", scale)

export const percent1 = new Units("%", 1)

export const mm = (scale: number) => new Units("mm", scale)

export const mm1 = new Units("mm", 1)

export const cm = (scale: number) => new Units("cm", scale)

export const cm1 = new Units("cm", 1)

