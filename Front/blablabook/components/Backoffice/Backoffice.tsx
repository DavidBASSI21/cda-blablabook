import {
  approveComment,
  disapproveComment,
  getAllCommentsToModerate,
  getBookReadCount,
  getCommentCount,
  getReportedCommentCount,
  getUserCount,
} from "@/lib/actions/backoffice.action";
import BackofficeCard from "./BackofficeCard";
import BackofficeSwitch from "./BackofficeSwitchUserComment";
import {
  getUsers,
  updateUserRole,
  removeUser,
} from "@/lib/actions/backoffice.action";

export default async function Backoffice() {
  const [
    resGetUsers,
    resUserCount,
    resGetCommentsToModerate,
    resCommentCount,
    resReportedCommentCount,
    resBookReadCount,
  ] = await Promise.all([
    getUsers(0, 10),
    getUserCount(),
    getAllCommentsToModerate(0, 10),
    getCommentCount(),
    getReportedCommentCount(),
    getBookReadCount(),
  ]);

  const initialUsers = resGetUsers.data || [];
  const totalUserCount = resGetUsers.total || 0;
  const commentsToModerate = resGetCommentsToModerate.data || [];
  const totalCommentsToModerateCount = resGetCommentsToModerate.total || 0;
  const userCount = resUserCount.success ? resUserCount.data.count : 0;
  const commentCount = resCommentCount.success ? resCommentCount.data.count : 0;
  const reportedCommentCount = resReportedCommentCount.success
    ? resReportedCommentCount.data.count
    : 0;
  const bookReadCount = resBookReadCount.success
    ? resBookReadCount.data.count
    : 0;

  return (
    <section className="w-full ">
      <div className="mx-auto sm:py-14 lg:py-3 lg:px-0 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          Backoffice
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <BackofficeCard
            icon="contacts_product"
            label="Utilisateurs"
            count={userCount}
          />
          <BackofficeCard
            icon="chat_bubble"
            label="Critiques"
            count={commentCount}
          />
          <BackofficeCard
            icon="chat_error"
            label="Critiques signalées"
            count={reportedCommentCount}
          />
          <BackofficeCard
            icon="book_5"
            label="Livres lus"
            count={bookReadCount}
          />
        </div>
      </div>
      <div className="mt-4">
        <BackofficeSwitch
          users={initialUsers}
          totalUserCount={totalUserCount}
          onDeleteUser={removeUser}
          onUpdateUserRole={updateUserRole}
          onApproveComment={approveComment}
          onDisapproveComment={disapproveComment}
          commentsToModerate={commentsToModerate}
          totalCommentsToModerateCount={totalCommentsToModerateCount}
        />
      </div>
    </section>
  );
}
