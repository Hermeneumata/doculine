"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function updateDocument(id: string, updatedDocument: any) {
  const document = await prisma.document.update({
    where: { id },
    data: updatedDocument,
  });
  revalidatePath(`/timeline/${document.timelineId}`);
  return document;
}
