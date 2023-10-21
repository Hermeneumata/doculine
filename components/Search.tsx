"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import { TextInput } from "@tremor/react";
import { useTransition } from "react";
import Spinner from "@/components/Spinner";

export default function Search({ disabled }: { disabled?: boolean }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <TextInput
        icon={MagnifyingGlassIcon}
        disabled={disabled}
        placeholder="Search by name..."
        spellCheck={false}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {isPending && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
