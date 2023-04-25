import IServerResponse from "@/types/server-response";
import {INews} from "@/utils/server/get/getNews";

export interface IPartOfTask {
  active: true;
  created_at: string;
  data: string;
  id: string;
  system_data: string;
  task_id: string;
  type: string;
}

interface IGetPartsOfTaskArgs {
  limit: number;
  taskId?: string;
  active?: boolean;
  system_data?: string;
  type?: string;
  token: string;
}

const getPartsOfTask = async ({ limit, active, system_data, taskId, token, type }: IGetPartsOfTaskArgs): Promise<IPartOfTask[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (taskId != null) {
      queryParams.append('data.task_id', taskId);
    }
    if (active != null) {
      queryParams.append('data.active', active.toString());
    }
    if (system_data != null) {
      queryParams.append('data.system_data', system_data);
    }
    if (type != null) {
      queryParams.append('data.type', type);
    }

    const response = await fetch(`${process.env.apiUrl}/part/list?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IPartOfTask[]> = await response.json()

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

export default getPartsOfTask;
