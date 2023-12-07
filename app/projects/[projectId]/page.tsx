import prisma from "@/lib/db";
import { Title, Text, Card } from "@tremor/react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import Timeline from "@/components/Timeline";
import { getServerSession } from "next-auth/next";
import Search from "@/components/Search";
import DatePicker from "@/components/DatePicker";
import DocumentSlideOver from "@/components/DocumentSlideOver";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { q: string; startDate: string; endDate: string };
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

  const project = await prisma.timeline.findUnique({
    where: {
      id: params.projectId,
    },
    include: {
      documents: {
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

  return (
    <>
      <DocumentSlideOver
        title="Add new record"
        user={user}
        timelineId={projectId}
      />

      <div className="flex justify-between items-center">
        <Title>{project.name}</Title>
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

      <div className="flex flex-col md:flex-row gap-2 mt-4">
        <Search />
        <DatePicker />
      </div>
      <Card className="mt-6">
        <Timeline documents={project.documents} />
      </Card>
    </>
  );
}
