import IServerResponse from "@/types/server-response";
import { IUser } from "../get/getUser";

export interface IScoreboardTeam {
  completed_tasks: number;
  place: number;
  points: number;
  rating: number;
  updated_at: string;
  users: {
    points: number;
    updated_at: string;
    user: IUser;
  }[];
}

const getScoreboardTeam = async ({
  token,
  teamId,
}: {
  token: string;
  teamId: string;
}): Promise<IScoreboardTeam | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("team_id", teamId);

    const response = await fetch(
      `${process.env.apiUrl}/scoreboard/team?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: IServerResponse<IScoreboardTeam> = await response.json();

    if (data.status) {
      return data.data;
    } else {
      console.error(data.errors);
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getScoreboardTeam;
