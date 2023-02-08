
export interface Calendar {

    now(): Date
}

export const commonCalendar: Calendar = {
    now: () => new Date()
}

export class MutableCalendar implements Calendar {

    private _now: Date

    constructor(now: Date) {
        this._now = now
    }

    now(): Date {
        return this._now
    }

    setNow(now: Date): void {
        this._now = now
    }

    moveMillis(milliseconds: number): void {
        this._now = new Date(this._now.getTime() + milliseconds)
    }

    moveSeconds(seconds: number): void {
        this.moveMillis(seconds * 1000)
    }

    moveMinutes(minutes: number): void {
        this.moveSeconds(minutes * 60)
    }

    moveHours(hours: number): void {
        this.moveMinutes(hours * 60)
    }

    moveDays(days: number): void {
        this.moveHours(days * 24)
    }

    moveWeeks(weeks: number): void {
        this.moveDays(weeks * 7)
    }

    moveMonths(months: number): void {
        this.moveDays(months * 30)
    }
}