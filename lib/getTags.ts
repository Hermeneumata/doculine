"use server";
import prisma from "@/lib/db";

export default async function getTags() {
  const tags = await prisma.tag.findMany();
  return tags;
}
