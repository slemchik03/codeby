import { Button, Input } from "@/components";
import { FC, FormEventHandler, useState } from "react";
import restorePasswordStyles from "../../styles/RestorePassword.module.scss";
import styles from "../../page-components/AuthCard/AuthCard.module.scss";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Head from "next/head";

interface IProps {
  token: string;
}

const RestorePassword: FC<IProps> = ({ token }) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const updateUserPasswordResponse = await (
        await fetch(`${process.env.apiUrl}/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ token, password }),
        })
      ).json();

      if (updateUserPasswordResponse?.status) {
        toast.success("Пароль успешно изменен!");
        router.reload()
      }
    }
  };
  return (
    <>
      <Head>
        <title>Игры Кодебай | Восстановление пароля</title>
      </Head>
      <div className={restorePasswordStyles.restorePassword}>
        <Toaster
          toastOptions={{
            style: {
              background: "#282c35",
              color: "#ffff",
            },
          }}
          position="top-center"
        />
        <form onSubmit={onSubmit} className={styles.authCard}>
          <span className={styles.title}>Введите новый пароль:</span>
          <div className={styles.inputs}>
            <Input
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
              status={
                  password === "" ? "default" : (password.length <= 3 ? "false" : "true")
              }
              type="password"
              title="Пароль"
              placeholder="Введите пароль"
            />
            <Input
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              value={confirmPassword}
              status={
                  confirmPassword === "" ? "default" : (confirmPassword.length <= 3 ? "false" : "true")
              }
              type="password"
              title="Подтвердите пароль"
              placeholder="Подтвердите пароль"
            />
          </div>

          <Button
            style={{ padding: "0 10px" }}
            text="Изменить пароль"
            variant="green"
          />
        </form>
      </div>
    </>
  );
};

// @ts-ignore its ok
RestorePassword.access = "public";
export default RestorePassword;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const { query } = ctx;
  const token = query.token;
  const isTokenValidResponse = await (
    await fetch(`${process.env.apiUrl}/auth/reset-password/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ token }),
    })
  ).json();

  if (isTokenValidResponse?.status) {
    return {
      props: { token, session },
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
