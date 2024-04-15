"use server";
import prisma from "@/lib/db";

export default async function getProjectTags(projectId: string) {
  const documents = await prisma.document.findMany({
    where: {
      timelineId: projectId,
    },
    select: {
      title: true,
      tags: {
        select: {
          id: true,
          name: true,
        },
        distinct: ["id"],
      },
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  });
  const flatTags = documents.flatMap((document) => document.tags.reverse());

  const uniqueTags = Array.from(
    flatTags
      .reduce((map, tag) => {
        return map.set(tag.id, tag);
      }, new Map())
      .values()
  );

  return uniqueTags;
}
