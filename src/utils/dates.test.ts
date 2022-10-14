import { describe, expect, it } from "vitest"
import { oneWeekBefore, toYearMonthDayString } from "./dates"

describe('toYearMonthDayString()', () => {
    it('Should convert date objects to an YYYY-MM-DD string', () => {
        const dateString = toYearMonthDayString(new Date("1995-12-17T03:24:00"))
        expect(dateString).toBe("1995-12-17")
    })
})

describe('substractOneWeek()', () => {
    it.each([
        ["2022-01-08", "2022-01-01"],
        ["2022-01-07", "2021-12-31"],
        ["2022-10-02", "2022-09-25"],
        ["1900-01-01", "1899-12-25"],
    ])(`When given %s, should return %s`, (given, expected) =>
        expect(toYearMonthDayString(
            oneWeekBefore(new Date(given))
        )).toBe(expected)
    )

    it('Should not modify the given date', () => {
        // as it is a common pitful to do this, given the crappy JS date APIs,
        // we better test for it, just to be safe
        const givenDate = new Date("2022-01-08")
        oneWeekBefore(givenDate)

        expect(toYearMonthDayString(givenDate)).toBe("2022-01-08")
    })
})