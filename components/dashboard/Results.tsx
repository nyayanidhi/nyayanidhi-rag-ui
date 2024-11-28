import { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import Chat from "./Chat"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
import { Checkbox } from "../ui/checkbox";

type CaseDetail = {
  case_name: string;
  scr_citation: string;
  neutral_citation: string;
  digi_url: string;
  qol_text: string;
  isSelected?: boolean;
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
  const [selectedCases, setSelectedCases] = useState<CaseDetail[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleViewDocument = (caseItem: CaseDetail) => {
    setSelectedCase(caseItem);
    setShowSummary(true);
  };

  const handleCaseSelection = (caseItem: CaseDetail) => {
    if (selectedCases.find(c => c.digi_url === caseItem.digi_url)) {
      setSelectedCases(selectedCases.filter(c => c.digi_url !== caseItem.digi_url));
    } else if (selectedCases.length < 3) {
      setSelectedCases([...selectedCases, caseItem]);
    }
  };

  const handleGenerateGrounds = async () => {
    try {
      const response = await fetch('/api/interpretter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_id: queryId,
          urls: selectedCases.map(c => c.digi_url)
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate grounds');
      
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error generating grounds:', error);
     
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <div className={`overflow-y-auto ${activeChatCase ? 'w-1/2' : 'w-full'} p-6`}>
        <div className="flex flex-col sticky top-0 bg-white pb-4">
          <h2 className="text-2xl font-bold mb-2">Search Results</h2>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={onBack} variant="outline">Back to Search</Button>
            <div className="flex flex-col items-end">
              <Button 
                onClick={handleGenerateGrounds}
                disabled={selectedCases.length === 0}
              >
                Generate Grounds
              </Button>
              <span className="text-sm text-gray-500 mt-1">
                (select up to 3 cases)
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {cases.map((caseItem, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex-1">
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
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-2">
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
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={selectedCases.some(c => c.digi_url === caseItem.digi_url)}
                      onCheckedChange={() => handleCaseSelection(caseItem)}
                      disabled={selectedCases.length >= 3 && !selectedCases.some(c => c.digi_url === caseItem.digi_url)}
                    />
                    <label className="text-sm text-gray-600">Include for Grounds</label>
                  </div>
                </div>
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

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Submitted Successfully</DialogTitle>
            <DialogDescription>
              The grounds will be emailed to you shortly on your registered email id.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;