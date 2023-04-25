import IServerResponse from "@/types/server-response";
import { ITeam } from "./getTeam";

interface IAddTeamArgs {
  token: string;
  credentials: {
    description: string;
    name: string;
    password: string;
  }
}

const addTeam = async ({
  token,
credentials
}: IAddTeamArgs): Promise<IServerResponse<ITeam> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/teams/`, {
      method: "POST",
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

export default addTeam;
