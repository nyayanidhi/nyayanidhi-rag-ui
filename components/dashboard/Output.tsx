import { useEffect, useState } from "react";
import ProgressSteps from "../general/ProgressSteps";
import { sendMailApi } from "@/lib/apiFunctions";

const Output = () => {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const sendMail = async () => {
      try {
        const output: any = sendMailApi();
      } catch (error) {
        setError("true");
        console.log(error);
      }
    };
    sendMail();
  }, []);

  if (error) {
    return (
      <>
        <ProgressSteps />
        <div>
          <h1 className="text-3xl font-bold text-neutral-700">Output</h1>
          <div className="flex flex-col w-full gap-7 border rounded-md p-7 mt-3 text-center">
            <h1 className="text-xl font-bold text-yellow-500">
              Your output might take sometime, if not received please contact us
            </h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProgressSteps />
      <div>
        <h1 className="text-3xl font-bold text-neutral-700">Output</h1>
        <div className="flex flex-col w-full gap-7 border rounded-md p-7 mt-3 text-center">
          Your output will be set over to your mail
        </div>
      </div>
    </>
  );
};

export default Output;
