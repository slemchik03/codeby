import IServerResponse from "@/types/server-response";
import {ICompletedTask} from "@/utils/server/get/getCompletedTasks";

export interface IHint {
  created_at: string;
  description: string;
  id: string;
  task_id: string;
}

interface IGetHintsArgs {
  limit: number;
  hintId?: string;
  taskId: string;
  token: string;
}

const getHints = async ({ limit, token, taskId, hintId }: IGetHintsArgs): Promise<IHint[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (hintId != null) {
      queryParams.append('data.id', hintId);
    }
    queryParams.append('data.task_id', taskId);

    const response = await fetch(`${process.env.apiUrl}/hints/list?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IHint[]> = await response.json();

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

export default getHints;
