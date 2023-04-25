import IServerResponse from "@/types/server-response";
import {IPartOfTask} from "@/utils/server/get/getPartsOfTask";

export interface IUpdatePartOfTaskArgs {
    credentials: {
        active?: boolean,
        data?: string,
        system_data?: string,
    },
    partId: string,
    token: string
}

const updatePartOfTask = async ({ token, credentials, partId }: IUpdatePartOfTaskArgs): Promise<IServerResponse<IPartOfTask | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/part/${partId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    const data: IServerResponse<IPartOfTask> = await response.json();

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

export default updatePartOfTask;
