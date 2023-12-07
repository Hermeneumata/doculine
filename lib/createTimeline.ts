"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function createTimeline(newTimeline: any) {
  const timeline = await prisma.timeline.create({ data: newTimeline });
  revalidatePath("/");
  return timeline;
}
