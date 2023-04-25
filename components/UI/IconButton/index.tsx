import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './IconButton.module.scss'

import Add from '../../../public/icons/add.svg'
import Edit from '../../../public/icons/edit.svg'
import Delete from '../../../public/icons/delete.svg'
import More from '../../../public/icons/more.svg'
import Plus from '../../../public/icons/plus.svg'

export interface IconButtonProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  type: 'add' | 'edit' | 'delete' | 'more' | 'plus'
}

export const IconButton = ({ className, type, ...props }: IconButtonProps) => {
  switch (type) {
    case 'add':
      return (
        <button
          {...props}
          className={clsx(styles.iconButton, className, styles.add)}
        >
          <Add />
        </button>
      )
    case 'edit':
      return (
        <button {...props} className={clsx(styles.iconButton, className)}>
          <Edit />
        </button>
      )
    case 'delete':
      return (
        <button {...props} className={clsx(styles.iconButton, className)}>
          <Delete />
        </button>
      )
    case 'more':
      return (
        <button {...props} className={clsx(styles.iconButton, className)}>
          <More />
        </button>
      )
    case 'plus':
      return (
        <button {...props} className={clsx(styles.iconButton, className)}>
          <Plus />
        </button>
      )

    default:
      return <></>
  }
}
