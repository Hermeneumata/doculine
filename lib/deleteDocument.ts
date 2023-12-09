"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function removeDocument(id: string): Promise<void> {
  await prisma.document.delete({ where: { id } });
  revalidatePath("/", "layout");
}
