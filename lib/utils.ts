import {
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

export function getIconForDocumentType(documentType: string) {
  switch (documentType) {
    case "document":
      return DocumentIcon;
    case "image":
      return PhotoIcon;
    case "video":
      return FilmIcon;
    case "audio":
      return MusicalNoteIcon;
    case "archive":
      return ArchiveBoxIcon;
    default:
      return DocumentIcon;
  }
}
