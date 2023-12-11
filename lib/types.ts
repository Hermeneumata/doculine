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
  createdBy: User;
  timelineId: string;
  createdById: string;
}

export type NewDocument = {
  title: string;
  date: Date | undefined;
  description: string;
  downloadLink: string;
  documentType: string;
  createdBy: {
    connect: {
      id: string;
    };
  };
  timeline: {
    connect: {
      id: string;
    };
  };
};

export interface Timeline {
  id: string;
  name: string;
  resourcePath: string;
  owner: User;
  documents: Document[];
}

export type NewTimeline = {
  id?: string;
  name: string;
  resourcePath: string;
  owner: {
    connect: {
      id: string | number;
    };
  };
};
