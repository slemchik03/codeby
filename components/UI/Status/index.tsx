import clsx from 'clsx'
import { TaskStatus } from '@/types/task'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './Status.module.scss'

export interface StatusProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status: TaskStatus
}

export const Status = ({ className, status }: StatusProps) => {
  switch (status) {
    case 'лёгкая':
      return (
        <div className={clsx(className, styles.status, styles.easy)}>
          <span>Лёгкий</span>
        </div>
      )
    case 'средняя':
      return (
        <div className={clsx(className, styles.status, styles.medium)}>
          <span>Средний</span>
        </div>
      )
    case 'сложная':
      return (
        <div className={clsx(className, styles.status, styles.hard)}>
          <span>Сложный</span>
        </div>
      )
    default:
      return <></>
  }
}
