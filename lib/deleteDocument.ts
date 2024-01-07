"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import AzureBlobStorage from "@/lib/storage";

export default async function removeDocument(id: string): Promise<void> {
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    throw new Error("Document not found");
  }

  const blobName = document.blobName;
  if (blobName) {
    await AzureBlobStorage.deleteFile(blobName);
  }
  await prisma.document.delete({ where: { id } });
  revalidatePath("/", "layout");
}
