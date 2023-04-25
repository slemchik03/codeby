import getUser, { IUser } from "@/utils/server/get/getUser";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

export default function useUser() {
  const { data: session } = useSession();
  const { data: user } = useQuery(
    "user",
    async () =>
      await getUser({ id: session?.user.id!, token: session?.user.token! })
  );

  
  return user;
}
