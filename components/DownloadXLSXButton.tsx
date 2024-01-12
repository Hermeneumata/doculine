"use client";

import { useState } from "react";
import classNames from "classnames";
import Spinner from "./Spinner";

export default function DownloadXLSXXButton({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const downloadXLSX = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/downloadXLSX/${projectId}`, {
        method: "GET",
      });

      if (res.status === 200) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "timeline.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setSuccess(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={downloadXLSX}
      className={classNames({
        "cursor-not-allowed opacity-50": loading,
      })}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
