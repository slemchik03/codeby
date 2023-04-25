import clsx from "clsx";
import { FC, useState } from "react";

import ReactPaginate from "react-paginate";
import styles from "./UsersList.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { IUser } from "@/utils/server/get/getUser";
import { UserListItem } from "../UserListItem";
import deleteUser from "@/utils/server/delete/deleteUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { ConfirmAct } from "@/components/Modal/ConfirmAct";
import { DeleteUser } from "@/components/Modal/DeleteUser";
import createErrorMessage from "@/utils/createErrorMessage";

interface IProps {
  usersList: IUser[];
}
let idUserToDelete: string = "";
let loginUserToDelete: string = "";
export const UsersList: FC<IProps> = ({ usersList }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [itemOffset, setItemOffset] = useState(0);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = usersList?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(usersList?.length / itemsPerPage);
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % usersList.length;
    setItemOffset(newOffset);
  };

  const handleDeleteUser = async (id: string) => {
    setDeleteUserModalOpen(false);
    const toastId = toast.loading("Удаляем пользователя...");
    const response = await deleteUser({
      userId: id,
      token: session?.user.token!,
    });
    toast.dismiss(toastId);
    if (response?.status) {
      toast.success("Пользователь успешно удалён!");
      return router.push("/admin/users");
    }

    toast.error(
      createErrorMessage(response?.errors, "Не удалось удалить пользователя!")
    );
  };
  console.log(usersList);
  
  return (
    <div className={styles.usersList}>
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <DeleteUser
        successBtnText="Удалить"
        closeBtnText="Закрыть"
        title="Введите логин пользователя"
        isOpen={isDeleteUserModalOpen}
        userLogin={loginUserToDelete}
        onClose={() => setDeleteUserModalOpen(false)}
        onSuccess={() => handleDeleteUser(idUserToDelete)}
      />
      <div className={styles.top}>
        <span>№</span>
        <span>ID</span>
        <span>Логин</span>
        <span>Команда</span>
        <span>Роль</span>
      </div>
      <ul className={styles.list}>
        {currentItems?.map(({ login, role, id, team_id }, idx) => (
          <UserListItem
            key={id}
            deleteUser={() => {
              idUserToDelete = id;
              loginUserToDelete = login;
              setDeleteUserModalOpen(true);
            }}
            userId={id}
            teamId={team_id}
            className={clsx(styles.item, { [styles.oddUser]: idx % 2 })}
            login={login}
            role={role}
            place={itemOffset + idx + 1}
          />
        ))}
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
  );
};
