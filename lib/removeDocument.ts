"use server";
import prisma from "@/lib/db";

export default async function removeDocument(id: string): Promise<void> {
  await prisma.document.delete({ where: { id } });
}
