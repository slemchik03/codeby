import IServerResponse from "@/types/server-response";
import { ITeam } from "./getTeam";

interface ILeaveFromTeamArgs {
  token: string;
}

const leaveFromTeam = async ({
  token,
}: ILeaveFromTeamArgs): Promise<IServerResponse<boolean> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/teams/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default leaveFromTeam;
