import { FC, useEffect, useState } from "react";
import { Select } from "@/components/UI/Select";
import Close from "../../../public/icons/close-red.svg";
import { Card } from "@/page-components";
import styles from "./JoinTeam.module.scss";
import { Button } from "@/components/UI/Button";
import { Dialog } from "@headlessui/react";
import wrapperStyles from "../Modal.module.scss";
import { ITeam } from "@/utils/server/teams/getTeam";
import joinToTeam from "@/utils/server/teams/joinToTeam";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import createErrorMessage from "@/utils/createErrorMessage";
import { Input } from "@/components/UI/Input";
import { useQuery } from "react-query";
import findTeams from "@/utils/server/teams/findTeams";

interface IProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  teamsList: ITeam[];
}

export const JoinTeam: FC<IProps> = ({ isOpen, onClose, teamsList }) => {
  const { data: session } = useSession();
  const [team, setTeam] = useState<string>(teamsList[0]?.name);
  const [filterTeam, setFilterTeam] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: filteredList, refetch } = useQuery(
    "teams-list",
    () =>
      findTeams({
        limit: 20,
        title: filterTeam,
        token: session?.user.token!,
      }),
    { initialData: teamsList }
  );

  const joinToTeamHandler = async () => {
    const needleTeam = filteredList?.find((teamItem) => teamItem.name == team);
    if (needleTeam) {
      const response = await joinToTeam({
        token: session?.user.token!,
        teamId: String(needleTeam.id),
        credentials: { password },
      });
      if (response?.status) {
        toast.success("Вы успешно вошли в состав команды!");
        return router.push("/team");
      }

      toast.error(
        createErrorMessage(response?.errors, "Не удалось вступить в команду!")
      );
    }
  };
  const searchTeamHandler = async () => {
    const toastId = toast.loading("Поиск команды...");
    await refetch();
    toast.dismiss(toastId);
  };
  useEffect(() => {
    if (filteredList) {
      setTeam(filteredList[0]?.name);
    } else {
      setTeam("");
    }
  }, [filteredList]);
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
        <Dialog.Panel className={styles.joinTeam}>
          <Card title="Вступить в команду">
            <div className={styles.fields}>
              <div>
                <div>
                  <p className={styles.title}>Поиск команды</p>
                  <Input
                    status="default"
                    type="text"
                    placeholder="Введите название команды"
                    value={filterTeam}
                    onChange={(e) => setFilterTeam(e.currentTarget.value)}
                  />
                  <div className={styles.searchButton}>
                    <Button
                      style={{ marginTop: "15px", padding: "0 10px" }}
                      variant="green"
                      onClick={searchTeamHandler}
                      text="Поиск"
                    />
                  </div>
                </div>
                <p className={styles.title} style={{ marginTop: "5px" }}>
                  Список команд
                </p>
                <Select
                  showTitle={false}
                  type="select"
                  title="Команда"
                  options={
                    filteredList ? filteredList.map((team) => team.name) : []
                  }
                  placeholder="Выберите команду"
                  variant="gray"
                  active={team || "Ничего не найдено"}
                  setActive={setTeam}
                />
                <p className={styles.title}>Пароль</p>
                <Input
                  status="default"
                  type="password"
                  placeholder="Введите пароль, полученный от капитана команды"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
              </div>
            </div>
            <Close onClick={onClose} className={styles.close} />
            <div className={styles.buttons}>
              <Button
                onClick={joinToTeamHandler}
                text="Войти"
                variant="green"
              />
              <Button onClick={onClose} text="Отменить" variant="red" />
            </div>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
