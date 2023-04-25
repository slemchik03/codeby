import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { Card } from "@/page-components";
import { FC, useState } from "react";
import styles from "./CreateTeam.module.scss";
import { Dialog } from "@headlessui/react";
import wrapperStyles from "../Modal.module.scss";
import addTeam from "@/utils/server/teams/addTeam";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/router";
import createErrorMessage from "@/utils/createErrorMessage";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTeam: FC<IProps> = ({ isOpen, onClose }) => {
  const {data: session} = useSession()
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [password, setPassword] = useState<string>("")
  const router = useRouter()

  const createTeamHandler = async () => {
    if (name && password) {
      const toastId = toast.loading("Создаем команду...")
      const response = await addTeam({token: session?.user.token!, credentials: {
        name,
        description: desc,
        password
      }})
      toast.dismiss(toastId)
      if (response?.status) {
        toast.success("Команда успешно создана!")
        return router.push("/team")
      }
      toast.error(
        createErrorMessage(response?.errors, "Не удалось создать команду!")
      );
    }
  }
  return (
    <Dialog open={isOpen} onClose={onClose}>
       <div className={wrapperStyles.modalWrapper}>
       <Toaster
          toastOptions={{
            style: {
              background: "#282c35",
              color: "#ffff",
            },
          }}
        />
        <Dialog.Panel className={styles.createTeam}>
          <Card
            desc="Создайте свою команду для совместного решения заданий"
            title="Создать команду"
          >
            <div className={styles.fields}>
              <Input
                title="Название"
                value={name}
                status="default"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="Введите название команды"
                type="text"
              />
              <Input
                title="Пароль команды"
                value={password}
                status="default"
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="Введите пароль команды"
                type="password"
              />
              <Input
                title="Описание"
                value={desc}
                status="default"
                onChange={(e) => setDesc(e.currentTarget.value)}
                placeholder="Введите описание команды"
                type="textarea"
              />

            </div>
            <div className={styles.buttons}>
              <Button onClick={createTeamHandler} text="Создать" variant="green" />
              <Button onClick={onClose} text="Отменить" variant="red" />
            </div>
          </Card>
        </Dialog.Panel>
        </div>
    </Dialog>
  );
};
