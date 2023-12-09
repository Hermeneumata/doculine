"use client";

import { TextInput, DatePicker, Select, SelectItem } from "@tremor/react";
import { getIconForDocumentType } from "@/lib/utils";
import { DocumentType, NewDocument } from "@/lib/types";
import FileUpload from "@/components/FileUpload";
import Label from "@/components/Label";
import TextArea from "@/components/TextArea";

export default function NewDocumentForm({
  setDocument,
  document,
  inputFileRef,
  setFileUploaded,
}: {
  setDocument: React.Dispatch<React.SetStateAction<NewDocument>>;
  document: NewDocument;
  inputFileRef: any;
  setFileUploaded: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
      <div className="col-span-full">
        <Label htmlFor="description">File</Label>
        <FileUpload document={document} setDocument={setDocument} />
      </div>
    </div>
  );
}
