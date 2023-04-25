import IServerResponse from "@/types/server-response";
import {ITask} from "@/utils/server/get/getTask";

export interface IUpdateTaskArgs {
    credentials: {
        category_id?: string,
        description?: string,
        difficult?: string,
        flag?: string,
        hidden?: boolean,
        last_restart?: string,
        points?: number,
        restart_every_minutes?: number,
        title?: string
    },
    taskId: string,
    token: string
}

const updateTask = async ({ token, credentials, taskId }: IUpdateTaskArgs): Promise<IServerResponse<ITask | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    const data: IServerResponse<ITask> = await response.json();

    if (data.status) {
      return data;
    } else {
      console.error(data.errors);
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default updateTask;
