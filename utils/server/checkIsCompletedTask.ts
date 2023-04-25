import IServerResponse from "@/types/server-response";
import { ICompletedTask } from "./get/getCompletedTasks";

interface CheckIsCompletedTaskArgs {
  limit: number;
  offset?: number;
  token: string;
  userId: string;
  taskId?: string;
  teamId?: string;
  categoryId: string;
}

const checkIsCompletedTask = async ({ limit, offset, token, userId, taskId, categoryId, teamId }: CheckIsCompletedTaskArgs): Promise<IServerResponse<ICompletedTask[]> | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", String(limit));
    if (offset != null) {
      queryParams.append("offset", offset.toString());
    }
    queryParams.append("data.user_id", userId);
    if (taskId != null) {
      queryParams.append("data.task_id", taskId);
    }
    if (teamId != null) {
      queryParams.append("data.team_id", teamId);
    }
    queryParams.append("data.category_id", categoryId);

    const response = await fetch(
      `${process.env.apiUrl}/completed_tasks/list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default checkIsCompletedTask;
