import IServerResponse from "@/types/server-response";
import { ITeam } from "./getTeam";

interface IAddTeamArgs {
  teamId: string;
  token: string;
  credentials: {
    description?: string;
    name?: string;
    owner_id?: string;
    password?: string;
  };
}

const updateTeam = async ({
  token,
  teamId,
  credentials,
}: IAddTeamArgs): Promise<IServerResponse<ITeam> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/teams/${teamId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default updateTeam;
