import IServerResponse from "@/types/server-response";
import { ITeam } from "../teams/getTeam";

export interface IScoreboardList {
    completed_tasks: number,
    points: number,
    team: Omit<ITeam, "password">,
    updated_at: string

}

interface IGetScoreboardListArgs {
  limit: number;
  offset: number;
  token: string;
}

const getScoreboardList = async ({ limit, offset, token }: IGetScoreboardListArgs): Promise<IScoreboardList[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());

    const response = await fetch(`${process.env.apiUrl}/scoreboard/list?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data: IServerResponse<IScoreboardList[]> = await response.json();

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

export default getScoreboardList;
