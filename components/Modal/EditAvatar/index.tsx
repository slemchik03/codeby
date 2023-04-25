import clsx from "clsx";
import { Button } from "@/components/UI/Button";
import { Card } from "@/page-components";
import { Dialog } from "@headlessui/react";
import { FC, useRef, useState } from "react";
import styles from "./EditAvatar.module.scss";
import wrapperStyles from "../Modal.module.scss";
import AvatarEditor from "react-avatar-editor";
import Slider from "rc-slider";

interface IProps {
  isOpen: boolean;
  onSuccess: (imgUrl: any) => any;
  onClose: () => void;
  fileDataURL: string | ArrayBuffer;
}

export const EditAvatar: FC<IProps> = ({
  isOpen,
  onSuccess,
  onClose,
  fileDataURL,
}) => {
  const [zoom, setZoom] = useState(1);
  const editorRef = useRef(null);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className={clsx(wrapperStyles.modalWrapper)}>
        <Dialog.Panel>
          <Card className={styles.editAvatar} title="Отредактируйте аватар">
            <AvatarEditor
              ref={editorRef}
              // @ts-ignore
              image={fileDataURL}
              borderRadius={30}
              width={200}
              height={200}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={zoom}
              rotate={0}
            />
            <Slider
              min={1}
              max={2}
              step={0.1}
              value={zoom}
              onChange={(v) => setZoom(+v)}
              handleStyle={{background: "#9fef00", opacity: 1, border: "none"}}
              trackStyle={{background: "#9fef00", opacity: 1}}
            />
            <div className={styles.buttons}>
              <Button
                style={{ padding: "0 10px" }}
                onClick={() =>
                  // @ts-ignore
                  onSuccess(editorRef?.current?.getImage()?.toDataURL())
                }
                text={"Сохранить"}
                variant="green"
              />
              <Button
                style={{ padding: "0 10px" }}
                onClick={onClose}
                text={"Отмена"}
                variant="red"
              />
            </div>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
