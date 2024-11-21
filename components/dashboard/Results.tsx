import { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import Chat from "./Chat"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";

type CaseDetail = {
  case_name: string;
  scr_citation: string;
  neutral_citation: string;
  digi_url: string;
  qol_text: string
};

type ResultsProps = {
  cases: CaseDetail[];
  onBack: () => void;
  queryId: string;
};

const Results = ({ cases, queryId, onBack }: ResultsProps) => {
  const [activeChatCase, setActiveChatCase] = useState<CaseDetail | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseDetail | null>(null);

  const handleViewDocument = (caseItem: CaseDetail) => {
    setSelectedCase(caseItem);
    setShowSummary(true);
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <div className={`overflow-y-auto ${activeChatCase ? 'w-1/2' : 'w-full'} p-6`}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Search Results</h2>
          <Button onClick={onBack} variant="outline">Back to Search</Button>
        </div>
        
        <div className="space-y-4">
          {cases.map((caseItem, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <a 
                href={caseItem.digi_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg mb-2 text-blue-600 hover:underline"
              >
                {caseItem.case_name}
              </a>
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <p className="text-gray-600">SCR Citation:</p>
                  <p>{caseItem.scr_citation}</p>
                </div>
                <div>
                  <p className="text-gray-600">Neutral Citation:</p>
                  <p>{caseItem.neutral_citation}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDocument(caseItem)}
                  className="text-blue-600 hover:underline"
                >
                  View Summary →
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveChatCase(caseItem)}
                  className="text-blue-600"
                  disabled={activeChatCase !== null && activeChatCase.neutral_citation !== caseItem.neutral_citation}
                >
                  {activeChatCase?.neutral_citation === caseItem.neutral_citation ? 'Chatting...' : 'Chat'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeChatCase && (
        <div className="w-1/2 border-l">
          <Chat
            digi_url={activeChatCase.digi_url}
            neutral_citation={activeChatCase.neutral_citation}
            query_id={queryId}
            onClose={() => setActiveChatCase(null)}
            caseName={activeChatCase.case_name}
          />
        </div>
      )}

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Summary of the Case</DialogTitle>
            <DialogDescription className="text-lg font-medium">
              {selectedCase?.case_name}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto mt-4 pr-4 text-justify">
            <p className="whitespace-pre-wrap leading-relaxed">
              {selectedCase?.qol_text}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;