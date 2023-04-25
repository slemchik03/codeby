import IServerResponse from "@/types/server-response";
import {IUser} from "@/utils/server/get/getUser";

interface IDeleteUserArgs {
  userId: string;
  token: string;
}

const deleteUser = async ({ userId, token }: IDeleteUserArgs): Promise<IServerResponse<IUser> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })


    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default deleteUser;
