import { IHint } from "@/utils/server/get/getHints";

interface IAddHintArgs {
  token: string;
  description: string;
  taskId: string;
}

const addHint = async ({ token, description, taskId }: IAddHintArgs): Promise<IHint | null> => {
  try {
    const response = await fetch(`${process.env.apiUrl}/hints/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description, task_id: taskId }),
    });

    return (await response.json()).data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default addHint;
