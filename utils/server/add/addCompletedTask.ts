import IServerResponse from "@/types/server-response";

interface IAddCompletedTaskArgs {
  token: string;
  taskId: string;
  userId: string;
  flag: string;
}

const addCompletedTask = async ({ token, taskId, userId, flag }: IAddCompletedTaskArgs): Promise<IServerResponse<{}> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/completed_tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ flag, task_id: taskId, user_id: userId }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default addCompletedTask;