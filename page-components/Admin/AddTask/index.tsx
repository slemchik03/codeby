import clsx from "clsx";
import { useMemo, useState } from "react";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react";
import { Button, Input, RadioInput, Select } from "@/components";
import ImageUploading, { ImageListType } from "react-images-uploading";
import UploadImage from "../../../public/icons/upload-image.svg";
import Add from "../../../public/icons/plus.svg";
import styles from "./AddTask.module.scss";
import Image from "next/image";
import { useQuery } from "react-query";
import getCategories from "@/utils/server/get/getCategories";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import addTask from "@/utils/server/add/addTask";
import addHint from "@/utils/server/add/addHint";
import updateTaskImage from "@/utils/server/update/updateTaskImage";
import toast, { Toaster } from "react-hot-toast";
import createErrorMessage from "@/utils/createErrorMessage";
import { EditorProps } from "react-draft-wysiwyg";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw } from "draft-js";
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

export interface AddTaskProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setAdd?: Dispatch<SetStateAction<boolean>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  type: "add" | "edit";
}

export const AddTask = ({ className, setAdd, setEdit, type }: AddTaskProps) => {
  const [image, setImage] = useState([]);
  const [visibility, setVisibility] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("Выберите категорию");
  const [points, setPoints] = useState<string>("0");
  const [flag, setFlag] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [restartEveryMinutes, setRestartEveryMinutes] = useState<number>(0);
  const [difficult, setDifficult] = useState<string>("");
  const [helps, setHelps] = useState<string[]>([]);
  const { data: session } = useSession();
  const { data: categoryList } = useQuery("categories", () =>
    getCategories({ limit: 30, hidden: false, token: session?.user.token! })
  );

  const categoriesTitle = useMemo(() => {
    if (categoryList && Array.isArray(categoryList)) {
      return categoryList.map((cat) => cat.title);
    }
    return [];
  }, [categoryList]);
  const difficultTitle = useMemo(() => {
    return ["лёгкая", "средняя", "сложная"];
  }, []);

  const currentCategoryId = useMemo(() => {
    if (categoryList && Array.isArray(categoryList)) {
      const needle = categoryList.filter((cat) => category === cat.title);
      return needle[0] ? needle[0].id : null;
    }
    return null;
  }, [category]);

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

  const onAddImage = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImage(imageList as never[]);
  };

  const handleAdd = async () => {
    const toastId = toast.loading("Добавляем новое задание...");
    const data = {
      credentials: {
        title: name,
        points: +points,
        flag: flag,
        description: content,
        hidden: visibility,
        category_id: currentCategoryId + "",
        difficult: difficult,
        restart_every_minutes: +restartEveryMinutes,
      },
      token: session?.user.token!,
    };
    const response = await addTask({
      ...data,
    });

    if (response?.status) {
      await Promise.all(
        helps.map(async (v) => {
          if (v.length) {
            await addHint({
              description: v,
              taskId: response?.data.id! + "",
              token: session?.user.token!,
            });
          }
        })
      );
    }

    if (image[0]) {
      await updateTaskImage({
        id: response?.data.id!,
        token: session?.user.token!,
        /* @ts-ignore does not matter */
        file: image[0]?.file,
      });
    }

    toast.dismiss(toastId);
    if (response?.status) {
      toast.success("Задание успешно добавлено!");
      return router.push("/admin/tasks");
    }
    toast.error(
      createErrorMessage(response?.errors, "Не удалось создать задание!")
    );
  };
  const handleHelpsChange = (idx: number, value: string) => {
    const updatedHelps = [...helps];
    updatedHelps[idx] = value;
    setHelps(updatedHelps);
  };

  return (
    <div className={clsx(styles.addTask, className)}>
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
          onChange={onAddImage}
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
                <span className={styles.uploadText}>Загрузите иконку</span>
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
        <div className={styles.fields}>
          <div className={styles.left}>
            <div className={styles.category}>
              <span className={styles.categoryTitle}>Категория</span>
              <Select
                className={styles.select}
                active={category}
                setActive={setCategory}
                showTitle={false}
                placeholder="Выберите категорию"
                type="select"
                variant="gray"
                options={categoriesTitle}
                title="Категория"
              />
            </div>
            <Input
              className={styles.name}
              onChange={(e) => setName(e.currentTarget.value)}
              value={name}
              status="default"
              type="text"
              placeholder="Введите название"
              title="Название"
            />
            <Editor
              editorState={editorState}
              toolbarClassName="toolbar"
              editorClassName="editor"
              onEditorStateChange={(newState) => {
                setEditorState(newState);
                setContent(
                  draftToHtml(convertToRaw(newState.getCurrentContent()))
                );
              }}
            />
            <Input
              className={styles.restartEveryMinutes}
              onChange={(e) =>
                setRestartEveryMinutes(parseInt(e.currentTarget.value))
              }
              value={restartEveryMinutes}
              status="default"
              type="text"
              placeholder="Количество минут"
              title="Перезагрузка задания"
            />
          </div>
          <div className={styles.right}>
            <Input
              className={styles.points}
              onChange={(e) => setPoints(e.currentTarget.value)}
              value={points}
              status="default"
              type="text"
              placeholder="Введите"
              title="Очки за выполнение"
            />
            <Input
              className={styles.flag}
              onChange={(e) => setFlag(e.currentTarget.value)}
              value={flag}
              status="default"
              type="text"
              placeholder="Введите"
              title="Верный флаг"
            />

            <div className={styles.difficult}>
              <span className={styles.difficultTitle}>Сложность задания</span>
              <Select
                className={styles.select}
                active={difficult}
                setActive={setDifficult}
                showTitle={false}
                placeholder="Выберите сложность задания"
                type="select"
                variant="gray"
                options={difficultTitle}
                title="Сложность задания"
              />
            </div>

            <div className={styles.helps}>
              {helps.length > 0 &&
                helps.map((item, idx) => (
                  <Input
                    type="text"
                    status="default"
                    key={idx}
                    value={item}
                    onChange={(e) =>
                      handleHelpsChange(idx, e.currentTarget.value)
                    }
                    placeholder="Введите"
                    title={`Подсказка №${idx + 1}`}
                  />
                ))}
              <button
                onClick={() => setHelps((helps) => [...helps, ""])}
                className={styles.add}
              >
                <Add /> Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          onClick={() => handleAdd()}
          className={styles.publish}
          variant="green"
          text={type === "edit" ? "Сохранить изменения" : "Создать задание"}
        />
        <button onClick={handleCancel} className={styles.cancel}>
          Отменить
        </button>
      </div>
    </div>
  );
};
