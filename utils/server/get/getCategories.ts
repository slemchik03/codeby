import IServerResponse from "@/types/server-response";
import { ICategory } from "@/utils/server/get/getCategory";

interface IGetCategoriesArgs {
  limit: number;
  categoryId?: string;
  slug?: string;
  hidden?: boolean;
  token: string;
}

const getCategories = async ({ limit, categoryId, hidden, slug, token }: IGetCategoriesArgs): Promise<ICategory[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    if (categoryId != null) {
      queryParams.append("data.id", categoryId);
    }
    if (slug != null) {
      queryParams.append("data.slug", slug);
    }
    if (hidden != null) {
      queryParams.append("data.hidden", hidden.toString());
    }
    
    const response = await fetch(`${process.env.apiUrl}/categories/list?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<ICategory[]> = await response.json();

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

export default getCategories;
