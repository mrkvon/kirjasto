import { Library } from './api'
import styles from './Info.module.scss'

const Info = ({ library }: { library: Library }) => (
  <div className={styles.container}>
    <h1>{library.Name}</h1>
    <img
      src={library.Picture.Files.medium.url}
      alt={library.Name}
      style={{ width: '100%' }}
    />
  </div>
)

export default Info
