import classNames from 'classnames'
import { HTMLAttributes } from 'react'
import { FaRegClock as ClockIcon } from 'react-icons/fa'
import { Library } from './api'
import OpeningVisualization from './OpeningVisualization'
import styles from './TimeControl.module.scss'

const TimeControl = ({
  libraries,
  active,
  onToggle,
  from,
  to,
  time,
  onChangeTime,
  className,
  ...props
}: {
  libraries: Library[]
  active: boolean
  onToggle: () => void
  from: number
  to: number
  time: number
  onChangeTime: (time: number) => void
} & HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames(styles.container, className)} {...props}>
    {active && (
      <span>
        {new Date(time).toString().substring(0, 3) +
          ' ' +
          new Date(time).toLocaleString('fi')}
      </span>
    )}
    <br />
    <button
      className={classNames(styles.button, active && styles.on)}
      onClick={onToggle}
    >
      <ClockIcon size={20} />
    </button>
    {active && (
      <>
        <OpeningVisualization
          className={styles.visualization}
          time={time}
          libraries={libraries}
        />
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
      </>
    )}
  </div>
)

export default TimeControl
