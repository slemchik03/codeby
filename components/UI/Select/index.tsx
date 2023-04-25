import clsx from "clsx";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  MouseEventHandler,
  SetStateAction,
  useRef,
  useState,
} from "react";
import ArrowIcon from "../../../public/icons/select-arrow.svg";
import styles from "./Select.module.scss";

export interface SelectProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  active?: string;
  setActive?: Dispatch<SetStateAction<string>>;
  options: string[];
  title: string;
  showTitle: boolean;
  variant: "gray" | "black";
  type: "select" | "dropdown";
  copyableOption?: boolean;
}

export const Select = ({
  type,
  active,
  setActive,
  className,
  options,
  title,
  showTitle,
  variant,
  copyableOption,
}: SelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as unknown as HTMLElement;
    const inList =
      target.getAttribute("aria-label") === "option" ||
      target.getAttribute("aria-label") === "options";
    if (copyableOption && inList) {
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <div
      onClick={clickHandler}
      className={clsx(
        className,
        styles.dropdownContainer,
        { [styles.black]: variant === "black" },
        { [styles.gray]: variant === "gray" }
      )}
    >
      {showTitle && <p>{title}</p>}
      {!showTitle && <p>{active}</p>}
      {open && setActive && (
        <div ref={parentRef} className={styles.options}>
          <ul aria-label={"options"}>
            {options.length ? options.map((option, idx) => (
              <li
                aria-label={"option"}
                onClick={() => type === "select" && setActive(option as string)}
                key={idx}
              >
                {option}
              </li>
            )) : ""}
          </ul>
        </div>
      )}
      {open && !setActive && (
        <div ref={parentRef} className={styles.options}>
          <ul aria-label={"options"}>
            {options.map((option, idx) => (
              <li aria-label={"option"} key={idx}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ArrowIcon className={clsx({ [styles.openArrow]: open })} />
    </div>
  );
};
