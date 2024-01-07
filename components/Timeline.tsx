import { Document } from "@/lib/types";
import { getIconForDocumentType } from "@/lib/utils";
import DocumentRemoveButton from "@/components/DocumentRemoveButton";
import Link from "next/link";
import DownloadDocumentButton from "./DownloadDocumentButton";

type TimelineRecordProps = Document & {
  latest: boolean;
  deleteEnabled: boolean;
};

function TimelineRecord({
  id,
  title,
  date,
  description,
  blobName,
  documentType,
  deleteEnabled,
  createdBy,
}: TimelineRecordProps) {
  const Icon = getIconForDocumentType(documentType);

  return (
    <li className="mb-10 ml-6 group">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
        <Icon className="w-3 h-3 text-blue-800" />
      </span>
      <div className="flex justify-between w-full relative">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
        {deleteEnabled && (
          <div className="pt-1 pl-4 transition-opacity duration-200 group-hover:opacity-100 opacity-30">
            <DocumentRemoveButton id={id} />
          </div>
        )}
      </div>
      <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
        {new Date(date).toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}
      </time>
      <p className="mb-4 text-xs font-normal text-gray-500">
        Added by{" "}
        <Link
          className=" text-blue-500 hover:text-blue-400 hover:underline"
          href={`mailto:${createdBy.email}`}
        >
          {createdBy.name}
        </Link>
      </p>
      <p className="mb-4 text-base font-normal text-gray-500">{description}</p>
      <DownloadDocumentButton blobName={blobName} documentType={documentType} />
    </li>
  );
}

export default async function Timeline({
  documents,
  projectOwnerId,
  userId,
}: {
  documents: Document[];
  projectOwnerId: string;
  userId: string;
}) {
  if (!documents.length) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-500">No documents found.</p>
      </div>
    );
  }
  const latestDocumentIndex = documents.reduce(
    (prevIndex, currentDocument, currentIndex) => {
      return new Date(documents[prevIndex].date) >
        new Date(currentDocument.date)
        ? prevIndex
        : currentIndex;
    },
    0
  );

  return (
    <ol className="relative border-l border-gray-200">
      {documents.map((document, index) => (
        <TimelineRecord
          deleteEnabled={
            projectOwnerId === userId || document.createdById === userId
          }
          key={`${document.id}`}
          latest={index === latestDocumentIndex}
          {...document}
        />
      ))}
    </ol>
  );
}
