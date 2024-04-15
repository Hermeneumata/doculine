import prisma from "@/lib/db";
import { Title, Card } from "@tremor/react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import Timeline from "@/components/Timeline";
import { getServerSession } from "next-auth/next";
import Search from "@/components/Search";
import DatePicker from "@/components/DatePicker";
import DocumentSlideOver from "@/components/DocumentSlideOver";
import ResetButton from "@/components/ResetButton";
import DocumentStats from "@/components/DocumentStats";
import TagSearch from "@/components/TagSearch";
import getTags from "@/lib/getTags";
import getProjectTags from "@/lib/getProjectTags";
import DownloadZipButton from "@/components/DownloadZipButton";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: {
    q: string;
    startDate: string;
    endDate: string;
    type: string;
    tags: string;
  };
}) {
  const session = await getServerSession();
  if (!session || !session?.user || !session?.user?.email) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });
  if (!user) {
    return notFound();
  }

  const { projectId } = params;
  const search = searchParams.q ?? "";

  const startDate =
    searchParams.startDate && !isNaN(Number(searchParams.startDate))
      ? new Date(Number(searchParams.startDate))
      : "";
  const endDate =
    searchParams.endDate && !isNaN(Number(searchParams.endDate))
      ? new Date(Number(searchParams.endDate))
      : "";
  const type = searchParams.type ?? "";
  const tags = searchParams.tags ? searchParams.tags.split(",") : [];

  const project = await prisma.timeline.findUnique({
    where: {
      id: params.projectId,
    },
    include: {
      documents: {
        include: {
          createdBy: true,
          tags: true,
        },
        where: {
          title: {
            contains: search,
          },
          ...(startDate && endDate
            ? {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }
            : {}),
          ...(type
            ? {
                documentType: {
                  equals: type,
                },
              }
            : {}),
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  project.documents = project.documents.filter((document) =>
    tags.every((tag) =>
      document.tags.some((documentTag) => documentTag.id === tag)
    )
  );

  const allTags = await getTags();

  const projectTags = await getProjectTags(projectId);

  const isFiltered = search || startDate || endDate || type;

  return (
    <>
      <DocumentSlideOver
        documents={project.documents}
        user={user}
        timelineId={projectId}
      />

      <div className="flex justify-between items-center">
        <Title className="flex-grow">{project.name}</Title>
        <div className="flex gap-2">
          <DownloadZipButton
            blobNames={project.documents.map((doc) => doc.blobName)}
            projectName={project.name}
          />
          <Link
            href={`/projects/${projectId}?${new URLSearchParams({
              ...searchParams,
              slideOver: "true",
            }).toString()}`}
            className="rounded-md items-center flex bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="block h-6 w-6" aria-hidden="true" />
            New Document
          </Link>
        </div>
      </div>

      <DocumentStats documents={project.documents} projectId={projectId} />
      <div className="flex flex-col md:flex-row gap-2 mt-4">
        <Search />
        <DatePicker />
        <TagSearch tags={projectTags} />
        {isFiltered && <ResetButton />}
      </div>
      <Card className="mt-6">
        <Timeline
          projectId={projectId}
          searchParams={searchParams}
          userId={user.id}
          documents={project.documents}
          projectOwnerId={project.ownerId}
        />
      </Card>
    </>
  );
}
