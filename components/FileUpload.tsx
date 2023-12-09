"use client";
import { useState } from "react";
import { DocumentIcon, XMarkIcon } from "@heroicons/react/24/solid";
import MsgReader from "@kenjiuno/msgreader";
import cx from "classnames";
import { NewDocument } from "@/lib/types";

export default function FileUplaod({
  document,
  setDocument,
}: {
  document: NewDocument;
  setDocument: (value: NewDocument) => void;
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

  const handleMsgFile = (file: File) => {
    if (file.name.endsWith(".msg")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target && e.target.result instanceof ArrayBuffer) {
          const arrayBuffer = e.target.result;
          const msgFile = new MsgReader(arrayBuffer);
          const msgData = msgFile.getFileData();
          if (!msgData.error) {
            const headers = msgData.headers;
            if (headers) {
              const dateHeader = headers.match(/Date: (.*)/);
              console.info("header: ", dateHeader);
              if (dateHeader && dateHeader[1]) {
                const dateStr = dateHeader[1];
                const dateObj = new Date(dateStr);
                setDocument({ ...document, date: dateObj, title: file.name });
              }
            }
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const fileInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      handleMsgFile(file);
    }
  };

  const fileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];
      setFile(file);
      handleMsgFile(file);
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
            "flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10",
            dragging ? "bg-gray-100" : ""
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
              onClick={() => setFile(null)}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
