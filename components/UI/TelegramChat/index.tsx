import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import Telegram from "../../../public/icons/telegram.svg";
import Discord from "../../../public/icons/discord-icon.svg"
import styles from "./TelegramChat.module.scss";

export interface TelegramChatProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: "open" | "closed";
}

export const TelegramChat = ({ className, variant }: TelegramChatProps) => {
  return (
    <div
      className={clsx(
        className,
        clsx(
          variant === "open" && styles.buttonContainer,
          variant === "closed" && styles.buttonContainerMini
        )
      )}
    >
      <a href="https://t.me/codeby_games" target="_blank">
        <button
          className={clsx(
            className,
            clsx(
              variant === "open" && styles.button,
              variant === "closed" && styles.miniButton
            )
          )}
        >
          <Telegram />
          {variant === "open" && "Чат Telegram"}
        </button>
      </a>
      <a href="https://discord.gg/AqdRdFVhUS" target="_blank">
        <button
          className={clsx(
            className,
            clsx(
              variant === "open" && styles.button,
              variant === "closed" && styles.miniButton
            )
          )}
          style={{backgroundColor: "#5865F2"}}
        >
          <Discord width="20px" height="20px" />
          {variant === "open" && "Сервер Discord"}
        </button>
      </a>
    </div>
  );
};
