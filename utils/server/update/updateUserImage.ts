import IServerResponse from "@/types/server-response";
import { IUser } from "../get/getUser";

interface IUpdateUserImage {
  id: string;
  file: File;
  token: string;
}

const updateUserImage = async ({ id, file, token }: IUpdateUserImage): Promise<IUser | null> => {
  try {
    const formData = new FormData()
    formData.append("avatar", file)

    const response = await fetch(`${process.env.apiUrl}/users/${id}/avatar`, {
      method: "PATCH",
      headers: {
        'accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data: IServerResponse<IUser> = await response.json();

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

export default updateUserImage;
