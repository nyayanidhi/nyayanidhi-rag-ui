import { Checkbox } from "../ui/checkbox";
import ProgressSteps, {
  NextStepButton,
  PreviousStepButton,
} from "../general/ProgressSteps";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { useProgressStore } from "@/hooks/useModelStore";
import { User } from "@supabase/supabase-js";

const FileSelectInteract = () => {
  const { files, iFiles, setIFiles } = useProgressStore();

  const handleCheckChange = (
    index: number,
    checked: string | boolean,
    theFile: File | null
  ) => {
    if (checked) {
      setIFiles([...iFiles, files[index]]);
    } else {
      setIFiles(iFiles.filter((v, i) => v.file?.name !== theFile?.name));
    }
  };

  return (
    <>
      <ProgressSteps />
      <div className="flex flex-col gap-7 mt-3">
        <h1 className="text-3xl font-bold text-neutral-700">
          Choose Interaction Files
        </h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Choose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length > 0 ? (
                files.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{file.file?.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        onCheckedChange={(e) =>
                          handleCheckChange(index, e, file.file)
                        }
                      />
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
        <div className="flex justify-between mt-4">
          <PreviousStepButton />
          <NextStepButton />
        </div>
      </div>
    </>
  );
};

export default FileSelectInteract;
