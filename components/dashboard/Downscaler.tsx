import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { v4 as uuidv4 } from 'uuid';
import Results from "./Results";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

type DownscalerProps = {
  onBack: () => void;
};

const CASE_TYPES = ["CIVIL", "CRIMINAL", "SUO MOTO", "WRIT"];
const ALLOWED_FILE_TYPES = [
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];
  
const Downscaler = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caseType, setCaseType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<{
    show: boolean;
    message: string;
    isSubscriptionError: boolean;
  }>({
    show: false,
    message: "",
    isSubscriptionError: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError({ show: false, message: "", isSubscriptionError: false });

    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setError({
        show: true,
        message: "Please upload only .doc or .docx files",
        isSubscriptionError: false
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ show: false, message: "", isSubscriptionError: false });

    if (!file) {
      setError({
        show: true,
        message: "Please select a file",
        isSubscriptionError: false
      });
      return;
    }

    if (!caseType) {
      setError({
        show: true,
        message: "Please select a case type",
        isSubscriptionError: false
      });
      return;
    }

    setIsLoading(true);

    try {
      const sessionId = uuidv4();
      const formData = new FormData();
      formData.append("user_input", file);
      formData.append("case_type", caseType);
      formData.append("session_id", sessionId);

      const response = await fetch("/api/downscaler", {
        method: "POST",
        body: formData,
      });

      if (response.status === 403) {
        setError({
          show: true,
          message: "Please check your subscription plan",
          isSubscriptionError: true,
        });
        return;
      }

      if (response.status === 500) {
        setError({
          show: true,
          message: "Error processing request. Please try in sometime",
          isSubscriptionError: false,
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        setResults({
            case_details: data.data.case_details,
            query_id: data.data.query_id
        });
        setShowResults(true);
      } else {
        console.error('Failed to process downscaler request:', data);
        setError({
          show: true,
          message: "An unexpected error occurred. Please try again.",
          isSubscriptionError: false
        });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError({
        show: true,
        message: "An unexpected error occurred. Please try again.",
        isSubscriptionError: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setShowResults(!showResults);
  };

  if (showResults && results) {
    return <Results 
      cases={results.case_details} 
      queryId={results.query_id}
      onBack={toggleView} 
    />;
  }

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Legal Document Downscaler</h2>
          {results && (
            <Button onClick={toggleView} variant="outline">
              View Results
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="case_type">Case Type</Label>
            <Select onValueChange={(value) => setCaseType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {CASE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Case File</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".doc,.docx"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
            <p className="text-sm text-gray-500">Only .doc or .docx files are allowed</p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Process Document
          </Button>
        </form>
      </div>

      <Dialog open={error.show} onOpenChange={(open) => setError(prev => ({ ...prev, show: open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {error.message}
            </DialogDescription>
          </DialogHeader>
          {error.isSubscriptionError && (
            <DialogFooter>
              <Button onClick={() => router.push('/plans')}>
                View Plans
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-md" hideClose>
          <DialogHeader>
            <DialogTitle>Processing Document</DialogTitle>
            <DialogDescription className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Please wait while we process your request...</span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Downscaler;