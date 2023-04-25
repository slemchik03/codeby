import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import Icon from '../../public/icons/Search.svg'
import styles from './Search.module.scss'

export interface SearchProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Search = ({ className }: SearchProps) => {
  return (
    <div className={clsx(styles.search, className)}>
      <input placeholder='Поиск' type='text' />
      <Icon />
    </div>
  )
}
