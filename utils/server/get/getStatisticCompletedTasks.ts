import IServerResponse from "@/types/server-response";

export interface IStatisticCompletedTasks {
    points: number,
    records: number
}

const getStatisticCompletedTasks = async ({
  token,
}: {
  token: string;
}): Promise<IStatisticCompletedTasks | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/statistic/completed_tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IStatisticCompletedTasks> = await response.json();

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

export default getStatisticCompletedTasks;
