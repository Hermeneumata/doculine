"use server";
import prisma from "@/lib/db";

export interface NewDocumentDBModel {
  title: string;
  date: string;
  description: string;
  downloadLink: string;
  documentType: string;
}

export default async function createDocument(newDocument: NewDocumentDBModel) {
  const document = await prisma.document.create({ data: newDocument });
  return document;
}
