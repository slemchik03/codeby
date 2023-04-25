import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import styles from './PointsCard.module.scss'

export interface PointsCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string
  value: number
}

export const PointsCard = ({ className, title, value }: PointsCardProps) => {
  return (
    <div className={clsx(styles.pointsCard, className)}>
      <span className={styles.title}>{title}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
