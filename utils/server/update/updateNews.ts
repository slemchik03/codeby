import IServerResponse from "@/types/server-response";
import {INews} from "@/utils/server/get/getNews";
import {ICategory} from "@/utils/server/get/getCategory";

export interface IUpdateNewsArgs {
    credentials: {
        description?: string,
        hidden?: boolean,
        title?: string,
    },
    newsId: string,
    token: string
}

const updateNews = async ({ token, credentials, newsId }: IUpdateNewsArgs): Promise<IServerResponse<INews | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/news/${newsId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    const data: IServerResponse<INews> = await response.json();

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

export default updateNews;
