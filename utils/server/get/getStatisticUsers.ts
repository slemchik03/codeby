import IServerResponse from "@/types/server-response";

export interface IStatisticUsers {
    records: number
}

const getStatisticUsers = async ({
  token,
}: {
  token: string;
}): Promise<IStatisticUsers | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/statistic/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IStatisticUsers> = await response.json();

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

export default getStatisticUsers;
