"use client";

import { useState } from "react";
import classNames from "classnames";
import Spinner from "./Spinner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document } from "@/lib/types";

function generateXLSX(data: Document[]) {
  const mappedData = data.map((document: Document) => ({
    name: document.title,
    date: document.date,
    description: document.description,
    type: document.documentType,
    tags: document.tags.map((tag) => tag.name).join(", "),
  }));

  const worksheet = XLSX.utils.json_to_sheet(mappedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  saveAs(blob, "output.xlsx");
}

/* helper function to convert a string to an ArrayBuffer */
function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default function DownloadXLSXXButton({
  documents,
  children,
}: {
  documents: Document[];
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      generateXLSX(documents);
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={classNames({
        "cursor-not-allowed opacity-50": loading,
      })}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
