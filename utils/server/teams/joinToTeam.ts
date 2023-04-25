import IServerResponse from "@/types/server-response";
import { ITeam } from "./getTeam";

interface IJoinToTeamArgs {
  token: string;
  teamId: string;
  credentials: {
    password: string;
  }
}

const joinToTeam = async ({
  token,
  teamId,
  credentials
}: IJoinToTeamArgs): Promise<IServerResponse<ITeam> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/teams/${teamId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials)
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default joinToTeam;
