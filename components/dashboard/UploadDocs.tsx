import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProgressSteps, {
  NextStepButton,
  PreviousStepButton,
} from "../general/ProgressSteps";
import FileUploadShow from "../general/FileUploadShow";
import { useProgressStore } from "@/hooks/useModelStore";
import { OutputTypes } from "@/constants/FilesTypes";

const UploadDocs = () => {
  const { outputType, setOutputType, files } = useProgressStore();
  const isInputChosen = files.length > 0;
  const isOutputChosen = outputType !== "";

  return (
    <>
      <ProgressSteps />
      <div>
        <h1 className="text-3xl font-bold text-neutral-700">
          Upload your docs
        </h1>
        <div className="flex flex-col w-full gap-7">
          <FileUploadShow />
          <div className="w-full flex flex-col gap-5">
            <h1 className="text-3xl font-bold text-neutral-700">
              Choose Output
            </h1>
            <Select
              onValueChange={(value: string) => setOutputType(value)}
              value={outputType}
            >
              <SelectTrigger className="border border-neutral-500">
                <SelectValue placeholder="Select output type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Output type</SelectLabel>
                  {OutputTypes.map((type, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={type.name}
                        disabled={type.disabled}
                      >
                        {type.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end mt-4">
            <NextStepButton
              isInputChosen={isInputChosen}
              isOutputChosen={isOutputChosen}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadDocs;
