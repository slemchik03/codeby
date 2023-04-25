import IServerResponse from "@/types/server-response";

export interface ICompletedTask {
  category_id: string;
  created_at: string;
  id: string;
  points: number;
  task_id: string;
  user_id: string;
}

interface IGetCompletedTasksArgs {
  limit: number;
  token: string;
  userId?: string;
  teamId?: string;
}

const getCompletedTasks = async ({ limit, token, userId, teamId }: IGetCompletedTasksArgs): Promise<ICompletedTask[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (userId) {
      queryParams.append('data.user_id', userId);
    }

    if (teamId) {
      queryParams.append('data.team_id', teamId);
    }

    const response = await fetch(`${process.env.apiUrl}/completed_tasks/list?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<ICompletedTask[]> = await response.json();

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

export default getCompletedTasks;
