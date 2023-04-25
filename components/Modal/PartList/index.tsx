import {
  DetailedHTMLProps,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";
import { Card } from "@/page-components";
import styles from "./PartList.module.scss";
import { Button } from "@/components/UI/Button";
import { selectAdmin } from "@/redux/admin/selector";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import getPartsOfTask, { IPartOfTask } from "@/utils/server/get/getPartsOfTask";
import { Simulate } from "react-dom/test-utils";
import load = Simulate.load;
import clsx from "clsx";
import ReactPaginate from "react-paginate";
import { PartListItem } from "@/components/Modal/PartList/PartListItem";
import deletePartOfTask from "@/utils/server/delete/deletePartOfTask";
import { useRouter } from "next/router";
import updatePartOfTask from "@/utils/server/update/updatePartOfTask";
import startDockerContainer from "@/utils/server/docker/startDockerContainer";
import stopDockerContainer from "@/utils/server/docker/stopDockerContainer";
import IServerResponse from "@/types/server-response";
import wrapperStyles from "../Modal.module.scss";
import { Dialog } from "@headlessui/react";
import { useSelector } from "react-redux";

export interface PartListProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
  }

export const PartList = ({isOpen, onClose}: PartListProps) => {
  const [parts, setParts] = useState<IPartOfTask[] | null>();
  const [actionPerformed, setActionPerformed] = useState<boolean>(false);

  const currentTask = useSelector(selectAdmin).taskToUpdate;
  const { data: session } = useSession();

  const router = useRouter();
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = parts?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(parts?.length! / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % parts?.length!;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const loadParts = async () => {
      const taskPartsResponse = await getPartsOfTask({
        limit: 50,
        taskId: currentTask?.id,
        token: session?.user.token!,
      });
      setParts(taskPartsResponse);
    };

    loadParts();
  }, [currentTask?.id, actionPerformed]);

  const handleChangeActivePart = async (
    id: string,
    type: string,
    system_data: string,
    active: boolean
  ) => {
    if (type == "docker") {
      const toastId = toast.loading("Обновляем статус Docker-контейнера...");
      let response: IServerResponse<boolean | null> | null;
      if (active) {
        response = await startDockerContainer({
          containerId: system_data,
          token: session?.user.token!,
        });
      } else {
        response = await stopDockerContainer({
          containerId: system_data,
          token: session?.user.token!,
        });
      }
      toast.dismiss(toastId);

      if (response?.errors) {
        const errorMessage = Object.values(response?.errors || {});
        toast.error(
          errorMessage[0]
            ? errorMessage[0]?.slice(0, 1).toUpperCase() +
                errorMessage[0]?.slice(1)
            : "Не удалось обновить часть задания!"
        );
        return;
      }
    }

    const toastId = toast.loading("Обновляем часть задания...");
    const response = await updatePartOfTask({
      credentials: {
        active: active,
      },
      partId: id,
      token: session?.user.token!,
    });

    toast.dismiss(toastId);
    if (response?.status) {
      toast.success("Часть задания успешно обновлена!");
    }

    if (response?.errors) {
      const errorMessage = Object.values(response?.errors || {});
      toast.error(
        errorMessage[0]
          ? errorMessage[0]?.slice(0, 1).toUpperCase() +
              errorMessage[0]?.slice(1)
          : "Не удалось обновить часть задания!"
      );
      return;
    }

    setActionPerformed(!actionPerformed);
  };

  const handleDeletePart = async (id: string) => {
    const toastId = toast.loading("Удаляем часть задания...");
    const response = await deletePartOfTask({
      partId: id,
      token: session?.user.token!,
    });
    toast.dismiss(toastId);
    if (response?.status) {
      toast.success("Часть задания успешно удалена!");
      return router.push("/admin/tasks");
    }

    const errorMessage = Object.values(response?.errors || {});
    toast.error(
      errorMessage[0]
        ? errorMessage[0]?.slice(0, 1).toUpperCase() + errorMessage[0]?.slice(1)
        : "Не удалось удалить часть задания!"
    );

    setActionPerformed(!actionPerformed);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className={clsx(wrapperStyles.modalWrapper)}>
        <Dialog.Panel>
          <div className={styles.part_list}>
            <Toaster
              toastOptions={{
                style: {
                  background: "#282c35",
                  color: "#ffff",
                },
              }}
            />
            <Card
              title="Просмотр частей задания"
              desc={`Задание: ${currentTask?.id}`}
            >
              <div className={styles.table}>
                <div className={styles.top}>
                  <span>ID</span>
                  <span>Данные</span>
                  <span>Системные данные</span>
                  <span>Тип</span>
                </div>

                <ul className={styles.list}>
                  {currentItems?.map(
                    ({ id, data, system_data, type, active }, idx) => (
                      <PartListItem
                        key={id}
                        partId={id}
                        className={clsx(styles.item, {
                          [styles.oddPart]: idx % 2,
                        })}
                        part_data={data}
                        system_data={system_data}
                        part_type={type}
                        active={active}
                        changeActive={handleChangeActivePart}
                        deletePart={handleDeletePart}
                      />
                    )
                  )}
                </ul>
                <div className={styles.pagination}>
                  <ReactPaginate
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={undefined}
                    disableInitialCallback={true}
                    containerClassName="paginationButtons"
                    previousLinkClassName="prevButton"
                    nextLinkClassName="nextButton"
                    disabledClassName="disabledButton"
                    activeClassName="activeButton"
                  />
                </div>
              </div>
              <div className={styles.buttons}>
                <Button
                  onClick={onClose}
                  text="Отменить"
                  variant="red"
                />
              </div>
            </Card>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
