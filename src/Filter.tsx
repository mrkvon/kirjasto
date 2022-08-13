import { useState } from 'react'
import Search from './Search'

const Filter = ({
  options,
  selectedOptionIds,
  onToggle,
  onAdd,
  onRemove,
}: {
  options: { id: number; name: string }[]
  selectedOptionIds: number[]
  onToggle: (id: number) => void
  onAdd: (id: number) => void
  onRemove: (id: number) => void
}) => {
  const [displayedOptionIds, setDisplayedOptionIds] = useState<number[]>([])
  return (
    <div
      style={{
        zIndex: 1000,
        position: 'absolute',
        top: 20,
        left: 300,
        backgroundColor: 'white',
      }}
    >
      <Search
        items={options.map(({ id, name }) => ({ Id: id, Name: name }))}
        onSelectItem={(id: number) => {
          setDisplayedOptionIds(options =>
            options.includes(id) ? options : [...options, id],
          )
          onAdd(id)
        }}
      />
      {options
        .filter(o => displayedOptionIds.includes(o.id))
        .map(({ id, name }) => (
          <label key={id}>
            <input
              type="checkbox"
              id={String(id)}
              checked={selectedOptionIds.includes(id)}
              onChange={() => onToggle(id)}
            />
            {name}
            <button
              onClick={() => {
                setDisplayedOptionIds(state => state.filter(sid => sid !== id))
                onRemove(id)
              }}
            >
              x
            </button>
          </label>
        ))}
    </div>
  )
}
export default Filter
