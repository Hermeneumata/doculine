"use client";

import { Document } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import cx from "classnames";

export default function DocumentStats({
  documents,
  projectId,
}: {
  documents: Document[];
  projectId: string;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  return (
    <div className="flex flex-wrap text-xs">
      {Object.entries(
        documents.reduce((acc: Record<string, number>, document: Document) => {
          acc[document.documentType] = (acc[document.documentType] || 0) + 1;
          return acc;
        }, {})
      ).map(([documentType, count], index, array) => (
        <div key={documentType} className="flex items-center mr-2 mb-4">
          <Link
            href={`/projects/${projectId}?type=${documentType}`}
            className={cx(
              "flex gap-1 items-center justify-center px-4 py-2 text-xs font-medium  rounded-md",
              type === documentType
                ? "bg-gray-200 text-gray-700 cursor-default"
                : " hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            )}
          >
            {count} {documentType}
          </Link>
        </div>
      ))}
    </div>
  );
}
