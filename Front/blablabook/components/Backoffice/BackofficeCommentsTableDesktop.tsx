"use client";
import {
  Comment,
  getAllCommentsToModerate,
} from "@/lib/actions/backoffice.action";
import DialogForCommentCellTable from "./DialogForCommentCellTable";
import { useRouter } from "next/navigation";
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
import {
  ApproveCommentAction,
  DisapproveCommentAction,
} from "./BackofficeSwitchUserComment";
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    approveComment?: (commentId: number, newStatus: string) => Promise<void>;
    disapproveComment?: (commentId: number, newStatus: string) => Promise<void>;
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

const columnHelper = createColumnHelper<Comment>();

const columns = [
  columnHelper.accessor("user.username", {
    cell: (info) => {
      const comment = info.row.original;
      const username = info.getValue();
      console.log("info.row.original :", comment);
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            {comment.user.profilePicture ? (
              <Image
                src={getUploadUrl(comment.user.profilePicture)}
                alt={`Photo de profil de ${comment.user.username}`}
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
        Utilisateur
      </span>
    ),
  }),
  columnHelper.accessor("user.email", {
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
  columnHelper.accessor("title", {
    cell: (info) => (
      <div className="max-w-[200px] truncate" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
    header: () => (
      <span className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: "16px",
            fontVariationSettings: "'OPSZ' 20, 'wght' 300",
          }}
        >
          title
        </span>
        Titre
      </span>
    ),
  }),
  columnHelper.accessor("content", {
    // cell: (info) => (
    //   <div className="max-w-[300px] truncate" title={info.getValue()}>
    //     {info.getValue()}
    //   </div>
    // ),
    cell: (info) => <DialogForCommentCellTable content={info.getValue()} />,
    header: () => (
      <span className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{
            fontSize: "16px",
            fontVariationSettings: "'OPSZ' 20, 'wght' 300",
          }}
        >
          chat_bubble
        </span>
        Contenu
      </span>
    ),
  }),
  columnHelper.accessor("_count.reports", {
    cell: (info) => {
      const count = info.getValue();
      return <div className="flex items-center">{count}</div>;
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
          report
        </span>
        Nb. signalements
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row, table }) => {
      const comment = row.original;
      return (
        <div className="flex items-center justify-around gap-6">
          <button
            type="button"
            onClick={() => {
              if (table.options.meta?.disapproveComment) {
                table.options.meta.disapproveComment(comment.id, "HIDDEN");
              }
            }}
            className="w-9 h-9 rounded-xl bg-red-200 flex items-center justify-center cursor-pointer hover:bg-red-300 transition-colors duration-300"
            title="Masquer la critique"
          >
            <span className="material-symbols-rounded text-red-800">
              chat_bubble_off
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (table.options.meta?.approveComment) {
                table.options.meta.approveComment(comment.id, "APPROVED");
              }
            }}
            className="w-9 h-9 rounded-xl bg-green-200 flex items-center justify-center cursor-pointer hover:bg-green-300 transition-colors duration-300"
            title="Approuver la critique"
          >
            <span className="material-symbols-rounded text-green-800">
              mark_chat_read
            </span>
          </button>
        </div>
      );
    },
  }),
];

export default function BackofficeCommentsTableDesktop({
  commentsToModerate,
  totalCommentsToModerateCount,
  onApproveComment,
  onDisapproveComment,
}: {
  commentsToModerate: Comment[];
  totalCommentsToModerateCount: number;
  onApproveComment: ApproveCommentAction;
  onDisapproveComment: DisapproveCommentAction;
}) {
  const router = useRouter();
  const [data, setData] = useState(commentsToModerate);
  const [total, setTotal] = useState(totalCommentsToModerateCount);
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
        const res = await getAllCommentsToModerate(pageIndex, pageSize);
        if (res.data) {
          setData(res.data);
          setTotal(res.total);
        }
      } catch (error) {
        console.error("Erreur de récupération des critiques:", error);
      }
    };

    fetchData();
  }, [pageIndex, pageSize, debouncedSearch]);

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
      approveComment: async (commentId: number, newStatus: string) => {
        const result = await onApproveComment(commentId, newStatus);
        if (result.success) {
          setData((prev) => prev.filter((comment) => comment.id !== commentId));
          setTotal((prev) => prev - 1);
          router.refresh();
        } else {
          alert(result.error || "Erreur lors de l'approbation de la critique");
        }
      },
      disapproveComment: async (commentId: number, newStatus: string) => {
        const result = await onDisapproveComment(commentId, newStatus);
        if (result.success) {
          setData((prev) => prev.filter((comment) => comment.id !== commentId));
          setTotal((prev) => prev - 1);
          router.refresh();
        } else {
          alert(result.error || "Erreur lors du masquage de la critique");
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
          placeholder="Rechercher par pseudo, email ou titre"
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
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 h-10">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="inline-flex items-center gap-3 bg-blue-100 text-slate-700 px-6 py-4 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-sm opacity-90 font-medium">
                        Aucune critique à modérer pour le moment
                      </p>
                      <span className="material-symbols-rounded">task_alt</span>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Éléments par page</span>
            <select
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
      )}
    </div>
  );
}
