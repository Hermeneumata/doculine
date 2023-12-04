import { Card, Title } from "@tremor/react";
import Timeline from "@/components/Timeline";
import Search from "@/components/Search";
import { PlusIcon } from "@heroicons/react/20/solid";
import DatePicker from "@/components/DatePicker";
import { timestampToMySQLFormat } from "@/lib/utils";
import Link from "next/link";
import prisma from "@/lib/db";
import SlideOver from "@/components/SlideOver";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string; startDate: string; endDate: string };
}) {
  const search = searchParams.q ?? "";
  const startDate = searchParams.startDate ?? "";
  const endDate = searchParams.endDate ?? "";
  const documents = await prisma.document.findMany({
    where: {
      title: {
        contains: search,
      },
      // TODO: Filter by date range
    },
    select: {
      id: true,
      title: true,
      date: true,
      description: true,
      downloadLink: true,
      documentType: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <>
      <SlideOver title="Add new record" />

      <div className="flex justify-between items-center">
        <Title>Document timeline</Title>
        <Link
          href={`/?${new URLSearchParams({
            ...searchParams,
            slideOver: "true",
          }).toString()}`}
          className="rounded-md items-center flex bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="block h-6 w-6" aria-hidden="true" />
          Add New
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mt-4">
        <Search />
        <DatePicker />
      </div>
      <Card className="mt-6">
        <Timeline documents={documents} />
      </Card>
    </>
  );
}
