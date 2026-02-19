"use client";
import { useState } from "react";
import BackofficeUsersTableDesktop from "./BackofficeUsersTableDesktop";
import BackofficeCommentsTableDesktop from "./BackofficeCommentsTableDesktop";
import { User, Comment } from "@/lib/actions/backoffice.action";
import BackofficeCommentsDrawerMobile from "./BackofficeCommentsDrawerMobile";
import BackofficeUsersMobile from "./BackofficeUsersMobile";

export type DeleteUserAction = (
  userId: number,
) => Promise<{ success: boolean; error?: string }>;
export type UpdateUserRoleAction = (
  userId: number,
  newRoleId: number,
) => Promise<{ success: boolean; error?: string }>;
export type ApproveCommentAction = (
  commentId: number,
  newStatus: string,
) => Promise<{ success: boolean; error?: string }>;
export type DisapproveCommentAction = (
  commentId: number,
  newStatus: string,
) => Promise<{ success: boolean; error?: string }>;

interface BackofficeSwitchProps {
  users: User[];
  totalUserCount: number;
  commentsToModerate: Comment[];
  totalCommentsToModerateCount: number;
  onDeleteUser: (userId: number) => Promise<{
    success: boolean;
    error?: string;
  }>;
  onUpdateUserRole: (
    userId: number,
    newRoleId: number,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  onApproveComment: (
    commentId: number,
    newStatus: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  onDisapproveComment: (
    commentId: number,
    newStatus: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export default function BackofficeSwitchUserComment({
  users,
  totalUserCount,
  commentsToModerate: initialComments,
  totalCommentsToModerateCount: initialCommentsCount,
  onDeleteUser,
  onUpdateUserRole,
  onApproveComment,
  onDisapproveComment,
}: BackofficeSwitchProps) {
  const [activeTab, setActiveTab] = useState<"users" | "reportedComments">(
    "users",
  );
  const comments = initialComments;
  const totalComments = initialCommentsCount;
  return (
    <>
      <div className="flex">
        <button
          type="button"
          className={
            activeTab === "users"
              ? "button-switch-backoffice-active"
              : "button-switch-backoffice-inactive"
          }
          onClick={() => {
            setActiveTab("users");
          }}
        >
          Utilisateurs
        </button>
        <button
          type="button"
          className={
            activeTab === "reportedComments"
              ? "button-switch-backoffice-active"
              : "button-switch-backoffice-inactive"
          }
          onClick={() => {
            setActiveTab("reportedComments");
          }}
        >
          Critiques signalées
        </button>
      </div>
      {/* {activeTab === 'users' && (
                <input className="text-black bg-amber-400" type="text" value="coucou"/>
            )} */}
      {activeTab === "users" && (
        <>
          <div className="hidden lg:block">
            <BackofficeUsersTableDesktop
              users={users}
              totalUserCount={totalUserCount}
              onDeleteUser={onDeleteUser}
              onUpdateUserRole={onUpdateUserRole}
            />
          </div>
          <div className="lg:hidden">
            <BackofficeUsersMobile
              users={users}
              totalUserCount={totalUserCount}
              onDeleteUser={onDeleteUser}
              onUpdateUserRole={onUpdateUserRole}
            />
          </div>
        </>
      )}
      {activeTab === "reportedComments" && (
        <>
          <div className="hidden lg:block">
            <BackofficeCommentsTableDesktop
              key={`desktop-${totalComments}`}
              commentsToModerate={comments}
              totalCommentsToModerateCount={totalComments}
              onApproveComment={onApproveComment}
              onDisapproveComment={onDisapproveComment}
            />
          </div>
          <div className="lg:hidden">
            <BackofficeCommentsDrawerMobile
              key={`mobile-${totalComments}`}
              commentsToModerate={comments}
              totalCommentsToModerateCount={totalComments}
              onApproveComment={onApproveComment}
              onDisapproveComment={onDisapproveComment}
            />
          </div>
        </>
      )}
    </>
  );
}
