import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './EventBtn.module.scss'

export interface EventBtnProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: 'open' | 'closed'
}

export const EventBtn = ({ className, variant }: EventBtnProps) => {
  return (
    <a href="https://codeby.games/" target="_blank">
      <button
        className={clsx(
          className,
          clsx(
            variant === 'open' && styles.button,
            variant === 'closed' && styles.miniButton
          )
        )}
      >
        {variant === 'open' && <p>Основная CTF</p>}
        {variant === "closed" && "CTF"}
      </button>
    </a>
  )
}
