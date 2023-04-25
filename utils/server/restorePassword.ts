import IServerResponse from "@/types/server-response";
import {IUser} from "@/utils/server/get/getUser";

interface IRestorePassword {
  created_at: string,
  deleted_at: string,
  id: string,
  user_id: string
}

interface IRestorePasswordArgs {
  subject: string;
}

const restorePassword = async (credentials: IRestorePasswordArgs): Promise<IServerResponse<IRestorePassword> | null> => {
    try {
      const response = await fetch(`${process.env.apiUrl}/auth/reset-password/request`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      const data: IServerResponse<IRestorePassword> = await response.json();

      return data;
    } catch (error) {
      // console.error(error);
      return null;
    }
}

export default restorePassword;