import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './ProgressBar.module.scss'

export interface ProgressBarProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  progress: string
}

export const ProgressBar = ({ className, progress }: ProgressBarProps) => {
  return (
    <div className={clsx(styles.progressBar, className)}>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
    </div>
  )
}
