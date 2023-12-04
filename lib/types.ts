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
  id: string;
  title: string;
  date: Date;
  description: string;
  downloadLink: string;
  documentType: string;
}
