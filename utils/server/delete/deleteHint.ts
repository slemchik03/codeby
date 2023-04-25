import IServerResponse from "@/types/server-response";
import {IHint} from "@/utils/server/get/getHints";

interface IDeleteHintArgs{
  hintId: string;
  token: string;
}

const deleteHint = async ({ hintId, token }: IDeleteHintArgs): Promise<IServerResponse<IHint> | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/hints/${hintId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return (await response.json()).data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default deleteHint;
