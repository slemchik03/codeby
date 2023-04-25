import { DetailedHTMLProps, FormEvent, HTMLAttributes, useState } from "react";
import { Card } from "@/page-components";
import { useSelector } from "react-redux";
import styles from "./PartUpload.module.scss";
import { Input } from "@/components/UI/Input";
import { Select } from "@/components/UI/Select";
import { Button } from "@/components/UI/Button";
import { selectAdmin } from "@/redux/admin/selector";
import addDockerTaskPart from "@/utils/server/docker/addDockerTaskPart";
import { useSession } from "next-auth/react";
import addFileTaskPart from "@/utils/server/add/addFileTaskPart";
import toast, { Toaster } from "react-hot-toast";
import wrapperStyles from "../Modal.module.scss";
import { Dialog } from "@headlessui/react";

export interface PartUploadProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

export const PartUpload = ({ isOpen, onClose }: PartUploadProps) => {
  const types = ["Docker", "Файлы"];
  const [title, setTitle] = useState<string>("");
  const [ports, setPorts] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [type, setType] = useState<string>(types[0]);
  const currentTask = useSelector(selectAdmin).taskToUpdate;
  const { data: session } = useSession();
  let fileData = new FormData();

  const onChangeFile = (e: FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    setFile(input.files[0]);
  };

  const uploadPart = async () => {
    const toastId = toast.loading("Добавляем часть задания...");
    fileData.append("task_id", currentTask?.id!);
    fileData.append("name", title);
    fileData.append("data", file!);

    let uploadResult;
    if (type === "Docker") {
      fileData.append("ports", ports);
      uploadResult = await addDockerTaskPart({
        data: fileData,
        token: session?.user.token!,
      });
      toast.dismiss(toastId);
    } else {
      uploadResult = await addFileTaskPart({
        data: fileData,
        token: session?.user.token!,
      });
      toast.dismiss(toastId);
    }

    if (uploadResult?.status) {
      toast.success("Часть задания успешно добавлена!");
      return onClose();
    }
    const errorMessage = Object.values(uploadResult?.errors || {});
    toast.error(
      errorMessage[0]
        ? errorMessage[0]?.slice(0, 1).toUpperCase() + errorMessage[0]?.slice(1)
        : "Не удалось добавить часть таски!"
    );
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className={wrapperStyles.modalWrapper}>
        <Dialog.Panel>
          <div className={styles.upload}>
            <Toaster
              toastOptions={{
                style: {
                  background: "#282c35",
                  color: "#ffff",
                },
              }}
            />
            <Card
              title="Добавить части задания"
              desc=" Укажите дополнительные параметры для задания"
            >
              <div className={styles.fields}>
                <Input
                  className={styles.title}
                  type="text"
                  status="default"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  title="Заголовок"
                  placeholder="Введите"
                />
                <div className={styles.type}>
                  <span>Тип</span>
                  <Select
                    className={styles.select}
                    active={type}
                    setActive={setType}
                    type="select"
                    title="Тип"
                    showTitle={false}
                    variant="gray"
                    options={types}
                  />
                </div>
                {type === "Docker" && (
                  <Input
                    className={styles.port}
                    status="default"
                    value={ports}
                    type="text"
                    onChange={(e) => setPorts(e.currentTarget.value)}
                    title="Порты"
                    placeholder="8080:80,8022:22"
                  />
                )}
                <div className={styles.heading}>
                  {/* @ts-ignore does not matter */}
                  <Input
                    title="Заголовок"
                    placeholder="Выберите материалы"
                    status="default"
                    type="file"
                    onChange={onChangeFile}
                  />
                </div>
              </div>
              <div className={styles.buttons}>
                <Button onClick={uploadPart} text="Добавить" variant="green" />
                <Button onClick={onClose} text="Отменить" variant="red" />
              </div>
            </Card>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
