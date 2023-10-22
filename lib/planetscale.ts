import "server-only";
import { Generated, Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { DocumentType } from "@/lib/types";

export interface NewDocumentDBModel {
  title: string;
  date: string;
  description: string;
  download_link?: string;
  document_type: DocumentType;
}
export interface DocumentDBModel extends NewDocumentDBModel {
  id?: Generated<number>;
}

interface Database {
  documents: DocumentDBModel;
  // https://github.com/nextauthjs/next-auth/issues/4922
}

export const queryBuilder = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
  }),
});
