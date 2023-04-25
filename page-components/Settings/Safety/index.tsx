import { Input } from '@/components'
import useUser from '@/hooks/useUser'
import { selectSetting } from '@/redux/settings/selector'
import { updateEmail, updatePassword } from '@/redux/settings/slice'
import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Safety.module.scss'

export const Safety = memo(({}) => {
  const user = useUser()
  const {email, password} = useSelector(selectSetting)
  const [confirmEmail, setConfirmEmail] = useState<string>('')
  const [oldPassword, setOldPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const dispatch = useDispatch();

  return (
    <form  className={styles.safety}>
      <div className={styles.inputs}>
        <Input
          value={user?.email || ""}
          status="default"
          desc='*Email является логином для входа.'
          placeholder='game@codeby.email'
          type='email'
          title='Email'
          className={styles.email}
          disabled
        />
        <div>

        </div>
        <Input
          value={email}
          onChange={(e) => dispatch(updateEmail(e.currentTarget.value))}
          status={
              email === "" ? "default" : (email.length <= 3 ? "false" : "true")
          }
          className={styles.newEmail}
          title='Новый email'
          type='email'
        />
        <Input
          value={password}
          onChange={(e) => dispatch(updatePassword(e.currentTarget.value))}
          status={
              password === "" ? "default" : (password.length <= 3 ? "false" : "true")
          }
          className={styles.newPassword}
          title='Новый пароль'
          type='password'
        />
        {/*<Input*/}
        {/*  value={confirmEmail}*/}
        {/*  onChange={(e) => setConfirmEmail(e.currentTarget.value)}*/}
        {/*  status={*/}
        {/*      confirmEmail === '' ? 'default' : (confirmEmail.length <= 3 ? 'false' : (confirmEmail === email ? 'true' : 'false'))*/}
        {/*  }*/}
        {/*  className={styles.confirmEmail}*/}
        {/*  title='Подтвердите email'*/}
        {/*  type='email'*/}
        {/*/>*/}
        {/*<Input*/}
        {/*  value={confirmPassword}*/}
        {/*  onChange={(e) => setConfirmPassword(e.currentTarget.value)}*/}
        {/*  status={*/}
        {/*    confirmPassword === ''*/}
        {/*      ? 'default'*/}
        {/*      : confirmPassword !== oldPassword*/}
        {/*      ? 'false'*/}
        {/*      : confirmPassword === password*/}
        {/*      ? 'true'*/}
        {/*      : 'default'*/}
        {/*  }*/}
        {/*  className={styles.confirmPassword}*/}
        {/*  title='Подтвердите пароль'*/}
        {/*  type='password'*/}
        {/*/>*/}
      </div>
    </form>
  )
})
