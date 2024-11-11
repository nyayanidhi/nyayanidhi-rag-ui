import { useRef } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useProgressStore } from "@/hooks/useModelStore";
import { InputFileTypes } from "@/constants/FilesTypes";

const FileUploadShow = () => {
  const { files, setFiles } = useProgressStore(); // Use your store's state and methods

  const fileInputRef = useRef(null);

  const handleFileChange = (event: any) => {
    if (event.target.files.length === 0) return;
    const fileWithOption = Array.from(event.target.files).map((file: any) => ({
      file,
      option: "",
    }));

    // Add the new files to the existing files and filter if it already exists and replace if it does
    const newFiles = [...files, ...fileWithOption].filter(
      (file, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.file.name === file.file.name && t.file.size === file.file.size
        )
    );

    setFiles(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_: any, i: any) => i !== index)); // Remove the file at the given index
  };

  const handleSelectChange = (value: string, index: number) => {
    const newFileObjects = [...files];
    newFileObjects[index].option = value;
    setFiles(newFileObjects);
  };

  return (
    <>
      <div className="mt-7 items-center gap-1.5">
        <Label htmlFor="picture">Docs</Label>
        <div className="relative mt-2">
          <div className="w-full border border-zinc-500 rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none">
            <Input
              onChange={handleFileChange}
              ref={fileInputRef}
              className="sr-only"
              type="file"
              multiple
              accept=".pdf"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 cursor-pointer m-1"
            >
              Choose Files
            </label>
            <span className="ml-3 text-sm text-gray-500" id="file-name">
              No file chosen
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length > 0 ? (
              files.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{file.file?.name}</TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(e: any) => handleSelectChange(e, index)}
                      value={file.option}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>File type</SelectLabel>
                          {InputFileTypes.map((type, index) => {
                            return (
                              <SelectItem key={index} value={type}>
                                {type}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleRemoveFile(index)}
                      className="text-white bg-rose-500"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No docs to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default FileUploadShow;
