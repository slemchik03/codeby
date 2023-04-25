import IServerResponse from "@/types/server-response";
import { ICategory } from "../get/getCategory";

interface IDeleteCategoryArgs {
  categoryId: string;
  token: string;
}

const deleteCategory = async ({ categoryId, token }: IDeleteCategoryArgs): Promise<IServerResponse<ICategory[]> | null> => {
  try {
    const response = await fetch(
      `${process.env.apiUrl}/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default deleteCategory;
