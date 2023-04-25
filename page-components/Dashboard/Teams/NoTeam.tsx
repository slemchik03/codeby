import Icon from '../../../public/icons/no-team.svg'
import styles from './NoTeam.module.scss'
import {useRouter} from "next/router";
import {Button} from "@/components";

export const NoTeam = () => {
  const router = useRouter()

  return (
    <div className={styles.noTeam}>
      <Icon />
      <p className={styles.title}>Вы еще не состоите в команде!</p>
      <p className={styles.desc}></p>
      <Button
        onClick={() => router.push("/team")}
        style={{ padding: "0 10px" }}
        variant="green"
        text="Команды"
      />
    </div>
  )
}
