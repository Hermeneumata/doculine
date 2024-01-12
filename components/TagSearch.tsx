"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TextInput } from "@tremor/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Spinner from "@/components/Spinner";
import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { Tag } from "@/lib/types";

export default function TagSearch({ tags }: { tags: Tag[] }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("tags");
    if (term) {
      setValue(term.split(","));
    }
  }, []);
  const handleChange = (value: string[]) => {
    setValue(value);

    const params = new URLSearchParams(window.location.search);
    if (value.length > 0) {
      params.set("tags", value.join(","));
    } else {
      params.delete("tags");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="max-w-sm mx-auto space-y-6">
        <MultiSelect
          value={value}
          onValueChange={handleChange}
          placeholder="Search by tags…"
        >
          {tags.map((tag) => (
            <MultiSelectItem key={tag.id} value={tag.id}>
              {tag.name}
            </MultiSelectItem>
          ))}
        </MultiSelect>
      </div>
    </div>
  );
}
