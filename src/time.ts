import { Library, Schedule } from './api'

export const libraryOpen = (library: Library, time: number): -1 | 0 | 1 | 2 => {
  // -1 : errored - schedule doesn't exist
  // 0 : closed
  // 1 : open
  // 2 : self-service
  try {
    const schedule = getSchedule(library, time)
    // get schedule time
    const foundTime = schedule.Sections.SelfService.times.find(t => {
      const opens = parseTime(t.Opens)
      const closes = parseTime(t.Closes)

      let opensTime = setTime(opens, new Date(schedule.Date).getTime())
      let closesTime = setTime(closes, new Date(schedule.Date).getTime())

      return time >= opensTime && time < closesTime
    })
    return foundTime?.Status ?? 0
  } catch {
    return -1
  }
}

export const getSchedule = (library: Library, time: number) => {
  const schedule = library.Schedules.find(
    schedule =>
      time >= setTime(0, new Date(schedule.Date).getTime()) &&
      time < setTime(24, new Date(schedule.Date).getTime()),
  )
  if (!schedule) {
    throw new Error('schedule not found')
  }
  return schedule
}

export const getTimeRange = (libraries: Library[]): [number, number] => {
  if (!libraries.length) return [0, 0]
  // TODO get the longest schedules array
  const schedules = libraries[0].Schedules
  if (schedules.length === 0)
    return [setTime(0, Date.now()), setTime(24, Date.now())]
  const firstDay = schedules[0].Date
  const lastDay = schedules[schedules.length - 1].Date

  return [
    setTime(0, new Date(firstDay).getTime()),
    setTime(24, new Date(lastDay).getTime()),
  ]
}

const parseTime = (a: string) => {
  if (!a) throw new Error('no time to parse')
  const [hours, minutes] = a.split(':')
  return Number(hours) + Number(minutes) / 60
}

type OpeningTime = {
  opens: number
  closes: number
  status: 1 | 2
}

export const schedule2OpeningTimes = (schedule: Schedule): OpeningTime[] =>
  schedule.Sections.SelfService.times.map(({ Opens, Closes, Status }) => {
    const openTime = parseTime(Opens)
    const closeTime = parseTime(Closes)

    const opens = setTime(openTime, new Date(schedule.Date).getTime())
    const closes = setTime(closeTime, new Date(schedule.Date).getTime())

    return {
      opens,
      closes,
      status: Status,
    }
  })

/**
 * Given the time in real number hours, returns hours, minutes, seconds (rounded) and milliseconds (not rounded)
 */
const splitTime = (time: number): [number, number, number, number] => {
  const hours = Math.floor(time)
  const remainderMinutes = (time - hours) * 60
  const minutes = Math.floor(remainderMinutes)
  const remainderSeconds = (remainderMinutes - minutes) * 60
  const seconds = Math.floor(remainderSeconds)
  const milliseconds = (remainderSeconds - seconds) * 1000

  return [hours, minutes, seconds, milliseconds]
}

console.log('............', splitTime(1.22132))

/**
 * Set a date (timestamp) to a specific time
 * @param time - time (like 4.5 when you want to express 4:30)
 * @param timestamp
 * @returns timestamp changed to the specific hour given by `time`
 * @TODO make sure this works always in Helsinki time
 */
const setTime = (time: number, timestamp: number): number => {
  const [hours, minutes, seconds, milliseconds] = splitTime(time)

  let date = new Date(timestamp)
  date.setHours(hours)
  date.setMinutes(minutes)
  date.setSeconds(seconds)
  date.setMilliseconds(milliseconds)

  return date.getTime()
}

/*
function getTimes(kirjasto: Library, day: number) {
  const { times } = kirjasto.Schedules[day].Sections.SelfService
  return times
}

function getDate(kirjasto: Library, day: number) {
  return [kirjasto.Schedules[day].Date, kirjasto.Schedules[day].LongDayname]
}
*/
