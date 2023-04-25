import IServerResponse from "@/types/server-response";

export interface IStopDockerContainerArgs {
    containerId: string,
    token: string
}

const stopDockerContainer = async ({ token, containerId }: IStopDockerContainerArgs): Promise<IServerResponse<boolean | null> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/docker/${containerId}/stop`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<boolean> = await response.json();

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

export default stopDockerContainer;
