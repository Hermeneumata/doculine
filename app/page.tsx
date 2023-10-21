import { Card, Title, Text } from "@tremor/react";
import Timeline from "@/components/Timeline";
import Search from "@/components/Search";
import { queryBuilder } from "@/lib/planetscale";
import DatePicker from "@/components/DatePicker";
import { timestampToMySQLFormat } from "@/lib/utils";

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
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row gap-2 mt-4">
        <Search />
        <DatePicker />
      </div>
      <Card className="mt-6">
        <Timeline documents={mappedDocuments} />
      </Card>
    </main>
  );
}
