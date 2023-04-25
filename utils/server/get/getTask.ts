import IServerResponse from "@/types/server-response";

export interface ITask {
  category_id: string;
  created_at: string;
  description: string;
  difficult: 'лёгкая' | 'средняя' | 'сложная';
  flag: string;
  hidden: boolean;
  id: string;
  image: string;
  last_restart: string;
  points: number;
  restart_every_minutes: number;
  title: string;
  completed: boolean;
}

interface IGetTasksArgs {
  taskId?: string;
  categoryId?: string;
  slug?: string;
  hidden?: boolean;
  token: string;
  difficult?: string;
}

const getTask = async ({ taskId, hidden, slug, token, difficult, categoryId }: IGetTasksArgs): Promise<ITask | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (taskId != null) {
      queryParams.append('id', taskId);
    }
    if (categoryId != null) {
      queryParams.append('category_id', categoryId);
    }
    if (slug != null) {
      queryParams.append('slug', slug);
    }
    if (hidden != null) {
      queryParams.append('hidden', hidden.toString());
    }
    if (difficult != null) {
      queryParams.append('difficult', difficult);
    }

    const response = await fetch(`${process.env.apiUrl}/tasks?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: IServerResponse<ITask> = await response.json();

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

export default getTask;
