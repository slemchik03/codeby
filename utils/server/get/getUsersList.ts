import IServerResponse from "@/types/server-response";
import { IUser } from "./getUser";

interface IGetUserListArgs {
  limit: number;
  token: string;
  login?: string;
  id?: string;
}

const getUsersList = async ({
  token,
  limit,
  login,
  id,
}: IGetUserListArgs): Promise<IUser[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    if (login != null) {
      queryParams.append("data.login", login);
    }
    if (id) {
      queryParams.append("data.id", id);
    }
    const response = await fetch(
      `${process.env.apiUrl}/users/list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: IServerResponse<IUser[]> = await response.json();

    if (data.status) {
      return data.data;
    } else {
      // console.error(data.errors);
    }
    return null;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export default getUsersList;
