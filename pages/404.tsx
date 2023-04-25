import { withLayout } from '@/layout/Layout'
import styles from '../styles/NotFound.module.scss'
import Image from 'next/image'

import notFound from '../public/images/bg404.png'
import { Button } from '@/components'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <Image src={notFound} alt='' />
      <span className={styles.title}>Страница не найдена</span>
      <Link href='/'>
        <Button
          className={styles.button}
          variant='green'
          text='Вернуться на главную'
        />
      </Link>
    </div>
  )
}

export default withLayout(NotFound, "protected")
