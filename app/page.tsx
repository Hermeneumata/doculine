import { Card, Title } from "@tremor/react";
import Timeline from "@/components/Timeline";
import Search from "@/components/Search";
import { queryBuilder } from "@/lib/planetscale";
import { PlusIcon } from "@heroicons/react/20/solid";
import DatePicker from "@/components/DatePicker";
import { timestampToMySQLFormat } from "@/lib/utils";
import Link from "next/link";
import SlideOver from "@/components/SlideOver";
import NewRecordForm from "@/components/NewRecordForm";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string; startDate: string; endDate: string };
}) {
  const search = searchParams.q ?? "";
  const startDate = searchParams.startDate ?? "";
  const endDate = searchParams.endDate ?? "";
  let query = queryBuilder
    .selectFrom("documents")
    .select([
      "id",
      "title",
      "date",
      "description",
      "download_link",
      "document_type",
    ])
    .where("title", "like", `%${search}%`);

  if (startDate) {
    query = query.where("date", ">=", timestampToMySQLFormat(startDate));
  }

  if (endDate) {
    query = query.where("date", "<=", timestampToMySQLFormat(endDate));
  }

  const documents = await query.orderBy("date", "desc").execute();
  const mappedDocuments = documents.map((document) => ({
    ...document,
    downloadLink: document.download_link,
    documentType: document.document_type,
  }));

  return (
    <>
      <SlideOver title="Add new record">
        <NewRecordForm />
      </SlideOver>
      <Title>Document timeline</Title>
      <div className="flex justify-end">
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
        <Timeline documents={mappedDocuments} />
      </Card>
    </>
  );
}
