import {
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { DocumentType } from "@/lib/types";

export function getIconForDocumentType(documentType: DocumentType) {
  switch (documentType) {
    case DocumentType.Document:
      return DocumentIcon;
    case DocumentType.Picture:
      return PhotoIcon;
    case DocumentType.Video:
      return FilmIcon;
    case DocumentType.Audio:
      return MusicalNoteIcon;
    case DocumentType.Archive:
      return ArchiveBoxIcon;
    default:
      return DocumentIcon;
  }
}

export function timestampToMySQLFormat(timestamp: number | string): string {
  const date = new Date(Number(timestamp));
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
