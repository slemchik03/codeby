import clsx from "clsx";
import Image from "next/image";
import { Check, Input } from "@/components";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import styles from "./TaskDescription.module.scss";
import addCompletedTask from "@/utils/server/add/addCompletedTask";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

export interface TaskDescriptionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  desc: string;
  check?: boolean;
  points: number;
  image: string;
  taskId: string;
  portList: string[];
  isCompletedTask: boolean;
}

export const TaskDescription = ({
  className,
  title,
  desc,
  points,
  image,
  taskId,
  portList,
  isCompletedTask,
}: TaskDescriptionProps) => {
  const [flag, setFlag] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const submitTask = async () => {
    const toastId = toast.loading("Проверяем флаг...");
    const result = await addCompletedTask({
      token: session?.user.token!,
      flag: flag,
      userId: session?.user.id!,
      taskId: taskId,
    });

    toast.dismiss(toastId);
    if (result?.status) {
      toast.success("Вы выполнили задание!");
      router.push("/categories/");
    } else {
      const errorMessage = Object.values(result?.errors || {});
      toast.error(
        errorMessage[0]
          ? errorMessage[0]?.slice(0, 1).toUpperCase() +
              errorMessage[0]?.slice(1)
          : "Не удалось обновить настройки!"
      );
    }
  };

  return (
    <div className={clsx(styles.taskDescription, className)}>
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <div className={styles.top}>
        {/*<Image*/}
        {/*  src={*/}
        {/*    image*/}
        {/*      ? `${process.env.apiUrl}/images/${image}`*/}
        {/*      : "/icons/upload.svg"*/}
        {/*  }*/}
        {/*  style={{ objectFit: "cover", objectPosition: "center" }}*/}
        {/*  width={30}*/}
        {/*  height={30}*/}
        {/*  alt=""*/}
        {/*/>*/}
        <Check check={isCompletedTask} />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.desc} dangerouslySetInnerHTML={{__html: desc}}></p>
      <div className={styles.flag}>
        <div className={styles.inputContainer}>
          <Input
            value={flag}
            onChange={(e) => setFlag(e.currentTarget.value)}
            disabled={isCompletedTask}
            status="default"
            placeholder="CODEBY{...}"
            type="text"
            className={styles.input}
          />
          <button disabled={isCompletedTask} onClick={submitTask}>
            Отправить флаг
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <p>
          Награда за выполнение: <span>{points} баллов</span>
        </p>
        {portList?.map((port) => {
          return port.split(",").map((subPort) => (
            <p key={subPort}>
              IP:{" "}
              <span>
                {process.env.ip_from_env}:{subPort.split(":")[0]}
              </span>
            </p>
          ));
        })}
      </div>
    </div>
  );
};
