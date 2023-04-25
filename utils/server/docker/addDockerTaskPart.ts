import IServerResponse from "@/types/server-response";

interface IAddDockerTaskPartArgs {
  data: FormData;
  token: string;
}

const addDockerTaskPart = async ({ data, token }: IAddDockerTaskPartArgs): Promise<IServerResponse<{}> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/part/docker`, {
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

export default addDockerTaskPart;
