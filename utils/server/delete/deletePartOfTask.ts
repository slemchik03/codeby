import IServerResponse from "@/types/server-response";
import { IPartOfTask } from "@/utils/server/get/getPartsOfTask";

interface IDeletePartOfTaskArgs {
  partId: string;
  token: string;
}

const deletePartOfTask = async ({ partId, token }: IDeletePartOfTaskArgs): Promise<IServerResponse<IPartOfTask[]> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/part/${partId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error)
    return null;
  }
};

export default deletePartOfTask;
