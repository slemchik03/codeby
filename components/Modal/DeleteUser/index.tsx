import clsx from "clsx";
import { Button } from "@/components/UI/Button";
import { Card } from "@/page-components";
import { Dialog } from "@headlessui/react";
import { FC, useState } from "react";
import styles from "./DeleteUser.module.scss";
import wrapperStyles from "../Modal.module.scss";
import { Input } from "@/components/UI/Input";
import { Toaster } from "react-hot-toast";

interface IProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  successBtnText: string;
  closeBtnText: string;
  title: string;
  userLogin: string;
}

export const DeleteUser: FC<IProps> = ({
  isOpen,
  onSuccess,
  onClose,
  successBtnText,
  closeBtnText,
  title,
  userLogin,
}) => {
  const [login, setLogin] = useState("");
  const submitHandler = () => {
    if (login === userLogin) {
      onSuccess();
    }
  };
  const closeHandler = () => {
    setLogin("");
    onClose();
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className={clsx(wrapperStyles.modalWrapper)}>
        <Toaster
          toastOptions={{
            style: {
              background: "#282c35",
              color: "#ffff",
            },
          }}
        />
        <Dialog.Panel>
          <Card
            style={{ textAlign: "center" }}
            className={styles.deleteUserWrapper}
            title={title}
          >
            <div className={styles.deleteUserInputWrapper}>
              <Input
                type="text"
                status={login === userLogin ? "true" : "false"}
                value={login}
                onChange={(e) => setLogin(e.currentTarget.value)}
              />
            </div>
            <div className={styles.buttons}>
              <Button
                style={{ padding: "0 5px" }}
                onClick={submitHandler}
                text={successBtnText}
                variant="green"
              />
              <Button
                style={{ padding: "0 5px" }}
                onClick={closeHandler}
                text={closeBtnText}
                variant="red"
              />
            </div>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
