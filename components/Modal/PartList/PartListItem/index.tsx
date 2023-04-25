import getScoreboard from "@/utils/server/get/getScoreboard";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { useQuery } from "react-query";
import PauseIcon from "../../../../public/icons/pause.svg";
import StartIcon from "../../../../public/icons/start.svg";
import DeleteIcon from "../../../../public/icons/delete.svg";

interface IProps {
  className: string;
  part_data: string;
  system_data: string;
  part_type: string
  partId: string;
  active: boolean;
  changeActive: (id: string, type: string, system_data: string, active: boolean) => void
  deletePart: (id: string) => void
}

export const PartListItem: FC<IProps> = ({
  part_data,
  system_data,
  className,
  partId,
  part_type,
  active,
  changeActive,
  deletePart
}) => {
  const { data: session } = useSession();

  return (
    <li className={className}>
      <span>{partId}</span>
      <span>
        {part_type === "docker" ? (
          <ul>
            {part_data.split(",").map((el) => {
              return <li>{el}</li>
            })}
          </ul>
        ) : (part_data)}
      </span>
      <span>{system_data}</span>
      <span>{part_type}</span>
      <div>
        {active ? <div onClick={() => changeActive(partId, part_type, system_data, false)}><PauseIcon /></div> : <div onClick={() => changeActive(partId, part_type, system_data, true)}><StartIcon /></div>}
      </div>
      <div onClick={() => deletePart(partId)}>
        <DeleteIcon />
      </div>
    </li>
  );
};
