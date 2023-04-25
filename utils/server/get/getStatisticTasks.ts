import IServerResponse from "@/types/server-response";

export interface IStatisticTasks {
    records: number
}

const getStatisticTasks = async ({
  token,
}: {
  token: string;
}): Promise<IStatisticTasks | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/statistic/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IStatisticTasks> = await response.json();

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

export default getStatisticTasks;
