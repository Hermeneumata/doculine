"use server";

import { queryBuilder } from "@/lib/planetscale";

export default async function removeDocument(id: number): Promise<void> {
  await queryBuilder.deleteFrom("documents").where("id", "=", id).execute();
}
