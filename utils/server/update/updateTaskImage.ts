import IServerResponse from "@/types/server-response";
import {ITask} from "@/utils/server/get/getTask";

interface IUpdateTaskImageArgs {
  id: string;
  file: File;
  token: string;
}

const updateTaskImage = async ({ id, file, token }: IUpdateTaskImageArgs): Promise<ITask | null> => {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(`${process.env.apiUrl}/tasks/${id}/image`, {
      method: "PATCH",
      headers: {
        'accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data: IServerResponse<ITask> = await response.json();

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

export default updateTaskImage;
