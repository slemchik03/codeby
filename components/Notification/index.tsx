import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './Notification.module.scss'
import Icon from '../../public/icons/notification.svg'

export interface NotificationProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Notification = ({ className }: NotificationProps) => {
  return (
    <div className={clsx(className, styles.bell)}>
      <Icon />
    </div>
  )
}
