import styles from './Badge.module.scss'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface BadgeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string
}

export const Badge = ({ className, title }: BadgeProps) => {
  return (
    <div className={styles.badge}>
      <p>{title}</p>
    </div>
  )
}
