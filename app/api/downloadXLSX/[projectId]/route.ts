import * as XLSX from "xlsx";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Document } from "@/lib/types";

async function fetchDocuments(projectId: string) {
  const documents = await prisma.document.findMany({
    where: {
      timelineId: projectId,
    },
    include: {
      createdBy: true,
      tags: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  return documents;
}

async function fetchProjectName(projectId: string) {
  const project = await prisma.timeline.findUnique({
    where: {
      id: projectId,
    },
  });
  return project?.name || "";
}

function convertToSpreadsheet(data: Document[], projectName: string) {
  const mappedData = data.map((document) => ({
    name: document.title,
    date: document.date,
    description: document.description,
    type: document.documentType,
    tags: document.tags.map((tag) => tag.name).join(", "),
  }));
  const worksheet = XLSX.utils.json_to_sheet(mappedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, projectName);
  return workbook;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse | Response> {
  const projectId = params.projectId;
  const documents = await fetchDocuments(projectId);
  const projectName = await fetchProjectName(projectId);
  const workbook = convertToSpreadsheet(documents, projectName);
  const buffer = XLSX.write(workbook, { type: "buffer" });

  return new NextResponse(buffer, {
    status: 200,
    headers: new Headers({
      "Content-Disposition": `attachment; filename=doculine-${projectName}.xlsx`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Length": buffer.size + "",
    }),
  });
}
