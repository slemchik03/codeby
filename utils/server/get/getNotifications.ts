import IServerResponse from "@/types/server-response";
import {INews} from "@/utils/server/get/getNews";

export interface INotification {
  created_at: string;
  description: string;
  id: string;
  image: string;
  title: string;
  user_id: string;
}

interface IGetNotificationsArgs {
  limit: number;
  notificationId?: string;
  userId: string;
  token: string;
}

const getNotifications = async ({ limit, token, notificationId, userId }: IGetNotificationsArgs): Promise<INotification[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (notificationId != null) {
      queryParams.append('data.id', notificationId);
    }
    queryParams.append('data.user_id', userId);

    const response = await fetch(`${process.env.apiUrl}/notifications/list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const data: IServerResponse<INotification[]> = await response.json();

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

export default getNotifications;
