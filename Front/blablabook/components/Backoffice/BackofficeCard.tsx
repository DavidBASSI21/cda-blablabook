interface BackofficeCardProps {
  icon: string;
  label: string;
  count: number;
}

export default function BackofficeCard({
  icon,
  label,
  count,
}: BackofficeCardProps) {
  return (
    <div className="bg-indigo-100 w-[48%] rounded-md px-2.5 py-3.5 lg:w-[24%]">
      <div className="flex flex-col gap-y-2.5">
        <div className="bg-violet-500 p-4 rounded-md flex justify-center items-center w-9 h-9">
          <span className="material-symbols-rounded">{icon}</span>
        </div>
        <p className="text-gray-400 text-xl whitespace-nowrap">{label}</p>
      </div>
      <p className="text-4xl font-bold text-noir">{count}</p>
    </div>
  );
}
