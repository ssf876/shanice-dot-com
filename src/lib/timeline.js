// A year-only anchor is the numeric year, not a claim that the event was in January.
export const dateValue = (year, month = null) => year + (month === null ? 0 : (month - 1) / 12)

// 2027 is the exclusive upper boundary: the display includes all of 2026.
export const timelineDomain = { start: 2016, end: 2027 }

// Recent dates appear at the top. The same linear scale drives every visual mark.
export const timelinePosition = (value) =>
  100 * (timelineDomain.end - value) / (timelineDomain.end - timelineDomain.start)

export function timelineGeometry(item) {
  const start = dateValue(item.startYear, item.startMonth)
  const end = item.ongoing ? timelineDomain.end : dateValue(item.endYear, item.endMonth)
  return {
    anchor: timelinePosition(start),
    center: timelinePosition((start + end) / 2),
    top: timelinePosition(end),
    height: timelinePosition(start) - timelinePosition(end),
  }
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const endpointLabel = (year, month) => month === null ? '' : `${months[month - 1]} ${year}`

// Give the shortest interval room for a compact tile. This enlarges the entire
// scale uniformly, so all elapsed-time distances remain proportional.
export const timelineHeight = (items, minimumIntervalRem = 8) =>
  100 * minimumIntervalRem / Math.min(...items.map((item) => timelineGeometry(item).height))
