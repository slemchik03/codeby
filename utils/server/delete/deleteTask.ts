import IServerResponse from "@/types/server-response";
import {ITask} from "@/utils/server/get/getTask";

interface IDeleteTaskArgs {
  taskId: string;
  token: string;

}

const deleteTask = async ({ taskId, token }: IDeleteTaskArgs): Promise<IServerResponse<ITask> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default deleteTask;
