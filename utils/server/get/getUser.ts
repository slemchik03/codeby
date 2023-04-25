import IServerResponse from "@/types/server-response";

export interface IUser {
  avatar: string;
  biography: string;
  created_at: string;
  email: string;
  full_name: string;
  github_url: string;
  id: string;
  login: string;
  role: string;
  telegram_id: number;
  telegram_mention: string;
  team_id: string;
}

interface IGetUserArgs {
  id?: string;
  token: string;
  email?: string;
  telegramId?: string;
  login?: string;
}

const getUser = async ({ id, token, email, telegramId, login }: IGetUserArgs): Promise<IUser | null> => {
  const queryParams = new URLSearchParams();
  if (id != null) {
    queryParams.append("id", id);
  }
  if (email != null) {
    queryParams.append("email", email);
  }
  if (telegramId != null) {
    queryParams.append("telegram_id", telegramId);
  }
  if (login != null) {
    queryParams.append("login", login);
  }

  try {
    const response = await fetch(`${process.env.apiUrl}/users?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IUser> = await response.json();

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

export default getUser;