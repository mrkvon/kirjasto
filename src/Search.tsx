import React, { FC, useState } from 'react'
import styles from './Search.module.scss'

interface SearchProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { Id: number; Name: string }[]
  placeholder?: string
  onSelectItem: (id: number) => void
}

const Search: FC<SearchProps> = ({
  items,
  onSelectItem,
  placeholder = 'Search',
  ...props
}) => {
  const [query, setQuery] = useState('')

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

  return (
    <div {...props}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {found.length > 0 && (
        <ul className={styles.list}>
          {found.map(a => (
            <li className={styles.item} onClick={() => handleClickResult(a.Id)}>
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
