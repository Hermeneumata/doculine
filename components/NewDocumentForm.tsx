"use client";

import { TextInput, DatePicker } from "@tremor/react";
import { NewDocument } from "@/lib/types";
import FileUpload from "@/components/FileUpload";
import Label from "@/components/Label";
import TextArea from "@/components/TextArea";

export default function NewDocumentForm({
  setDocument,
  document,
}: {
  setDocument: React.Dispatch<React.SetStateAction<NewDocument>>;
  document: NewDocument;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="col-span-full">
        <Label htmlFor="description">File</Label>
        <FileUpload document={document} setDocument={setDocument} />
      </div>
      <div className="sm:col-span-6">
        <Label htmlFor="title">Name</Label>
        <div className="mt-2">
          <TextInput
            id="title"
            name="title"
            value={document.title}
            onChange={(e) =>
              setDocument({ ...document, title: e.target.value })
            }
            placeholder="Title"
          />
        </div>
      </div>
      <div className="sm:col-span-6">
        <label
          htmlFor="date-picker"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Date
        </label>
        <div className="mt-2">
          <DatePicker
            id="date-picker"
            value={document.date}
            onValueChange={(value) => setDocument({ ...document, date: value })}
            placeholder="Date"
          />
        </div>
      </div>
      <div className="col-span-full">
        <Label htmlFor="description">Description</Label>
        <div className="mt-2">
          <TextArea
            id="description"
            name="description"
            rows={3}
            value={document.description}
            onChange={(e) =>
              setDocument({ ...document, description: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
