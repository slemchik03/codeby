import IServerResponse from "@/types/server-response";

export interface INews {
  created_at: string;
  description: string;
  hidden: boolean;
  id: string;
  title: string;
}

interface IGetNewsArgs {
  limit: number;
  newsId?: string;
  token: string;
  hidden?: boolean;
}

const getNews = async ({ limit, newsId, token, hidden }: IGetNewsArgs): Promise<INews[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (newsId != null) {
      queryParams.append('data.id', newsId);
    }
    if (hidden != null) {
      queryParams.append('data.task_id', hidden.toString());
    }

    const response = await fetch(
      `${process.env.apiUrl}/news/list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    const data: IServerResponse<INews[]> = await response.json();

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

export default getNews;
