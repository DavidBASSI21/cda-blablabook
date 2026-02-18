"use client";
import { User } from "@/lib/actions/backoffice.action";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import Image from "next/image";
import { getUploadUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getUsers } from "@/lib/actions/backoffice.action";
import {
  DeleteUserAction,
  UpdateUserRoleAction,
} from "./BackofficeSwitchUserComment";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    removeRow?: (userId: number) => Promise<void>;
    updateUserRole?: (userId: number, newRoleId: number) => Promise<void>;
  }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("username", {
    cell: (info) => {
      const user = info.row.original;
      const username = info.getValue();
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden">
            {user.profilePicture ? (
              <Image
                src={getUploadUrl(user.profilePicture)}
                alt={`Photo de profil de ${user.username}`}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-blue-300 w-full h-full flex items-center justify-center">
                <span className="material-symbols-rounded text-blue-950">
                  hide_image
                </span>
              </div>
            )}
          </div>
          <span>{username}</span>
        </div>
      );
    },
    header: () => (
      <span className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: "16px",
            fontVariationSettings: "'OPSZ' 20, 'wght' 300",
          }}
        >
          contacts_product
        </span>{" "}
        Pseudo
      </span>
    ),
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: "16px",
            fontVariationSettings: "'OPSZ' 20, 'wght' 300",
          }}
        >
          stacked_email
        </span>
        Email
      </span>
    ),
  }),
  columnHelper.accessor("role.id", {
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta;
      const isAdmin = user.role?.id === 1;
      const handleToggle = async () => {
        if (meta?.updateUserRole) {
          const newRoleId = isAdmin ? 2 : 1;
          await meta.updateUserRole(user.id, newRoleId);
        }
      };
      return (
        <div className="flex items-center">
          <button
            className={`toggle-btn w-9 h-9 ${isAdmin ? "toggled" : ""}`}
            onClick={handleToggle}
          >
            <div className="thumb"></div>
          </button>
        </div>
      );
    },
    header: () => (
      <span className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: "16px",
            fontVariationSettings: "'OPSZ' 20, 'wght' 300",
          }}
        >
          admin_panel_settings
        </span>
        Admin
      </span>
    ),
  }),
  columnHelper.accessor("isPrivate", {
    cell: (info) => {
      const user = info.row.original;
      return (
        <div className="flex items-center">
          {user.isPrivate === false ? "Public" : "Privé"}
        </div>
      );
    },
    header: () => (
      <span className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: "16px",
            fontVariationSettings: "'OPSZ' 20, 'wght' 300",
          }}
        >
          visibility
        </span>
        Visibilité profil
      </span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => {
      const date = new Date(info.getValue());
      return (
        <div className="flex items-center">
          {date.toLocaleDateString("fr-FR")}
        </div>
      );
    },
    header: () => <span>Membre depuis le</span>,
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => {
      const date = new Date(info.getValue());
      return (
        <div className="flex items-center">
          {date.toLocaleDateString("fr-FR")}
        </div>
      );
    },
    header: () => <span>Dernière modification</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span>Action</span>,
    cell: ({ row, table }) => {
      const user = row.original;
      return (
        <div className="flex items-center">
          <button
            type="button"
            onClick={(e) => {
              if (table.options.meta?.removeRow) {
                table.options.meta.removeRow(user.id);
              }
            }}
            className="w-9 h-9 rounded-xl bg-red-200 flex items-center justify-center cursor-pointer hover:bg-red-300 transition-colors duration-300"
          >
            <span className="material-symbols-rounded text-red-800">
              person_remove
            </span>
          </button>
        </div>
      );
    },
  }),
];

export default function BackofficeUsersTableDesktop({
  users,
  totalUserCount,
  onDeleteUser,
  onUpdateUserRole,
}: {
  users: User[];
  totalUserCount: number;
  onDeleteUser: DeleteUserAction;
  onUpdateUserRole: UpdateUserRoleAction;
}) {
  const [data, setData] = useState(users);
  const [total, setTotal] = useState(totalUserCount);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);
  const [{ pageIndex, pageSize }, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers(pageIndex, pageSize, debouncedSearch);
        setData(res.data);
        setTotal(res.total);
      } catch (error) {
        console.error("Erreur de recherche:", error);
      }
    };

    fetchData();
  }, [pageIndex, pageSize, debouncedSearch]);

  const [toggled, setToggled] = useState(false);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    manualPagination: true,
    manualFiltering: true,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      globalFilter,
    },
    onPaginationChange: (updater) => {
      setPagination((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      removeRow: async (userId: number) => {
        const result = await onDeleteUser(userId);
        if (result.success) {
          setData((prev) => prev.filter((user) => user.id !== userId));
          setTotal((prev) => prev - 1);
        } else {
          alert(result.error || "Erreur lors de la suppression");
        }
      },
      updateUserRole: async (userId: number, newRoleId: number) => {
        const result = await onUpdateUserRole(userId, newRoleId);
        if (result.success) {
          setData((prevData) => {
            return prevData.map((user) => {
              if (user.id === userId) {
                return {
                  ...user,
                  roleId: newRoleId,
                  role: {
                    ...user.role,
                    id: newRoleId,
                    name: newRoleId === 1 ? "ADMIN" : "USER",
                  },
                };
              }
              return user;
            });
          });
        } else {
          alert(result.error || "Erreur lors du changement de rôle");
        }
      },
    },
  });
  return (
    <div className="flex flex-col mx-auto py-6">
      <div className="mb-4 relative text-gray-400">
        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          search
        </span>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Rechercher par pseudo ou email"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className=" px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 h-10">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="mr-2">Éléments par page</span>
          <select
            name=""
            id=""
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
          >
            {[10, 30, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="material-symbols-rounded">
              keyboard_double_arrow_left
            </span>
          </button>
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="material-symbols-rounded">
              keyboard_arrow_left
            </span>
          </button>
          <span className="flex items-center">
            <input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 p-2 rounded-md border border-gray-300 text-center"
            />
            <span className="ml-1">sur {table.getPageCount()}</span>
          </span>
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="material-symbols-rounded">
              keyboard_arrow_right
            </span>
          </button>
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="material-symbols-rounded">
              keyboard_double_arrow_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
