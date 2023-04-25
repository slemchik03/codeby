import IServerResponse from "@/types/server-response";
import { IUser } from "../get/getUser";

export interface ICredentials {
  biography?: string;
  email?: string;
  full_name?: string;
  github_url?: string;
  login?: string;
  password?: string;
  telegram_mention?: string;
}

const updateUser = async (credentials: ICredentials, token: string): Promise<IServerResponse<IUser | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/users/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    const data: IServerResponse<IUser> = await response.json();

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

export default updateUser;
