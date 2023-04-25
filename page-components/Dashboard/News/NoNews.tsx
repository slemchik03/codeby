import Icon from '../../../public/icons/no-news.svg'
import styles from './NoNews.module.scss'

export const NoNews = () => {
  return (
    <div className={styles.noNews}>
      <Icon />
      <p className={styles.title}>Новостей ещё нет</p>
      <p className={styles.desc}>
        Здесь будут отображаться новости платформы
      </p>
    </div>
  )
}
