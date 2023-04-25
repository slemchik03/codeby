import IServerResponse from "@/types/server-response";

export interface ITeam {
    avatar: string,
    created_at: string,
    description: string,
    id: string,
    name: string,
    owner_id: string,
    password: string
}

export interface IGetTeamArgs {
  id?: string;
  title?:string;
  description?: string;
  hidden?: boolean;
  token: string;
  difficult?: string;
}

const getTeam = async ({ id, description, hidden, token, difficult }: IGetTeamArgs): Promise<ITeam | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (id != null) {
      queryParams.append("id", id.toString());
    }
    if (description != null) {
      queryParams.append('id', description);
    }

    if (hidden != null) {
      queryParams.append('hidden', hidden.toString());
    }
    if (difficult != null) {
      queryParams.append('difficult', difficult);
    }

    const response = await fetch(`${process.env.apiUrl}/teams/?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<ITeam> = await response.json();

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

export default getTeam;
