export enum DocumentType {
  Document = "document",
  Image = "image",
  Video = "video",
  Audio = "audio",
  Archive = "archive",
}

export type User = {
  id: string;
  azureId: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface Document {
  id: string;
  title: string;
  date: Date;
  description: string;
  downloadLink: string;
  documentType: string;
  createdAt: Date;
  updatedAt: Date;
  timelineId: string;
  createdById: string;
}

export interface Timeline {
  id: string;
  name: string;
  owner: User;
  documents: Document[];
}
