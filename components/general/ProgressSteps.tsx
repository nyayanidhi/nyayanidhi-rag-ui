import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { useProgressStore } from "@/hooks/useModelStore";
// @ts-ignore
import { MoveLeft, MoveRight } from "lucide-react";
import { uploadApiFunction } from "@/lib/apiFunctions";

const ProgressSteps = () => {
  const { bears } = useProgressStore();

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className={`${bears === 0 && "font-bold"}`}>
              Upload
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={`${bears === 25 && "font-bold"}`}>
              Select Files Interactive
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={`${bears === 75 && "font-bold"}`}>
              AI Interaction
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={`${bears === 100 && "font-bold"}`}>
              Output
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Progress value={bears} />
      <WarningMessages />
    </div>
  );
};

const WarningMessages = () => {
  const { bears, files, outputType } = useProgressStore();
  const isAnyOptionEmpty = files.some((file) => file.option === "");

  const renderNote = (message: string) => (
    <div
      className="text-amber-500 font-semibold mt-5 w-full border p-3 rounded-md bg-yellow-100"
      key={message}
    >
      Note: {message}
    </div>
  );

  const conditions = [
    {
      condition: files.length === 0,
      message: "Select files before moving to next step",
    },
    {
      condition: isAnyOptionEmpty,
      message: "Select files types before moving to next step",
    },
    {
      condition: outputType === "",
      message: "Select output type before moving to next step",
    },
  ];

  return (
    <div className="flex flex-col">
      {bears === 25 &&
        conditions.map(({ condition, message }) =>
          condition ? renderNote(message) : null
        )}
    </div>
  );
};

export const PreviousStepButton = () => {
  const { bears, decrease } = useProgressStore();

  return (
    <Button
      disabled={bears === 50 || bears === 100 || bears === 75 || bears === 0}
      onClick={() => decrease(25)}
      className="text-white px-4 py-2 rounded-md flex gap-3"
    >
      <MoveLeft size={24} /> Previous Step
    </Button>
  );
};

export const NextStepButton = ({
  isInputChosen,
  isOutputChosen,
}: {
  isInputChosen?: boolean;
  isOutputChosen?: boolean;
}) => {
  const { bears, files, loading, setLoading, outputType, increase, iFiles } =
    useProgressStore();
  const { toast } = useToast();

  const doIncrease = async () => {
    setLoading(true);
    if (bears === 25) {
      const resp = await uploadApiFunction(files, outputType, iFiles);
      if (!resp.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Oops! Something went wrong",
        });
        localStorage.clear();
        setLoading(false);
        return;
      }
      if (resp.next_route === "/output") {
        setLoading(false);
        increase(75);
        return;
      } else {
        setLoading(false);
        increase(50);
        return;
      }
    }
    setLoading(false);
    increase(25);
  };

  const isFirstStep = bears === 0;
  const isDisabled = isFirstStep
    ? !isInputChosen || !isOutputChosen || loading
    : loading || bears === 100;

  return (
    <Button
      disabled={isDisabled}
      onClick={doIncrease}
      className={`px-4 py-2 rounded-md flex gap-3 ${
        isDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "text-white hover:bg-gray-700"
      }`}
    >
      Next Step <MoveRight size={25} />
    </Button>
  );
};

export default ProgressSteps;
