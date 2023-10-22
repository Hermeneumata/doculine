"use client";

import { TextInput, DatePicker, Select, SelectItem } from "@tremor/react";
import { getIconForDocumentType } from "@/lib/utils";
import { DocumentType } from "@/lib/types";
import FileUpload from "@/components/FileUpload";
import Label from "@/components/Label";
import TextArea from "@/components/TextArea";

export default function NewRecordForm({
  setDocument,
  document,
  inputFileRef,
  setFileUploaded,
}: {
  setDocument: any;
  document: any;
  inputFileRef: any;
  setFileUploaded: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-6">
        <Label htmlFor="title">Title</Label>
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
      <div className="sm:col-span-6">
        <Label>Document Type</Label>
        <div className="mt-2">
          <Select
            value={document.documentType}
            onValueChange={(value) =>
              setDocument({
                ...document,
                documentType: value as DocumentType,
              })
            }
          >
            <SelectItem
              value={DocumentType.Document}
              icon={getIconForDocumentType(DocumentType.Document)}
            >
              Document
            </SelectItem>
            <SelectItem
              value={DocumentType.Image}
              icon={getIconForDocumentType(DocumentType.Image)}
            >
              Picture
            </SelectItem>
            <SelectItem
              value={DocumentType.Video}
              icon={getIconForDocumentType(DocumentType.Video)}
            >
              Video
            </SelectItem>
            <SelectItem
              value={DocumentType.Audio}
              icon={getIconForDocumentType(DocumentType.Audio)}
            >
              Audio
            </SelectItem>
            <SelectItem
              value={DocumentType.Archive}
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
        <Label htmlFor="description">Attachment</Label>
        <div className="mt-2">
          <input
            name="file"
            ref={inputFileRef}
            type="file"
            onChange={() => setFileUploaded(true)}
          />
          {/* <FileUpload /> */}
        </div>
      </div>
    </div>
  );
}
