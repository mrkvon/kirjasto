import classNames from 'classnames'
import { FC, HTMLAttributes, useEffect, useState } from 'react'
import { FaFilter } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import styles from './Filter.module.scss'
import Search from './Search'

const Filter = ({
  active,
  onToggleActive,
  options,
  selectedOptionIds,
  onToggle,
  onAdd,
  onRemove,
  onClearAll,
  ...props
}: {
  active: boolean
  onToggleActive: () => void
  options: { id: number; name: string }[]
  selectedOptionIds: number[]
  onToggle: (id: number) => void
  onAdd: (id: number) => void
  onRemove: (id: number) => void
  onClearAll: () => void
} & HTMLAttributes<HTMLDivElement>) => {
  const [displayedOptionIds, setDisplayedOptionIds] = useState<number[]>([])

  useEffect(() => {
    const selectedNonDisplayedOptions = selectedOptionIds.filter(
      id => !displayedOptionIds.includes(id),
    )
    if (selectedNonDisplayedOptions.length > 0) {
      setDisplayedOptionIds(ids => [...ids, ...selectedNonDisplayedOptions])
    }
  }, [selectedOptionIds, displayedOptionIds])

  return (
    <div {...props}>
      <button
        className={classNames(
          styles.toggleButton,
          selectedOptionIds.length > 0 && styles.active,
        )}
        onClick={onToggleActive}
      >
        <FaFilter size={20} />
      </button>

      {active && (
        <>
          <Search
            placeholder="Search services"
            Icon={null}
            active
            onToggle={() => {}}
            items={options.map(({ id, name }) => ({ Id: id, Name: name }))}
            onSelectItem={(id: number) => {
              setDisplayedOptionIds(options =>
                options.includes(id) ? options : [...options, id],
              )
              onAdd(id)
            }}
            className={styles.search}
          />
          {displayedOptionIds.length > 0 && (
            <div className={styles.optionsContainer}>
              <ul className={styles.optionsList}>
                {options
                  .filter(o => displayedOptionIds.includes(o.id))
                  .map(option => (
                    <li key={option.id}>
                      <FilterOption
                        option={option}
                        checked={selectedOptionIds.includes(option.id)}
                        onClickChecked={() => onToggle(option.id)}
                        onClose={() => {
                          setDisplayedOptionIds(state =>
                            state.filter(id => id !== option.id),
                          )
                          onRemove(option.id)
                        }}
                      />
                    </li>
                  ))}
              </ul>
              <button
                onClick={() => {
                  onClearAll()
                  setDisplayedOptionIds([])
                }}
                className={styles.clearAll}
              >
                CLEAR ALL
              </button>
              <div className={styles.clearfix}></div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Filter

type FilterOptionType = {
  id: number
  name: string
}

const FilterOption: FC<{
  option: FilterOptionType
  checked: boolean
  onClickChecked: () => void
  onClose: () => void
}> = ({ option, checked, onClickChecked, onClose }) => (
  <div className={styles.option}>
    <label>
      <input
        type="checkbox"
        id={String(option.id)}
        checked={checked}
        onChange={onClickChecked}
      />
      {option.name}
    </label>
    <button onClick={onClose}>
      <MdClose />
    </button>
  </div>
)
