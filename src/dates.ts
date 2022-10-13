type d = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type YYYY = `19${d}${d}` | `20${d}${d}`
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`
type DD = `${0}${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`

export type YearMonthDayString = `${YYYY}-${MM}-${DD}`

// Instead of doing crazy date formatting stuff, we are using toLocaleDateString
// with the "en-CA" locale, which is conveniently defined as YYYY-MM-DD.
// See:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
// https://leap.hcldoc.com/help/topic/SSS28S_8.2.1/XFDL_Specification/i_xfdl_r_formats_en_CA.html
export const toYearMonthDayString = (date: Date) =>
    date.toLocaleDateString("en-CA") as YearMonthDayString

export const oneWeekBefore = (date: Date): Date => {
    const earlier = new Date(date)
    earlier.setDate(date.getDate() - 7)

    return earlier
}

export const oneWeekAgo = (): YearMonthDayString =>
    toYearMonthDayString(oneWeekBefore(new Date()))
