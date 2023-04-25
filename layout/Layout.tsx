import { FC, ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import styles from "./Layout.module.scss";

export interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {

  return (
    <div className={styles.layout}>
      <Header className={styles.header} />
      <Sidebar className={styles.sidebar} />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export const withLayout = <T extends Record<string, any>>(
  Component: FC<T>,
  access: "protected" | "public"
) => {
  const withLayoutComponent = function (props: T) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };

  withLayoutComponent.access = access;
  return withLayoutComponent;
};
