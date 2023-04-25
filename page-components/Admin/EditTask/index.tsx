import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react";
import { Button, IconButton, Input, RadioInput, Select } from "@/components";
import ImageUploading, { ImageListType } from "react-images-uploading";
import UploadImage from "../../../public/icons/upload-image.svg";
import Add from "../../../public/icons/plus.svg";
import styles from "../AddTask/AddTask.module.scss";
import Image from "next/image";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectAdmin } from "@/redux/admin/selector";
import { useRouter } from "next/router";
import getHints, { IHint } from "@/utils/server/get/getHints";
import addHint from "@/utils/server/add/addHint";
import updateTask from "@/utils/server/update/updateTask";
import updateTaskImage from "@/utils/server/update/updateTaskImage";
import toast, { Toaster } from "react-hot-toast";
import { InputWithIcons } from "@/components/UI/InputWithIcons/InputWithIcons";
import deleteHint from "@/utils/server/delete/deleteHint";
import updateHint from "@/utils/server/update/updateHint";
import { ICategory } from "@/utils/server/get/getCategory";
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

export interface AddTaskProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setAdd?: Dispatch<SetStateAction<boolean>>;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  type: "add" | "edit";
  categoryList: ICategory[];
}

export const EditTask = ({
  className,
  setAdd,
  setEdit,
  type,
  categoryList,
}: AddTaskProps) => {
  const [image, setImage] = useState([]);
  const taskToUpdate = useSelector(selectAdmin).taskToUpdate;
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [content, setContent] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(
    !!taskToUpdate?.hidden!
  );
  const [category, setCategory] = useState<string>("");
  const [points, setPoints] = useState<string>(
    taskToUpdate?.points ? taskToUpdate?.points + "" : "0"
  );
  const [flag, setFlag] = useState<string>(taskToUpdate?.flag!);
  const [name, setName] = useState<string>(taskToUpdate?.title!);
  const [restartEveryMinutes, setRestartEveryMinutes] = useState<number>(
    taskToUpdate?.restart_every_minutes!
  );
  const [difficult, setDifficult] = useState<string>(taskToUpdate?.difficult!);
  const [help, setHelp] = useState<string>("");
  const [helps, setHelps] = useState<IHint[]>([]);
  const { data: session } = useSession();

  const { data: currentHelpers } = useQuery("helpers", () =>
    getHints({
      limit: 30,
      token: session?.user.token!,
      taskId: taskToUpdate?.id!,
    })
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

  const currentCategory = useMemo(() => {
    if (categoryList && Array.isArray(categoryList)) {
      const needle = categoryList.filter(
        ({ id }) => id === taskToUpdate?.category_id
      );
      return needle[0] ? needle[0] : null;
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

  const onChangeImage = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImage(imageList as never[]);
  };

  const handleChangeHelp = (idx: number, value: string) => {
    const updatedHelps = [...helps];
    updatedHelps[idx].description = value;
    setHelps(updatedHelps);
  };
  const handleUpdate = async () => {
    const toastId = toast.loading("Обновляем текущее задание...");
    const response = await updateTask({
      credentials: {
        title: name,
        points: +points,
        flag,
        description: content,
        hidden: visibility,
        category_id: currentCategory?.id + "",
        difficult,
        restart_every_minutes: +restartEveryMinutes,
      },
      token: session?.user.token!,
      taskId: taskToUpdate?.id!,
    });
    if (image[0]) {
      await updateTaskImage({
        id: taskToUpdate?.id!,
        token: session?.user.token!,
        /* @ts-ignore does not matter */
        file: image[0]?.file,
      });
    }
    toast.dismiss(toastId);
    if (response?.status) {
      toast.success("Задание успешно обновлено!");
      return router.push("/admin/tasks");
    }
    toast.error(
      createErrorMessage(response?.errors, "Не удалось обновить задание!")
    );
  };
  const addHelper = async () => {
    if (help.length >= 1) {
      const toastId = toast.loading("Обновляем текущее задание...");
      const response = await addHint({
        description: help,
        taskId: taskToUpdate?.id!,
        token: session?.user.token!,
      });
      toast.dismiss(toastId);
      if (response) {
        toast.success("Задание успешно обновлено!");

        setHelps((val) => [...val, response]);
        return setHelp("");
      }
    }
    toast.error("Не удалось добавить подсказку!");
  };
  const deleteHelperHandler = async (id: string) => {
    const response = await deleteHint({
      token: session?.user.token!,
      hintId: id,
    });
    if (response) {
      setHelps((helps) => helps.filter((help) => help.id !== id));
      toast.success("Подсказка удалена!");
    }
  };
  const updateHelperHandler = async (id: string, description: string) => {
    const response = await updateHint({
      token: session?.user.token!,
      hintId: id,
      description,
    });
    if (response) {
      return toast.success("Подсказка обновлена!");
    }
    toast.error("Не удалось обновить категорию.");
  };
  useEffect(() => {
    currentHelpers && setHelps(currentHelpers);
  }, [currentHelpers]);

  useEffect(() => {
    setCategory(currentCategory?.title || "Выберите категорию");
  }, [currentCategory]);

  useEffect(() => {
    if (type === "edit" && taskToUpdate?.description) {
      const contentBlock = htmlToDraft(taskToUpdate?.description);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const _editorState = EditorState.createWithContent(contentState);

      setEditorState(_editorState);
    }
  }, []);
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
              <Input
                onChange={(e) => setHelp(e.currentTarget.value)}
                value={help}
                status="default"
                type="text"
                placeholder="Введите"
                title="Подсказка"
              />
              {helps.length > 0 &&
                helps.map((item, idx) => (
                  <InputWithIcons
                    type="text"
                    status="default"
                    onChange={(e) =>
                      handleChangeHelp(idx, e.currentTarget.value)
                    }
                    deleteHandler={() => deleteHelperHandler(item.id)}
                    updateHandler={() =>
                      updateHelperHandler(item.id, item.description)
                    }
                    key={idx}
                    value={item.description}
                  />
                ))}
              <button onClick={addHelper} className={styles.add}>
                <Add /> Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          onClick={() => handleUpdate()}
          className={styles.publish}
          variant="green"
          text={"Сохранить изменения"}
        />
        <button onClick={handleCancel} className={styles.cancel}>
          Отменить
        </button>
      </div>
    </div>
  );
};
