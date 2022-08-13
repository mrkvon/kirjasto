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

      let opensTime = new Date(schedule.Date)
      let closesTime = new Date(schedule.Date)
      opensTime.setHours(opens)
      closesTime.setHours(closes)
      opensTime.setMinutes((opens - Math.floor(opens)) * 60)
      closesTime.setMinutes((closes - Math.floor(closes)) * 60)
      opensTime.setSeconds(0)
      closesTime.setSeconds(0)
      opensTime.setMilliseconds(0)
      closesTime.setMilliseconds(0)

      return time >= opensTime.getTime() && time < closesTime.getTime()
    })
    return foundTime?.Status ?? 0
  } catch {
    return -1
  }
}

export const getSchedule = (library: Library, time: number) => {
  const schedule = library.Schedules.find(
    schedule =>
      time >= new Date(schedule.Date).setHours(0) &&
      time < new Date(schedule.Date).setHours(24),
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
  const firstDay = schedules[0].Date
  const lastDay = schedules[schedules.length - 1].Date

  return [new Date(firstDay).setHours(0), new Date(lastDay).setHours(24)]
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

    let opens = new Date(schedule.Date)
    let closes = new Date(schedule.Date)
    opens.setHours(openTime)
    closes.setHours(closeTime)
    opens.setMinutes((openTime - Math.floor(openTime)) * 60)
    closes.setMinutes((closeTime - Math.floor(closeTime)) * 60)
    opens.setSeconds(0)
    closes.setSeconds(0)
    opens.setMilliseconds(0)
    closes.setMilliseconds(0)

    return {
      opens: opens.getTime(),
      closes: closes.getTime(),
      status: Status,
    }
  })

/*
function getTimes(kirjasto: Library, day: number) {
  const { times } = kirjasto.Schedules[day].Sections.SelfService
  return times
}

function getDate(kirjasto: Library, day: number) {
  return [kirjasto.Schedules[day].Date, kirjasto.Schedules[day].LongDayname]
}
*/
