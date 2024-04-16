"use client";

import { Fragment, useState, useEffect, useRef, use } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import NewDocumentForm from "@/components/NewDocumentForm";
import createDocument from "@/lib/createDocument";
import updateDocument from "@/lib/updateDocument";
import { NewDocument, Document, Tag } from "@/lib/types";
import { Button } from "@tremor/react";
import { User } from "@prisma/client";

export default function SlideOver({
  documents,
  timelineId,
  user,
}: {
  timelineId: string;
  user: User;
  documents: Document[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<any>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const nullDocument: NewDocument = {
    title: "",
    description: "",
    blobName: "",
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
    tags: [],
  };

  const id = useSearchParams().get("id");
  const [document, setDocument] = useState<NewDocument>(nullDocument);
  const [tagsToConnectOrCreate, setTagsToConnectOrCreate] = useState<Tag[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (id) {
      const document = documents.find((document) => document.id === id);
      if (document) {
        setDocument({
          ...document,
          createdBy: { connect: { id: user.id } },
          timeline: { connect: { id: timelineId } },
        });
        setTagsToConnectOrCreate(document.tags);
        setOpen(true);
      }
    }
  }, [id, documents, user.id, timelineId]);

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

    if (id) {
      const tagsToDisconnect = document.tags.filter(
        (tag) => !tagsToConnectOrCreate.some((t) => t.id === tag.id)
      );
      await updateDocument(id, {
        title: newDocument.title,
        description: newDocument.description,
        date: newDocument.date,
        tags: {
          disconnect: tagsToDisconnect.map((tag) => ({ id: tag.id })),
          connectOrCreate: tagsToConnectOrCreate.map((tag) => ({
            where: { id: tag.id },
            create: tag,
          })),
        },
      });
    } else {
      if (!inputFileRef.current?.files) {
        return;
      }
      const file = inputFileRef.current.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });

      const {
        body: { blobName },
      } = await response.json();

      await createDocument({
        ...newDocument,
        blobName,
        tags: {
          connectOrCreate: tagsToConnectOrCreate.map((tag) => ({
            where: { id: tag.id },
            create: tag,
          })),
        },
      });
    }

    setLoading(false);

    setDocument(nullDocument);
    router.refresh();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("slideOver");
    current.delete("id");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    setDocument(nullDocument);
    setTagsToConnectOrCreate([]);
    setOpen(false);
    router.push(`${pathname}${query}`, { scroll: false });
  };

  const handleClose = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("slideOver");
    current.delete("id");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    setDocument(nullDocument);
    setTagsToConnectOrCreate([]);
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
                      if (document.date) {
                        const date = new Date(document.date);
                        const adjustedDate = new Date(
                          Date.UTC(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                          )
                        );
                        const isoString = adjustedDate.toISOString();

                        handleSave({
                          title: document.title,
                          date: isoString,
                          description: document.description,
                          documentType: document.documentType,
                          blobName: document.blobName,
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
                            {id ? "Edit Document" : "New Document"}
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
                          isEdit={!!id}
                          inputFileRef={inputFileRef}
                          setFileUploaded={setFileUploaded}
                          setDocument={setDocument}
                          document={document}
                          tagsToConnectOrCreate={tagsToConnectOrCreate}
                          setTagsToConnectOrCreate={setTagsToConnectOrCreate}
                          projectId={timelineId}
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
                          (!id && !document.documentType) ||
                          (!id && !fileUploaded)
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
