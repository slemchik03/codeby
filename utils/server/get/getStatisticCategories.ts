import IServerResponse from "@/types/server-response";

export interface IStatisticCategories {
  categories: {
    id: string;
    points: number;
    tasks: number;
    title: string;
  }[];
  records: number;
}

const getStatisticCategories = async ({
  token,
}: {
  token: string;
}): Promise<IStatisticCategories | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/statistic/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<IStatisticCategories> = await response.json();

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

export default getStatisticCategories;
