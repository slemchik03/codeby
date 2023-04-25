import IServerResponse from "@/types/server-response";
import { ITask } from "@/utils/server/get/getTask";

interface IGetTasksArgs {
  limit: number;
  offset?: number;
  taskId?: string;
  categoryId?: string;
  slug?: string;
  hidden?: boolean;
  token: string;
  difficult?: string;
}

const getTasks = async ({ limit, offset, taskId, hidden, slug, token, difficult, categoryId }: IGetTasksArgs): Promise<ITask[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (offset != null) {
      queryParams.append("offset", offset.toString());
    }
    if (taskId != null) {
      queryParams.append('data.id', taskId);
    }
    if (categoryId != null) {
      queryParams.append('data.category_id', categoryId);
    }
    if (slug != null) {
      queryParams.append('data.slug', slug);
    }
    if (hidden != null) {
      queryParams.append('data.hidden', hidden.toString());
    }
    if (difficult != null) {
      queryParams.append('data.difficult', difficult);
    }

    const response = await fetch(`${process.env.apiUrl}/tasks/list?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<ITask[]> = await response.json();

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

export default getTasks;
