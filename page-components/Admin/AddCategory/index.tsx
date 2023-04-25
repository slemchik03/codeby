import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react";
import { Button, Input, RadioInput } from "@/components";
import ImageUploading, { ImageListType } from "react-images-uploading";
import UploadImage from "../../../public/icons/upload-image.svg";
import styles from "./AddCategory.module.scss";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectAdmin } from "@/redux/admin/selector";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import updateCategory from "@/utils/server/update/updateCategory";
import addCategory from "@/utils/server/add/addCategory";
import updateCategoryImage from "@/utils/server/update/updateCategoryImage";
import toast, { Toaster } from "react-hot-toast";
import createErrorMessage from "@/utils/createErrorMessage";
import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";
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

export interface AddCategoryProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setAdd?: Dispatch<SetStateAction<boolean>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  type: "add" | "edit";
}

export const AddCategory = ({
  className,
  setAdd,
  setEdit,
  type,
}: AddCategoryProps) => {
  const categoryToUpdate = useSelector(selectAdmin).categoryToUpdate;
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [content, setContent] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(
    !!categoryToUpdate?.hidden!
  );
  const [title, setTitle] = useState<string>(categoryToUpdate?.title!);
  const [slug, setSlug] = useState<string>(categoryToUpdate?.slug!);
  const [image, setImage] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const maxNumber = 1;

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
      const toastId = toast.loading("Добавляем новую категорию...");
      const response = await updateCategory({
        credentials: {
          title: title,
          description: content,
          slug: slug,
          hidden: visibility,
        },
        token: session?.user.token!,
        categoryId: categoryToUpdate?.id!,
      });
      if (image[0]) {
        const response = await updateCategoryImage({
          id: categoryToUpdate?.id!,
          token: session?.user.token!,
          /* @ts-ignore does not matter */
          file: image[0]?.file,
        });
      }
      toast.dismiss(toastId);
      if (response?.status) {
        toast.success("Категория успешно добавлена!");
        return router.push("/admin/categories");
      }

      toast.error(
        createErrorMessage(response?.errors, "Не удалось добавить категорию!")
      );
    } else {
      const toastId = toast.loading("Добавляем новую категорию...");
      const response = await addCategory({
        title,
        description: content,
        slug,
        hidden: visibility,
        token: session?.user.token!,
      });
      if (image[0]) {
        await updateCategoryImage({
          id: response?.data.id!,
          token: session?.user.token!,
          /* @ts-ignore does not matter */
          file: image[0]?.file,
        });
      }
      toast.dismiss(toastId);
      if (response?.status) {
        toast.success("Категория успешно добавлена!");
        return router.push("/admin/categories");
      }
      toast.error(
        createErrorMessage(response?.errors, "Не удалось добавить категорию!")
      );
    }
  };
  const onChangeImage = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImage(imageList as never[]);
  };
  useEffect(() => {
    if (type === "edit" && categoryToUpdate?.description) {
      const contentBlock = htmlToDraft(categoryToUpdate?.description);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const _editorState = EditorState.createWithContent(contentState);

      setEditorState(_editorState);
    }
  }, []);
  return (
    <div className={clsx(styles.addCategory, className)}>
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <div className={styles.inputs}>
        <ImageUploading
          multiple
          value={image}
          onChange={onChangeImage}
          maxNumber={maxNumber}
        >
          {({
            imageList,
            onImageUpload,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className={styles.uploadContainer}>
              <div className={styles.uploadWrapper}>
                <button
                  className={styles.uploadHere}
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <UploadImage />
                </button>
                <span className={styles.uploadText}>Загрузите изображение</span>
              </div>
              &nbsp;
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <Image
                    className={styles.image}
                    src={image.dataURL as string}
                    alt=""
                    width={316}
                    height={140}
                  />
                  <div className="image-item__btn-wrapper">
                    <button
                      className={styles.updateButton}
                      onClick={() => onImageUpdate(index)}
                    >
                      Обновить
                    </button>
                    <button
                      className={styles.removeButton}
                      onClick={() => onImageRemove(index)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
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
        <Input
          className={styles.slug}
          onChange={(e) => setSlug(e.currentTarget.value)}
          value={slug}
          status="default"
          type="text"
          placeholder="Введите slug категории"
          title="Slug"
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
          onClick={handleUpdate}
          className={styles.publish}
          variant="green"
          text={type === "edit" ? "Сохранить изменения" : "Добавить категорию"}
        />
        <button onClick={handleCancel} className={styles.cancel}>
          Отменить
        </button>
      </div>
    </div>
  );
};
