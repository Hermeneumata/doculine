"use client";

import { useState, useEffect } from "react";
import { ChevronUpDownIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { Badge } from "@tremor/react";
import classNames from "classnames";
import { Tag } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import getProjectTags from "@/lib/getProjectTags";

export default function TagInput({
  selectedTags,
  setSelectedTags,
  projectId,
}: {
  selectedTags: Tag[];
  setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  projectId: string;
}) {
  const [query, setQuery] = useState("");
  const [comboboxKey, setComboboxKey] = useState(0);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getProjectTags(projectId);
      setAllTags(tags);
    };

    fetchTags();
  }, [projectId]);
  const filteredTags =
    query === ""
      ? allTags.filter(
          (tag) =>
            !selectedTags.some(
              (selectedTag) => selectedTag.id.toString() === tag.id.toString()
            )
        )
      : allTags.filter((tag) => {
          return (
            tag.name.toLowerCase().includes(query.toLowerCase()) &&
            !selectedTags.some(
              (selectedTag) => selectedTag.id.toString() === tag.id.toString()
            )
          );
        });

  const addTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
    setQuery("");
    setComboboxKey((prevKey) => prevKey + 1);
  };

  const createTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addTag({ id: uuidv4(), name: query });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 my-2">
        {selectedTags
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tag) => (
            <Badge key={tag.id}>
              <span className="flex gap-1 items-center">
                {tag.name}
                <XCircleIcon
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))
                  }
                />
              </span>
            </Badge>
          ))}
      </div>
      <Combobox as="div" onChange={addTag} key={comboboxKey}>
        <div className="relative mt-2">
          <Combobox.Input
            className="w-full outline-none rounded-md transition duration-100 border border-gray-200 bg-white py-1.5 pl-3 pr-10 text-gray-500 focus:border-blue-400 shadow-sm focus:ring-outset ring-gray-300 focus:ring-2 focus:ring-blue-300 sm:text-sm sm:leading-6 hover:bg-gray-50"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredTags.length >= 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {query.length > 2 &&
                !filteredTags.map((tag) => tag.name).includes(query) && (
                  <button
                    className="block px-4 py-2 text-gray-500"
                    onClick={createTag}
                  >
                    Create &quot;{query}&quot;
                  </button>
                )}
              {filteredTags.map((tag) => (
                <Combobox.Option
                  key={tag.id}
                  value={tag}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-blue-300" : "text-gray-500"
                    )
                  }
                >
                  {tag.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </>
  );
}
