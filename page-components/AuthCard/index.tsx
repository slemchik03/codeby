import { Button, Input } from "@/components";
import {
  DetailedHTMLProps,
  FormEventHandler,
  HTMLAttributes,
  useState,
} from "react";
import TgIcon from "../../public/icons/telegram.svg";
import styles from "./AuthCard.module.scss";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import registerUser from "@/utils/server/registerUser";
import restorePassword from "@/utils/server/restorePassword";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import Image from "next/image";
import Logo from "../../layout/Sidebar/icons/logo.svg"

export interface AuthCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type: "login" | "register";
}

export const AuthCard = ({ type }: AuthCardProps) => {
  const [formType, setFormType] = useState<AuthCardProps["type"]>(type);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const router = useRouter();
  const { status } = useSession();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const isPasswordValid = password.length >= 3;
    const isEmailValid = email.length >= 3;
    const isNicknameValid = nickname.length >= 3;

    if (formType === "login") {
      if (isPasswordValid && (isEmailValid || isNicknameValid)) {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        res?.ok && toast.success("Вход выполнен!");
        res?.error && toast.error("Пользователь не найден!");
      }
    }
    if (formType === "register") {
      if (isEmailValid && isPasswordValid && isNicknameValid) {
        const result = await registerUser({
          email,
          password,
          login: nickname,
        });

        result?.status && toast.success("Регистрация прошла успешно!");
        if (result?.status) {
          return await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
        }
        const errorMessage = Object.values(result?.errors || {});
        toast.error(
          errorMessage[0]
            ? errorMessage[0]?.slice(0, 1).toUpperCase() +
                errorMessage[0]?.slice(1)
            : "Ошибка!"
        );
      }
    }
  };

  const restorePasswordHandler = async () => {
    if (!email) {
      return toast.error("Перед тем как восстановить пароль введите email!");
    }
    const restorePasswordRes = await restorePassword({ subject: email });

    if (restorePasswordRes?.status) {
      return toast.success("Ссылка для восстановления пароля успешно отправлена!");
    }

    const errorMessage = Object?.values(restorePasswordRes?.errors || {});
    toast.error(
      errorMessage[0]
        ? errorMessage[0]?.slice(0, 1).toUpperCase() + errorMessage[0]?.slice(1)
        : "Ошибка!"
    );
  };

  const authWithTelegram = async () => {
    window.Telegram.Login.auth(
      { bot_id: "6144262405", request_access: true },
      (data: any) => {
        if (!data) {
          toast.error("Пользователь не найден!");
        } else {
          signIn("credentials", {
            telegram_credentials: JSON.stringify({
              ...data,
              photo_url: data.photo_url || "",
              last_name: data.last_name || "",
            }),
            redirect: false,
          }).then((response) => {
            response?.ok && toast.success("Вход выполнен!");
            response?.error && toast.error("Пользователь не найден!");
          });
        }
      }
    );
  };
  const registerWithTelegram = async () => {
    window.Telegram.Login.auth(
      { bot_id: "6144262405", request_access: true },
      (data: any) => {
        if (!data) {
          toast.error("Пользователь не найден!");
        } else {
          router.push(
            `/signUp/telegram?telegram_credentials=${JSON.stringify({
              ...data,
              photo_url: data.photo_url || "",
              last_name: data.last_name || "",
            })}`
          );
        }
      }
    );
  };
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <div className={styles.authContainer}>
      <form onSubmit={onSubmit} className={styles.authCard}>
        <Toaster
          toastOptions={{
            style: {
              background: "#282c35",
              color: "#ffff",
            },
          }}
          position="top-center"
        />
        <Logo width="150" height="39" style={{marginBottom: "20px"}}/>
        <span className={styles.title}>
          {formType === "login" && "Войти с помощью"}
        </span>
        <span className={styles.title}>
          {formType === "register" && "Зарегистрироваться с помощью"}
        </span>
        {formType === "login" && (
          <>
            <div onClick={authWithTelegram} className={styles.telegram}>
              <TgIcon />
            </div>
            <span className={styles.or}>ИЛИ</span>
          </>
        )}
        {formType === "register" && (
          <>
            <div onClick={registerWithTelegram} className={styles.telegram}>
              <TgIcon />
            </div>
            <span className={styles.or}>ИЛИ</span>
          </>
        )}
        {formType === "register" && (
          <div className={styles.inputs}>
            <Input
              onChange={(e) => setNickname(e.currentTarget.value)}
              value={nickname}
              status={
                nickname === "" ? "default" : (nickname.length <= 3 ? "false" : "true")
              }
              type="text"
              title="Никнейм"
              placeholder="Введите никнейм"
            />
            <Input
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              status={
                email === "" ? "default" : (email.length <= 3 ? "false" : "true")
              }
              type="email"
              title="Email"
              placeholder="Введите Email"
            />
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
            <Button text="Зарегистрироваться" variant="green" />
            <p>
              У вас уже есть аккаунт?{" "}
              <span
                onClick={() =>
                  router.push("/signIn", undefined, { shallow: true })
                }
              >
                Войти
              </span>
            </p>
            <p>
              Создавая учетную запись, вы соглашаетесь{" "}
              <Link href="/rules">
                <span> с правилами и условиями</span>
              </Link>{" "}
              оказания услуг нашей площадки.{" "}
            </p>
          </div>
        )}
        {formType === "login" && (
          <div className={styles.inputs}>
            <Input
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              status={
                email === "" ? "default" : (email.length <= 3 ? "false" : "true")
              }
              type="text"
              title="Email/Логин"
              placeholder="Введите Email/Логин"
            />
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
            <p>
              Забыли пароль?{" "}
              <span onClick={() => restorePasswordHandler()}>Восстановить</span>
            </p>
            <Button text="Войти" variant="green" />
            <p>
              У вас еще нет аккаунта?{" "}
              <span
                onClick={() =>
                  router.push("/signUp", undefined, { shallow: true })
                }
              >
                Зарегистрироваться
              </span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
