import IServerResponse from "@/types/server-response";
import {ITask} from "@/utils/server/get/getTask";
import {IPartOfTask} from "@/utils/server/get/getPartsOfTask";

export interface IStartDockerContainerArgs {
    containerId: string,
    token: string
}

const startDockerContainer = async ({ token, containerId }: IStartDockerContainerArgs): Promise<IServerResponse<boolean | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/docker/${containerId}/start`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<boolean> = await response.json();

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

export default startDockerContainer;
