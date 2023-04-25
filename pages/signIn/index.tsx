import { AuthCard } from "@/page-components";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import styles from "../../styles/SignUp.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";

const SignIn = () => {

  return (
    <>
      <Head>
        <title>Игры Кодебай | Вход</title>
      </Head>
      <div className={styles.signUp}>
        <AuthCard type="login" />
      </div>
    </>
  );
};

SignIn.access = "public";

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  return {
    props: {
      session,
    },
  };
};
