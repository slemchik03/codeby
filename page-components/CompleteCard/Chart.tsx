import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import styles from './Chart.module.scss'

export interface ChartProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: number
}

export const Chart = ({ value }: ChartProps) => {
  const [loaded, setLoaded] = useState<boolean>(false)

  const rest = 100 - value
  const groupB = rest > 0 ? rest : 0

  const data = [
    { name: 'Group A', value: value },
    { name: 'Group B', value: groupB },
  ]

  const COLORS = ['#9FEF00', '#455c2b']

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <PieChart width={100} height={100}>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={20}
          outerRadius={30}
          paddingAngle={10}
          dataKey='value'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <span className={styles.value}>{data[0].value} %</span>
    </div>
  )
}
