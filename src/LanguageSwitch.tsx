import classNames from 'classnames'
import { FC } from 'react'
import styles from './LanguageSwitch.module.scss'

const languages = {
  en: 'English',
  fi: 'suomi',
  sv: 'svenska',
  ru: 'русский язык',
}

export type Language = keyof typeof languages

const LanguageSwitch: FC<{
  menuClassName?: string
  language: Language
  onChangeLanguage: (language: Language) => void
}> = ({ language, onChangeLanguage, menuClassName }) => (
  <select
    className={classNames(styles.languageSelect, menuClassName)}
    value={language}
    onChange={e => onChangeLanguage(e.target.value as Language)}
  >
    {(Object.keys(languages) as Language[]).map(lang => (
      <option key={lang}>{lang}</option>
    ))}
  </select>
)

export default LanguageSwitch
