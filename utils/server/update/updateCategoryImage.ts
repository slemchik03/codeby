import IServerResponse from "@/types/server-response";
import {ICategory} from "@/utils/server/get/getCategory";

interface IUpdateCategoryImageArgs {
  id: string;
  file: File;
  token: string;
}

const updateCategoryImage = async ({ id, file, token }: IUpdateCategoryImageArgs): Promise<ICategory | null> => {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(`${process.env.apiUrl}/categories/${id}/image`, {
      method: "PATCH",
      headers: {
        'accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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

export default updateCategoryImage;
