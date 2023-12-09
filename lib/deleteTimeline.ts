"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function removeTimeline(id: string): Promise<void> {
  await prisma.timeline.delete({ where: { id } });
  revalidatePath("/");
}
