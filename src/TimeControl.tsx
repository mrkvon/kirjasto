import styles from './TimeControl.module.scss'

const TimeControl = ({
  active,
  onToggle,
  from,
  to,
  time,
  onChangeTime,
}: {
  active: boolean
  onToggle: () => void
  from: number
  to: number
  time: number
  onChangeTime: (time: number) => void
}) => (
  <div className={styles.container}>
    <button onClick={onToggle}>Timeline {active ? 'On' : 'Off'}</button>
    {active && (
      <input
        className={styles.timeline}
        value={time}
        min={from}
        max={to}
        step={60 * 1000 * 15}
        onChange={e => {
          onChangeTime(+e.target.value)
        }}
        type="range"
      />
    )}
    {active && (
      <span>
        {new Date(time).toString().substring(0, 3) +
          ' ' +
          new Date(time).toLocaleString('fi')}
      </span>
    )}
  </div>
)

export default TimeControl
