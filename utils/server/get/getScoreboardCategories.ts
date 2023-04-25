import IServerResponse from "@/types/server-response";

export interface IScoreboardCategory {
  all_tasks: number;
  completed_tasks: number;
  id: string;
  max_points: number;
  points: number;
  title: string;
  updated_at: string;
}
export interface IScoreboardCategories {
  categories: IScoreboardCategory[];
  max_points: number;
  points: number;
  updated_at: string;
}

interface IGetScoreboardCategoriesArgs {
  teamId: string;
  token: string;
}

const getScoreboardCategories = async ({ teamId, token }: IGetScoreboardCategoriesArgs): Promise<IScoreboardCategories | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('team_id', teamId);

    const response = await fetch(`${process.env.apiUrl}/scoreboard/categories?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IScoreboardCategories> = await response.json();

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

export default getScoreboardCategories;
