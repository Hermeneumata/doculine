"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function updateTimeline(id: string, updatedTimeline: any) {
  const timeline = await prisma.timeline.update({
    where: { id },
    data: updatedTimeline,
  });
  revalidatePath("/");
  return timeline;
}
