import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import styles from "../../styles/SignUp.module.scss";
import styles1 from "../../page-components/AuthCard/AuthCard.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import { Button, Input } from "@/components";
import { FC, FormEventHandler, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

interface IProps {
  telegramCredentials: string;
}

const Telegram: FC<IProps> = ({ telegramCredentials }) => {
  const [nickname, setNickname] = useState("");
  const {status} = useSession()
  const router = useRouter()
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Создаем пользователя...");
    try {
      const response = await (
        await fetch(`${process.env.apiUrl}/users/telegram`, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: JSON.parse(telegramCredentials),
            login: nickname,
          }),
        })
      ).json();

      toast.dismiss(toastId);

      if (response?.status) {
        toast.success("Пользователь успешно создан!");
        signIn("credentials", { telegram_credentials: telegramCredentials });
      } else {
        const errorMessage = Object.values(response?.errors || {}) as string[];
        toast.error(
          errorMessage[0]
            ? errorMessage[0]?.slice(0, 1).toUpperCase() +
                errorMessage[0]?.slice(1)
            : "Не удалось создать задание!"
        );
      }
    } catch (error) {
      toast.dismiss(toastId);
    }
  };
useEffect(() => {
  if (status === "authenticated") {
    router.push("/")
  }
}, [status])
  return (
    <>
      <Head>
        <title>Игры Кодебай | Регистрация</title>
      </Head>
      <div className={styles.signUp}>
        <Toaster
          toastOptions={{
            style: {
              background: "#282c35",
              color: "#ffff",
            },
          }}
        />
        <form onSubmit={onSubmit} className={styles1.authCard}>
          <div className={styles1.inputs}>
            <Input
              value={nickname}
              status={"default"}
              onChange={(e) => setNickname(e.currentTarget.value)}
              type="text"
              title="Логин"
              placeholder="Введите логин"
            />
            <Button text="Зарегистрироватся" variant="green" />
          </div>
        </form>
      </div>
    </>
  );
};

// @ts-ignore
Telegram.access = "public";

export default Telegram;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  return {
    props: {
      session,
      telegramCredentials: ctx.query["telegram_credentials"],
    },
  };
};
