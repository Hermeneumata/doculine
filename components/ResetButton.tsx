"use client";

import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ResetButton() {
  return (
    <button
      onClick={() => {
        window.location.href = window.location.pathname;
      }}
      className="flex gap-1 items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
    >
      Reset
      <XMarkIcon className="block h-5 w-5" aria-hidden="true" />
    </button>
  );
}
