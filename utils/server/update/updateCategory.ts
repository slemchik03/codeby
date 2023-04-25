import IServerResponse from "@/types/server-response";
import {ICategory} from "@/utils/server/get/getCategory";

export interface IUpdateCategoryArgs {
    credentials: {
        description?: string,
        hidden?: boolean,
        slug?: string,
        title?: string
    },
    categoryId: string,
    token: string
}

const updateCategory = async ({credentials, categoryId, token}: IUpdateCategoryArgs): Promise<IServerResponse<ICategory | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/categories/${categoryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    const data: IServerResponse<ICategory | null> = await response.json();

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

export default updateCategory;
