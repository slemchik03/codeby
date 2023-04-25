import clsx from 'clsx'
import { DetailedHTMLProps, FormEvent, HTMLAttributes, useState } from 'react'
import { IconButton } from '../IconButton'
import styles from './Input.module.scss'

export interface InputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  title?: string
  placeholder?: string
  type: 'text' | 'textarea' | 'email' | 'password' | 'file'
  desc?: string
  status: 'default' | 'true' | 'false'
  value: string | number
  onChange?: (e: FormEvent<HTMLInputElement>) => void
  disabled?: boolean;
}

export const Input = ({
  onChange,
  status,
  className,
  title,
  placeholder,
  type,
  desc,
  value,
  disabled
}: InputProps) => {
  return (
    <div className={clsx(className, styles.inputContainer)}>
      <span className={styles.title}>{title}</span>
      {desc && <span className={styles.desc}>{desc}</span>}
      {type !== 'textarea' && (
        <input
          disabled={disabled}
          onChange={onChange}
          value={value}
          className={clsx(
            { [styles.default]: status === 'default' },
            { [styles.true]: status === 'true' },
            { [styles.false]: status === 'false' }
          )}
          type={type}
          placeholder={placeholder}
        />
      )}
      {/* @ts-ignore does not matter */}
      {type === 'textarea' && <textarea value={value} onChange={onChange} placeholder={placeholder} />}
    </div>
  )
}
