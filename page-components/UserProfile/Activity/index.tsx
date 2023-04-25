import clsx from 'clsx'
import { Chart } from './Chart'
import styles from './Activity.module.scss'
import { ICompletedTask } from '@/utils/server/get/getCompletedTasks'
import { FC } from 'react'

interface IProps {
  lastCompletedTasks: ICompletedTask[]
}

export const Activity: FC<IProps> = ({lastCompletedTasks}) => {

  return (
    <div className={clsx(styles.activity)}>
      <div className={styles.chart}>
        <Chart lastCompletedTasks={lastCompletedTasks}/>
      </div>
    </div>
  )
}
