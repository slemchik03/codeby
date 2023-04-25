import IServerResponse from "@/types/server-response";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;

export interface IScoreboard {
  place: number,
  points: number,
  rating: number,
}

interface IGetScoreboardArgs {
  teamId: string;
  token: string;
}

const getScoreboard = async ({ token, teamId }: IGetScoreboardArgs): Promise<IScoreboard | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('team_id', teamId);

    const response = await fetch(`${process.env.apiUrl}/scoreboard/team?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IScoreboard> = await response.json();

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

export default getScoreboard;
