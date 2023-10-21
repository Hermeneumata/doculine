"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import NewRecordForm from "@/components/NewRecordForm";
import { NewDocumentDBModel, queryBuilder } from "@/lib/planetscale";
import createDocument from "@/lib/createDocument";
import { DocumentType } from "@/lib/types";
import { dateToMySQLFormat } from "@/lib/utils";

export default function SlideOver({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [document, setDocument] = useState({
    title: "",
    date: undefined as Date | undefined,
    description: "",
    downloadLink: "#",
    documentType: undefined as DocumentType | undefined,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const slideOverOpen = searchParams.get("slideOver");

    if (slideOverOpen) {
      setOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [open]);

  const handleSave = async (newDocument: NewDocumentDBModel) => {
    createDocument(newDocument);
    handleClose();
  };

  const handleClose = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("slideOver");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    setOpen(false);
    router.push(`${pathname}${query}`, { scroll: false });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    onSubmit={() => {
                      if (
                        document.title &&
                        document.date &&
                        document.description &&
                        document.documentType
                      ) {
                        handleSave({
                          title: document.title,
                          date: dateToMySQLFormat(document.date),
                          description: document.description,
                          download_link: document.downloadLink,
                          document_type: document.documentType,
                        });
                      }
                    }}
                  >
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            {title}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={handleClose}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <NewRecordForm
                          setDocument={setDocument}
                          document={document}
                        />
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
