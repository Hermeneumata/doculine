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
