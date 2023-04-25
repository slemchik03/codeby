import Icon from '../../../public/icons/no-complete.svg'
import styles from './NoComplete.module.scss'

export const NoComplete = () => {
  return (
    <div className={styles.noComplete}>
      <Icon />
      <p className={styles.title}>Вы еще не выполняли задания!</p>
      <p className={styles.desc}>
        Здесь будут отображаться выполненные вами задания
      </p>
    </div>
  )
}
