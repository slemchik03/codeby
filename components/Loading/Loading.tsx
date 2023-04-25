import Image from "next/image";
import { FC } from "react";
import styles from "./Loading.module.scss"

const Loading: FC = () => {
    return (
        <div className={styles.loadingWrapper}>
            <Image width={60} height={60} src="./images/loading.svg" alt="loading..."/>
        </div>
    )
}

export default Loading;