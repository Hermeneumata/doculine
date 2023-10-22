import { Document } from "@/lib/types";
import { getIconForDocumentType } from "@/lib/utils";
import RemoveButton from "./RemoveButton";

type TimelineRecordProps = Document & {
  latest: boolean;
};

function TimelineRecord({
  id,
  title,
  date,
  description,
  downloadLink,
  documentType,
  latest,
}: TimelineRecordProps) {
  const Icon = getIconForDocumentType(documentType);
  return (
    <li className="mb-10 ml-6 group">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
        <Icon className="w-3 h-3 text-blue-800" />
      </span>
      <div className="flex justify-between w-full relative">
        <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
        <div className="pt-1 pl-4 transition-opacity duration-200 group-hover:opacity-100 opacity-0">
          <RemoveButton id={id} urlToDelete={downloadLink} />
        </div>
      </div>
      <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
        {new Date(date).toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}
      </time>
      <p className="mb-4 text-base font-normal text-gray-500">{description}</p>
      <a
        href={downloadLink}
        download
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700"
      >
        <svg
          className="w-3.5 h-3.5 mr-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
          <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        </svg>{" "}
        Download {documentType}
      </a>
    </li>
  );
}

export default async function Timeline({
  documents,
}: {
  documents: Document[];
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
          key={`${document.id}`}
          latest={index === latestDocumentIndex}
          {...document}
        />
      ))}
    </ol>
  );
}
