"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import removeDocument from "@/lib/removeDocument";

export default function RemoveButton({ id }: { id?: number }) {
  const router = useRouter();

  const handleClick = async () => {
    if (!id) {
      return;
    }
    await removeDocument(id);
    router.refresh();
  };
  return (
    <button onClick={handleClick}>
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-500" />
    </button>
  );
}
