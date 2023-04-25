import IServerResponse from "@/types/server-response";
import {ITask} from "@/utils/server/get/getTask";

export interface IUpdateHintArgs {
    description: string;
    hintId: string,
    token: string
}

const updateHint = async ({ token, hintId, description }: IUpdateHintArgs): Promise<IServerResponse<ITask | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/hints/${hintId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({description}),
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

export default updateHint;
