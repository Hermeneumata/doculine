"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteTag(id: string): Promise<void> {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/");
}
