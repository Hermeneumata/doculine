"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface NewDocumentDBModel {
  title: string;
  date: string;
  description: string;
  downloadLink: string;
  documentType: string;
}

export default async function createDocument(newDocument: any) {
  const document = await prisma.document.create({ data: newDocument });
  revalidatePath(`/timeline/${document.timelineId}`);
  return document;
}
