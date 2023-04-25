import IServerResponse from "@/types/server-response";
import { ITeam } from "./getTeam";

interface IDeleteTeamArgs {
  teamId: string;
  token: string;
}

const deleteTeam = async ({ teamId, token }: IDeleteTeamArgs): Promise<IServerResponse<ITeam> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/teams/${teamId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default deleteTeam;
