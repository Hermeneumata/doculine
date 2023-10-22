"use server";

import { NewDocumentDBModel, queryBuilder } from "@/lib/planetscale";

export default async function createDocument(newDocument: NewDocumentDBModel) {
  const response = await queryBuilder
    .insertInto("documents")
    .values(newDocument)
    .execute();
}
