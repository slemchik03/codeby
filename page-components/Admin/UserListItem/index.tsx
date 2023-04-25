import getScoreboard from "@/utils/server/get/getScoreboard";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { useQuery } from "react-query";
import DeleteIcon from "../../../public/icons/delete.svg";
import getTeam from "@/utils/server/teams/getTeam";

interface IProps {
  className: string;
  place: number;
  role: string;
  login: string;
  userId: string;
  teamId: string;
  deleteUser: (id: string) => void
}

export const UserListItem: FC<IProps> = ({
  place,
  role,
  login,
  className,
  teamId,
  userId,
  deleteUser
}) => {
  const { data: session } = useSession();
  const { data: team, isLoading } = useQuery("team-" + teamId, () =>
    getTeam({ token: session?.user.token!, id: teamId })
  );
  
  return (
    <li className={className}>
      <span>{place}</span>
      <span>{userId}</span>
      <span>{login}</span>
      <span>{isLoading ? "загрузка..." : team?.id === teamId ? team.name : "-"}</span>
      <span>{role}</span>
      <div onClick={() => deleteUser(userId)}>
        <DeleteIcon />
      </div>
      
    </li>
  );
};
