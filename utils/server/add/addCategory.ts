import IServerResponse from "@/types/server-response";
import {ICategory} from "../get/getCategory";

interface IAddCategoryArgs {
  token: string;
  description: string;
  hidden: boolean;
  title: string;
  slug: string;
}

const addCategory = async ({ token, description, hidden, title, slug }: IAddCategoryArgs): Promise<IServerResponse<ICategory> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/categories/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description, hidden, title, slug }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default addCategory;