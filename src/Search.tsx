import { useState } from 'react'
import { Library } from './api'
import styles from './Search.module.scss'

const Search = ({
  libraries,
  onSelect,
}: {
  libraries: Library[]
  onSelect: (id: number) => void
}) => {
  const [query, setQuery] = useState('')

  const found =
    query.length < 2
      ? []
      : libraries
          .filter(lib =>
            simplifyString(lib.Name).includes(simplifyString(query)),
          )
          .slice(0, 10)

  const handleClickResult = (id: number) => {
    onSelect(id)
    setQuery('')
  }

  return (
    <div style={{ zIndex: 1000, position: 'absolute', top: 20, left: 50 }}>
      <input
        type="text"
        placeholder="Search library"
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
