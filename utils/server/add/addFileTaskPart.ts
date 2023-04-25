import IServerResponse from "@/types/server-response";

interface IAddFileTaskPartArgs {
  data: FormData;
  token: string;
}

const addFileTaskPart = async ({ data, token }: IAddFileTaskPartArgs): Promise<IServerResponse<{}> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/part/file`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default addFileTaskPart;