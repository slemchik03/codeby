import IServerResponse from "@/types/server-response";

export interface ICategory {
  created_at: string;
  description: string;
  hidden: boolean;
  id: string;
  image: string;
  slug: string;
  title: string;
}

interface IGetCategoryArgs {
  categoryId?: string;
  slug?: string;
  hidden?: boolean;
  token: string;
}

const getCategory = async ({ categoryId, hidden, slug, token }: IGetCategoryArgs): Promise<ICategory | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (categoryId != null) {
      queryParams.append("id", categoryId);
    }
    if (slug != null) {
      queryParams.append("slug", slug);
    }
    if (hidden != null) {
      queryParams.append("hidden", hidden.toString());
    }
    
    const response = await fetch(`${process.env.apiUrl}/categories?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<ICategory> = await response.json();

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

export default getCategory;
