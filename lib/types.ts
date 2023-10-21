export enum DocumentType {
  Document = "document",
  Image = "image",
  Video = "video",
  Audio = "audio",
  Archive = "archive",
}

export type User = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
};

export interface Document {
  id: number;
  title: string;
  date: string;
  description: string;
  downloadLink: string;
  documentType: DocumentType;
}
