import IServerResponse from "@/types/server-response";
import { INews } from "@/utils/server/get/getNews";

interface IAddNewsArgs {
  token: string;
  title: string;
  hidden: boolean;
  description: string;
}

const addNews = async ({ token, title, hidden, description }: IAddNewsArgs): Promise<IServerResponse<INews> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/news/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description, hidden, title }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default addNews;
