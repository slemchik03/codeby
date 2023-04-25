import { DetailedHTMLProps, HTMLAttributes } from "react";
import Image from "next/image";
import Edit from "../../public/icons/edit.svg";
import image from "../../public/images/team-gray-image.png";
import styles from "./ParticipantCard.module.scss";
import clsx from "clsx";
import { IUser } from "@/utils/server/get/getUser";

export interface ParticipantCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  showRole: boolean;
  ownerUser: IUser;
  isOwner: boolean;
  user: IUser;
  makeLeaderHandler: () => void;
}

export const ParticipantCard = ({
  user,
  showRole,
  className,
  ownerUser,
  isOwner,
  makeLeaderHandler,
  ...props
}: ParticipantCardProps) => {
  return (
    <div {...props} className={clsx(styles.participantCard, className)}>
      <div className={styles.wrapper}>
        <Image
          className={styles.image}
          src={
            user?.avatar
              ? `${process.env.apiUrl}/images/${user?.avatar}?${new Date().getTime()}`
              : image
          }
          alt=""
          width={48}
          height={48}
        />
        <div className={styles.text}>
          <p className={styles.nickname}>{user?.login}</p>
          <p className={styles.email}>{user?.email}</p>
        </div>
        {showRole && <p className={styles.role}>{isOwner ? "капитан" : "участник"}</p>}
      </div>
      {ownerUser.id !== user.id && isOwner && <Edit onClick={makeLeaderHandler} />}
    </div>
  );
};
