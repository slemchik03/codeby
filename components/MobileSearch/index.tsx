import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, useState } from 'react'
import Icon from '../../public/icons/Search.svg'
import Menu from '../../public/icons/menu.svg'

import styles from './MobileSearch.module.scss'

export interface MobileSearchProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const MobileSearch = ({ className }: MobileSearchProps) => {
  // TEST
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className={clsx(className, styles.mobileSearch)}>
      {!open && <Icon onClick={() => setOpen(!open)} />}
      {open && (
        <div className={styles.input}>
          <input type='text' placeholder='Поиск' />
          <span onClick={() => setOpen(false)}>X</span>
        </div>
      )}
    </div>
  )
}
