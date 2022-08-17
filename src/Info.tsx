import classNames from 'classnames'
import { FC, HTMLAttributes } from 'react'
import { MdClose } from 'react-icons/md'
import { Library } from './api'
import styles from './Info.module.scss'

const Info: FC<
  { library: Library; onClose: () => void } & HTMLAttributes<HTMLDivElement>
> = ({ library, onClose, className, ...props }) => (
  <div className={classNames(className, styles.container)} {...props}>
    <h1>{library.Name}</h1>
    <button className={styles.close} onClick={onClose}>
      <MdClose size={20} />
    </button>
    <img
      src={library.Picture.Files.medium.url}
      alt={library.Name}
      className={styles.image}
    />
  </div>
)

export default Info
