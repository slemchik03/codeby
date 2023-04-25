import clsx from 'clsx'
import {CSSProperties, DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react'
import styles from './Card.module.scss'

export interface CardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode
  contentStyle?: CSSProperties | undefined
  title?: string
  desc?: string
}

export const Card = ({ className, children, contentStyle, title, desc, ...props }: CardProps) => {
  return (
    <div {...props} className={clsx(styles.card, className)}>
      <p className={styles.title}>{title}</p>
      <p className={styles.desc}>{desc}</p>
      <div className={styles.content} style={contentStyle}>{children}</div>
    </div>
  )
}
