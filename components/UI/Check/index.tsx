import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './Check.module.scss'
import CheckIcon from '../../../public/icons/check.svg'

export interface CheckProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  check: boolean
}

export const Check = ({ className, check }: CheckProps) => {
  return (
    <div className={clsx(className, styles.check)}>
      <CheckIcon className={clsx(styles.icon, { [styles.checked]: check })} />
    </div>
  )
}
