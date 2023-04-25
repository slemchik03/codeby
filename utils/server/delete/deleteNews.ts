import IServerResponse from "@/types/server-response";
import { INews } from "@/utils/server/get/getNews";

interface IDeleteNewsArgs {
  newsId: string;
  token: string;
}

const deleteNews = async ({ newsId, token }: IDeleteNewsArgs): Promise<IServerResponse<INews> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/news/${newsId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default deleteNews;
