"use client";

import { useState } from "react";
import { TextInput, DatePicker, Select, SelectItem } from "@tremor/react";
import { getIconForDocumentType } from "@/lib/utils";
import { Document, DocumentType } from "@/lib/types";
import FileUpload from "@/components/FileUpload";
import Label from "@/components/Label";
import Link from "next/link";
import TextArea from "@/components/TextArea";

export default function NewRecordForm() {
  const [document, setDocument] = useState<Document>({
    id: 0,
    title: "",
    date: "",
    description: "",
    downloadLink: "#",
    documentType: DocumentType.Document,
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocument({ ...document, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={() => {}}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <Label htmlFor="title">Title</Label>
          <div className="mt-2">
            <TextInput
              id="title"
              value={document.title}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              placeholder="Date"
            />
          </div>
        </div>
        <div className="sm:col-span-6">
          <Label>Document Type</Label>
          <div className="mt-2">
            <Select>
              <SelectItem
                value="document"
                icon={getIconForDocumentType(DocumentType.Document)}
              >
                Document
              </SelectItem>
              <SelectItem
                value="image"
                icon={getIconForDocumentType(DocumentType.Image)}
              >
                Picture
              </SelectItem>
              <SelectItem
                value="video"
                icon={getIconForDocumentType(DocumentType.Video)}
              >
                Video
              </SelectItem>
              <SelectItem
                value="audio"
                icon={getIconForDocumentType(DocumentType.Audio)}
              >
                Audio
              </SelectItem>
              <SelectItem
                value="audio"
                icon={getIconForDocumentType(DocumentType.Archive)}
              >
                Archive
              </SelectItem>
            </Select>
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="description">Description</Label>
          <div className="mt-2">
            <TextArea />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="description">Attachment</Label>
          <div className="mt-2">
            <FileUpload />
          </div>
        </div>
      </div>
    </form>
  );
}
