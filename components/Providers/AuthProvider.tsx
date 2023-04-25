import { useSession } from "next-auth/react";
import Router from "next/router";
import { FC, useEffect } from "react";
import Loading from "../Loading/Loading";

interface IProps {
  children: React.ReactNode;
  pageAccess: "protected" | "public";
}

const AuthProvider: FC<IProps> = ({ children, pageAccess }) => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" && pageAccess === "protected") {
      Router.push("/signIn");
    }

    // disabling telegram widget ui
    const iframe = document.getElementById("telegram-login-TaskController_Bot");
    iframe && iframe.setAttribute("style", "display: none");
  });

  if (status === "authenticated" || pageAccess === "public")
    return <>{children}</>;

  return <Loading />;
};

export default AuthProvider;
