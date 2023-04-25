import IServerResponse from "@/types/server-response";
import { ITask } from "@/utils/server/get/getTask";
import { IUpdateTaskArgs } from "@/utils/server/update/updateTask";
interface IAddTaskArgs {
  token: string;
  credentials: IUpdateTaskArgs["credentials"];
}

const addTask = async ({ token, credentials }: IAddTaskArgs): Promise<IServerResponse<ITask> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default addTask;
