import IServerResponse from "@/types/server-response";
import { IGetTeamArgs, ITeam } from "./getTeam";

interface IFindTeamsArgs extends IGetTeamArgs {
    offset?: string;
    limit: number;
}

const findTeams = async ({ id, description, hidden, token, difficult, limit, offset, title }: IFindTeamsArgs): Promise<ITeam[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    if (id != null) {
      queryParams.append("data.id", id.toString());
    }
    if (description != null) {
      queryParams.append('data.description', description);
    }
    if (offset != null) {
        queryParams.append('offset', offset);
      }
    if (hidden != null) {
      queryParams.append('data.hidden', hidden.toString());
    }
    if (title != null) {
      queryParams.append('data.name', title.toString());
    }
    if (difficult != null) {
      queryParams.append('data.difficult', difficult);
    }

    const response = await fetch(`${process.env.apiUrl}/teams/list/find?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<ITeam[]> = await response.json();

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

export default findTeams;
