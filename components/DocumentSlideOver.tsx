"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import NewDocumentForm from "@/components/NewDocumentForm";
import createDocument from "@/lib/createDocument";
import { NewDocument } from "@/lib/types";
import { Button } from "@tremor/react";
import { User } from "@prisma/client";

export default function SlideOver({
  title,
  timelineId,
  user,
}: {
  title: string;
  timelineId: string;
  user: User;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const nullDocument: NewDocument = {
    title: "",
    date: undefined as Date | undefined,
    description: "",
    downloadLink: "test",
    documentType: "",
    createdBy: {
      connect: {
        id: user.id,
      },
    },
    timeline: {
      connect: {
        id: timelineId,
      },
    },
  };

  const [document, setDocument] = useState<NewDocument>(nullDocument);

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

  const handleSave = async (newDocument: any) => {
    setLoading(true);
    await createDocument(newDocument);

    setLoading(false);

    setDocument(nullDocument);
    router.refresh();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("slideOver");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    setOpen(false);
    router.push(`${pathname}${query}`, { scroll: false });
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        document.title &&
                        document.date &&
                        document.description &&
                        document.documentType
                      ) {
                        handleSave({
                          title: document.title,
                          date: document.date.toISOString(),
                          description: document.description,
                          documentType: document.documentType,
                          downloadLink: document.downloadLink,
                          createdBy: document.createdBy,
                          timeline: document.timeline,
                        });
                      }
                    }}
                  >
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll overflow-x-hidden py-6">
                      {/* fix overflow-x-hidden */}
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
                        <NewDocumentForm
                          inputFileRef={inputFileRef}
                          setDocument={setDocument}
                          document={document}
                          setFileUploaded={setFileUploaded}
                        />
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-2 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>

                      <Button
                        type="submit"
                        loading={loading}
                        disabled={
                          !document.title ||
                          !document.date ||
                          !document.description ||
                          !document.documentType ||
                          !fileUploaded
                        }
                      >
                        Save
                      </Button>
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
