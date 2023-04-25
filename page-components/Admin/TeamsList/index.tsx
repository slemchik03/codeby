import clsx from "clsx";
import { FC, useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "../UsersList/UsersList.module.scss";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { DeleteUser } from "@/components/Modal/DeleteUser";
import createErrorMessage from "@/utils/createErrorMessage";
import { ITeam } from "@/utils/server/teams/getTeam";
import deleteTeam from "@/utils/server/teams/deleteTeam";
import { TeamListItem } from "../TeamListItem";

interface IProps {
  teamList: ITeam[];
}
let idTeamToDelete: string = "";
let titleTeamToDelete: string = "";
export const TeamsList: FC<IProps> = ({ teamList }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [itemOffset, setItemOffset] = useState(0);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = teamList?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(teamList?.length / itemsPerPage);
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % teamList.length;
    setItemOffset(newOffset);
  };

  const handleDeleteUser = async (id: string) => {
    setDeleteUserModalOpen(false);
    const toastId = toast.loading("Удаляем команду...");
    const response = await deleteTeam({
      teamId: id,
      token: session?.user.token!,
    });
    toast.dismiss(toastId);
    if (response?.status) {
      toast.success("Команда успешно удалена!");
      return router.push("/admin/teams");
    }

    toast.error(
      createErrorMessage(response?.errors, "Не удалось удалить команду!")
    );
  };

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
        title="Введите название команды"
        isOpen={isDeleteUserModalOpen}
        userLogin={titleTeamToDelete}
        onClose={() => setDeleteUserModalOpen(false)}
        onSuccess={() => handleDeleteUser(idTeamToDelete)}
      />
      <div className={styles.top}>
        <span>№</span>
        <span>ID</span>
        <span>ID создателя</span>
        <span>Название</span>
      </div>
      <ul className={styles.list}>
        {currentItems?.map(({ name, id, owner_id }, idx) => (
          <TeamListItem
            key={id}
            deleteTeam={() => {
              idTeamToDelete = id;
              titleTeamToDelete = name;
              setDeleteUserModalOpen(true);
            }}
            teamId={id}
            ownerId={owner_id}
            name={name}
            className={clsx(styles.item, { [styles.oddUser]: idx % 2 })}
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
