import clsx from "clsx";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useEffect,
} from "react";
import { useState } from "react";
import { Button, IconButton, Input, RadioInput } from "@/components";
import DeleteTag from "../../../public/icons/delete-tag.svg";
import styles from "./AddNews.module.scss";
import updateNews from "@/utils/server/update/updateNews";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectAdmin } from "@/redux/admin/selector";
import { useRouter } from "next/router";
import addNews from "@/utils/server/add/addNews";
import toast, { Toaster } from "react-hot-toast";
import { EditorProps } from "react-draft-wysiwyg";
import dynamic from "next/dynamic";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

// @ts-ignore
let htmlToDraft: Function = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

export interface AddNewsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setAdd?: Dispatch<SetStateAction<boolean>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  type: "add" | "edit";
}

export const AddNews = ({ className, setAdd, setEdit, type }: AddNewsProps) => {
  const newsToUpdate = useSelector(selectAdmin).newsToUpdate;
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [content, setContent] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(
    !!newsToUpdate?.hidden!
  );
  const [title, setTitle] = useState<string>(newsToUpdate?.title!);
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddTag = () => {
    if (newTag !== "") {
      setTags(tags.concat(newTag));
    }
    setNewTag("");
  };

  const handleCancel = () => {
    if (type === "add") {
      setAdd && setAdd(false);
    }
    if (type === "edit") {
      setEdit && setEdit(false);
    }
  };
  const handleUpdate = async () => {
    if (type === "edit") {
      const toastId = toast.loading("Обновляем текущую новость...");
      const response = await updateNews({
        credentials: {
          title,
          description: content,
          hidden: visibility
        },
        token: session?.user.token!,
        newsId: newsToUpdate?.id!,
      });
      toast.dismiss(toastId);
      if (response?.status) {
        toast.success("Новость успешно обновлена!");
        return router.push("/admin/news")
      }
      const errorMessage = Object.values(response?.errors || {});
      toast.error(
        errorMessage[0]
          ? errorMessage[0]?.slice(0, 1).toUpperCase() +
              errorMessage[0]?.slice(1)
          : "Не удалось обновить новость!"
      );
    } else {
      const toastId = toast.loading("Добавляем новую новость...");
      const response = await addNews({
        title,
        description: content,
        hidden: visibility,
        token: session?.user.token!,
      });
      toast.dismiss(toastId);
      if (response?.status) {
        toast.success("Новость успешно создана!");
        return router.push("/admin/news")
      }
      const errorMessage = Object.values(response?.errors || {});
      toast.error(
        errorMessage[0]
          ? errorMessage[0]?.slice(0, 1).toUpperCase() +
              errorMessage[0]?.slice(1)
          : "Не удалось создать новость!"
      );
    }
  };

  useEffect(() => {
    if (type === "edit" && newsToUpdate?.description) {
      const contentBlock = htmlToDraft(newsToUpdate?.description);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const _editorState = EditorState.createWithContent(contentState);

      setEditorState(_editorState);
    }
  }, []);
  return (
    <div className={clsx(styles.addNews, className)}>
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <div className={styles.inputs}>
        <span className={styles.visibility}>Видимость</span>
        <div className={styles.radioContainer}>
          <RadioInput
            checked={visibility === true}
            text="Скрыта"
            onChange={() => setVisibility(!visibility)}
          />
          <RadioInput
            checked={visibility === false}
            text="Не скрыта"
            onChange={() => setVisibility(!visibility)}
          />
        </div>
        <Input
          className={styles.title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          status="default"
          value={title}
          type="text"
          placeholder="Введите заголовок"
          title="Заголовок"
        />
        <Editor
          editorState={editorState}
          toolbarClassName="toolbar"
          editorClassName="editor"
          onEditorStateChange={(newState) => {
            setEditorState(newState);
            setContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
          }}
        />
      </div>
      <div className={styles.buttons}>
        <Button
          onClick={() => handleUpdate()}
          className={styles.publish}
          variant="green"
          text={type === "edit" ? "Сохранить изменения" : "Опубликовать"}
        />
        <button onClick={handleCancel} className={styles.cancel}>
          Отменить
        </button>
      </div>
    </div>
  );
};
