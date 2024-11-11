"use client";

import { useProgressStore } from "@/hooks/useModelStore";
import UploadDocs from "./UploadDocs";
import FileSelectInteract from "./FileSelectInteract";
import Output from "./Output";
import ChatOutput from "./ChatOutput";

const Dashboard = () => {
  const { bears } = useProgressStore();

  return (
    <div className="container mt-16 flex flex-col gap-3">
      {bears === 0 && <UploadDocs />}
      {bears === 25 && <FileSelectInteract />}
      {bears === 75 && <ChatOutput />}
      {bears === 100 && <Output />}
    </div>
  );
};

export default Dashboard;
