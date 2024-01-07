"use client";
import { useState } from "react";
import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/solid";
import MsgReader from "@kenjiuno/msgreader";
import cx from "classnames";
import { NewDocument } from "@/lib/types";

export default function FileUplaod({
  inputFileRef,
  document,
  setDocument,
  setFileUploaded,
}: {
  inputFileRef: React.RefObject<HTMLInputElement>;
  document: NewDocument;
  setDocument: (value: NewDocument) => void;
  setFileUploaded: (value: boolean) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const dragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const dragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const dragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const resetFileInput = () => {
    setFile(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const handleMsgFile = (file: File) => {
    const reader = new FileReader();
    const fileType = file.name.split(".").pop() || "unknown";
    reader.onload = function (e) {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        const arrayBuffer = e.target.result;
        const msgFile = new MsgReader(arrayBuffer);
        const msgData = msgFile.getFileData();
        if (!msgData.error) {
          const headers = msgData.headers;
          if (headers) {
            const dateHeader = headers.match(/Date: (.*)/);
            if (dateHeader && dateHeader[1]) {
              const dateStr = dateHeader[1];
              const dateObj = new Date(dateStr);
              setDocument({
                ...document,
                date: dateObj,
                title: file.name,
                description: msgData.subject || "",
                documentType: fileType,
              });
            }
          } else {
            setDocument({
              ...document,
              description: msgData.subject || "",
              title: file.name,
              documentType: fileType,
            });
          }
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const fileInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileUploaded(true);
      const file = files[0];
      const fileType = file.name.split(".").pop() || "unknown";
      setFile(file);
      if (file.name.endsWith(".msg")) {
        handleMsgFile(file);
      } else {
        setDocument({
          ...document,
          title: file.name,
          documentType: fileType,
        });
      }
    }
  };

  const fileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
      const file = files[0];
      setFileUploaded(true);
      setFile(file);
      if (file.name.endsWith(".msg")) {
        handleMsgFile(file);
      } else {
        const fileType = file.name.split(".").pop() || "unknown";
        setDocument({
          ...document,
          title: file.name,
          documentType: fileType,
        });
      }
    }
  };

  return (
    <>
      <div
        className="mt-2 sm:col-span-2 sm:mt-0"
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
      >
        <div
          className={cx(
            "flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:bg-gray-50",
            dragging ? "bg-gray-50" : ""
          )}
        >
          <div className="text-center">
            <DocumentIcon
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />

            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Upload a file</span>
                <input
                  ref={inputFileRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={fileInputChanged}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
          </div>
        </div>
      </div>
      {file && (
        <div className="bg-gray-100 p-4 rounded-lg inline-block mt-4">
          <div className="flex gap-4 items-center">
            <DocumentIcon
              className="h-6 w-6 text-gray-300"
              aria-hidden="true"
            />
            <p className="text-gray-500">{file.name}</p>
            <button
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={resetFileInput}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
