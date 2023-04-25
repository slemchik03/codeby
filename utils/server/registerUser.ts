import IServerResponse from "@/types/server-response";
import {IUser} from "./get/getUser";

interface IRegisterUserArgs {
  email: string;
  login: string;
  password: string;
}

const registerUser = async (credentials: IRegisterUserArgs): Promise<IServerResponse<IUser> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data: IServerResponse<IUser> = await response.json();
    
    return data;
  } catch (error) {
    return null;
  }
};

export default registerUser;
