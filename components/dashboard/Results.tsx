import { useEffect } from 'react';
import { Button } from "../ui/button";

type CaseDetail = {
  case_name: string;
  scr_citation: string;
  neutral_citation: string;
  digi_url: string;
};

type ResultsProps = {
  cases: CaseDetail[];
  onBack: () => void;
};

const Results = ({ cases, onBack }: ResultsProps) => {
  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
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
              className="hover:text-blue-600"
            >
              <h3 className="font-semibold text-lg mb-2">{caseItem.case_name}</h3>
            </a>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">SCR Citation:</p>
                <p>{caseItem.scr_citation}</p>
              </div>
              <div>
                <p className="text-gray-600">Neutral Citation:</p>
                <p>{caseItem.neutral_citation}</p>
              </div>
            </div>
            <div className="mt-3">
              <a 
                href={caseItem.digi_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View Summary →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;