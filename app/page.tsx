import { Card, Title, Text } from "@tremor/react";
import Timeline from "@/components/Timeline";
import Search from "@/components/Search";
import { queryBuilder } from "@/lib/planetscale";
import DatePicker from "@/components/DatePicker";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? "";
  const documents = await queryBuilder
    .selectFrom("documents")
    .select([
      "id",
      "title",
      "date",
      "description",
      "download_link",
      "document_type",
    ])
    .where("title", "like", `%${search}%`)
    .execute();
  const mappedDocuments = documents.map((document) => ({
    ...document,
    downloadLink: document.download_link,
    documentType: document.document_type,
  }));

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Timeline</Title>
      <Text>A timeline of documents</Text>

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
