'use client';
import { useState } from "react";
import BackofficeUsersTableDesktop from "./BackofficeUsersTableDesktop";
import { User } from "@/lib/actions/backoffice.action";
import BackofficeUsersMobile from "./BackofficeUsersMobile";
import BackofficeCommentsMobile from "./BackofficeCommentsMobile";

export type DeleteUserAction = (userId: number) => Promise<{ success: boolean; error?: string }>;
export type UpdateUserRoleAction = (userId: number, newRoleId: number) => Promise<{ success: boolean; error?: string}> 

interface BackofficeSwitchProps {
    users: User[];
    totalUserCount: number;
    onDeleteUser: (userId: number) => Promise<{ 
        success: boolean; 
        error?: string; 
    }>;
    onUpdateUserRole: (userId: number, newRoleId: number) => Promise<{
        success: boolean;
        error?:string;
    }>;
}

export default function BackofficeSwitchUserComment({users, totalUserCount, onDeleteUser, onUpdateUserRole}: BackofficeSwitchProps) {

    
    const [activeTab, setActiveTab] = useState<'users' | 'reportedComments'>('users');

    return (
        <>
            <div className="flex">
                <button type="button" 
                    className={activeTab === 'users' ? "button-switch-backoffice-active" : "button-switch-backoffice-inactive"}
                    onClick={() => {setActiveTab('users')}}>Utilisateurs</button>
                <button type="button" 
                    className={activeTab === 'reportedComments' ? "button-switch-backoffice-active" : "button-switch-backoffice-inactive"} 
                    onClick={() => {setActiveTab('reportedComments')}}>Critiques signalées</button>
            </div>
            {/* {activeTab === 'users' && (
                <input className="text-black bg-amber-400" type="text" value="coucou"/>
            )} */}
            {activeTab === 'users' && 
                <>
                <div className="hidden lg:block">
                    <BackofficeUsersTableDesktop  users={users} totalUserCount={totalUserCount} onDeleteUser={onDeleteUser} onUpdateUserRole={onUpdateUserRole}/>
                </div>
                <div className="lg:hidden">
                    <BackofficeUsersMobile users={users} totalUserCount={totalUserCount} onDeleteUser={onDeleteUser} onUpdateUserRole={onUpdateUserRole}/>
                </div>
                </>
            }
            {activeTab === 'reportedComments' && 
                <>
                {/* <div className="hidden lg:block">
                    <BackofficeUsersTableDesktop  users={users} totalUserCount={totalUserCount} onDeleteUser={onDeleteUser} onUpdateUserRole={onUpdateUserRole}/>
                </div> */}
                <div className="lg:hidden">
                    <BackofficeCommentsMobile/>
                </div>
                </>
            }
        </>
    )
}