import { FC } from "react";
import DeleteIcon from "../../../public/icons/delete.svg";

interface IProps {
  className: string;
  place: number;
  name: string;
  teamId: string;
  ownerId: string;
  deleteTeam: (id: string) => void;
}

export const TeamListItem: FC<IProps> = ({
  place,
  className,
  teamId,
  name,
  deleteTeam,
  ownerId
}) => {
  return (
    <li className={className}>
      <span>{place}</span>
      <span>{teamId}</span>
      <span>{ownerId}</span>
      <span>{name}</span>
      <div onClick={() => deleteTeam(teamId)}>
        <DeleteIcon />
      </div>
    </li>
  );
};
