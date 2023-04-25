import clsx from 'clsx'
import { DetailedHTMLProps, FormEvent, HTMLAttributes, useState } from 'react'
import styles from './RadioInput.module.scss'

export interface RadioInputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  onChange: (e: FormEvent<HTMLInputElement>) => void
  text: string
  checked: boolean
}

export const RadioInput = ({
  className,
  onChange,
  text,
  checked,
  ...props
}: RadioInputProps) => {
  return (
    <div className={styles.radioInput}>
      <input
        {...props}
        checked={checked}
        onChange={onChange}
        type='radio'
        className={clsx(className, styles.radio)}
      />
      <span className={styles.text}>{text}</span>
    </div>
  )
}
