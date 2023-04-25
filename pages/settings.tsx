import { withLayout } from '@/layout/Layout'
import { Settings as SettingsCard } from '@/page-components'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import styles from '../styles/Settings.module.scss'
import { authOptions } from './api/auth/[...nextauth]'
import Head from "next/head";

const Settings = () => {
  return (
    <>
      <Head>
        <title>Игры Кодебай | Настройки</title>
      </Head>
      <div className={styles.settings}>
        <SettingsCard />
      </div>
    </>
  )
}

export default withLayout(Settings, "protected")

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  return {
    props: {
      session
    },
  };
}
