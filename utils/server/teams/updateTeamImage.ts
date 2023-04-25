import IServerResponse from "@/types/server-response";
import { ITeam } from "./getTeam";

interface IUpdateTeamImageArgs {
  teamId: string;
  file: File;
  token: string;
}

const updateTeamImage = async ({
  file,
  token,
  teamId,
}: IUpdateTeamImageArgs): Promise<IServerResponse<ITeam> | null> => {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(`${process.env.apiUrl}/teams/${teamId}/avatar`, {
      method: "PATCH",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });  
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default updateTeamImage;
