import classNames from 'classnames'
import React, { FC, useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { FaSearch } from 'react-icons/fa'
import styles from './Search.module.scss'

interface SearchProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean
  onToggle: () => void
  items: { Id: number; Name: string }[]
  placeholder?: string
  menuClassName?: string
  onSelectItem: (id: number) => void
  Icon?: IconType | null
}

const Search: FC<SearchProps> = ({
  active,
  onToggle,
  items,
  onSelectItem,
  placeholder = 'Search',
  Icon = FaSearch,
  menuClassName,
  ...props
}) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const found =
    query.length < 2
      ? []
      : items
          .filter(lib =>
            simplifyString(lib.Name).includes(simplifyString(query)),
          )
          .slice(0, 10)

  const handleClickResult = (id: number) => {
    onSelectItem(id)
    setQuery('')
  }

  useEffect(() => {
    if (active && inputRef.current) inputRef.current.focus()
  }, [active])

  return (
    <div {...props}>
      <label>
        {Icon && (
          <button
            className={classNames(menuClassName, styles.button)}
            onClick={onToggle}
          >
            <Icon size={20} />
          </button>
        )}
        {active && (
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        )}
      </label>
      {active && found.length > 0 && (
        <ul className={styles.list}>
          {found.map(a => (
            <li
              key={a.Id}
              className={styles.item}
              onClick={() => handleClickResult(a.Id)}
            >
              {a.Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Search

// https://stackoverflow.com/a/37511463
// makes string lowercase and removes diacritics
const simplifyString = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
