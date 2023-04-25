import IServerResponse from "@/types/server-response";

interface IAuthCredentials {
  password: string;
  subject: string;
}

interface IAuthToken {
  token: string;
  expires_at: string;
}

const authUser = async (credentials: IAuthCredentials): Promise<IAuthToken | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: IServerResponse<{
      type: string;
      expires_at: string;
      data: string;
    }> = await response.json()

    if (data.data) {
      return { token: data.data.data, expires_at: data.data.expires_at };
    }
    return null
  } catch (error) {
    return null;
  }
};

export default authUser;
