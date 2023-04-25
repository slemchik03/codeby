import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './Button.module.scss'

export interface ButtonProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: 'green' | 'white' | 'red'
  text: string
}

export const Button = ({ className, variant, text, ...props }: ButtonProps) => {
  switch (variant) {
    case 'green':
      return (
        <button
          {...props}
          className={clsx(className, styles.button, styles.green)}
        >
          {text}
        </button>
      )
    case 'white':
      return (
        <button
          {...props}
          className={clsx(className, styles.button, styles.white)}
        >
          {text}
        </button>
      )
    case 'red':
      return (
        <button
          {...props}
          className={clsx(className, styles.button, styles.red)}
        >
          {text}
        </button>
      )
    default:
      return <></>
  }
}