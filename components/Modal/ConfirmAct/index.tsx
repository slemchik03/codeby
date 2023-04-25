import clsx from "clsx";
import { Button } from "@/components/UI/Button";
import { Card } from "@/page-components";
import { Dialog } from "@headlessui/react";
import { FC } from "react";
import styles from "../ConfirmAct/ConfirmAct.module.scss";
import wrapperStyles from "../Modal.module.scss";

interface IProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  successBtnText: string;
  closeBtnText: string;
  title: string;
}

export const ConfirmAct: FC<IProps> = ({
  isOpen,
  onSuccess,
  onClose,
  successBtnText,
  closeBtnText,
  title,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className={clsx(wrapperStyles.modalWrapper)}>
        <Dialog.Panel>
          <Card className={styles.confirmActWrapper} title={title}>
            <div className={styles.buttons}>
              <Button

                onClick={onSuccess}
                text={successBtnText}
                variant="green"
              />
              <Button

                onClick={onClose}
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
