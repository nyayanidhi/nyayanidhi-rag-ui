import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Results from "./Results";
import { useRouter } from 'next/navigation';

type CaseDetail = {
    case_name: string;
    scr_citation: string;
    neutral_citation: string;
    digi_url: string;
    qol_text: string;
};

type UpscalerForm = {
    case_type: string;
    facts_at_hand: string;
    legal_argument: string;
    prayer_sought: string;
    session_id: string;
};

const Upscaler = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<UpscalerForm>({
        case_type: "",
        facts_at_hand: "",
        legal_argument: "",
        prayer_sought: "",
        session_id: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [results, setResults] = useState<any>(null);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState<{
        show: boolean;
        message: string;
        isSubscriptionError: boolean;
    }>({
        show: false,
        message: "",
        isSubscriptionError: false,
    });

    const pollStatus = async (jobId: string) => {
      console.log('in poll status');
      try {
          const response = await fetch('/api/upscalerStatus', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ job_id: jobId }), // Change: Send as an object
          });            
          
          const data = await response.json();
          console.log("Poll response:", data);
  
          if (!data.success) {
              throw new Error(data.error || "Failed to check status");
          }
  
          if (data.status === "COMPLETED") {
              setResults({
                  case_details: data.data.case_details,
                  query_id: data.data.query_id
              });
              setShowResults(true);
              setIsPolling(false);
              return true;
          } else if (data.status === "ERROR") {
              throw new Error(data.error || "Processing failed");
          }
  
          return false; // Continue polling if not completed or error
      } catch (error: any) {
          console.error("Polling error:", error);
          setError({
              show: true,
              message: error.message || "Error processing request",
              isSubscriptionError: false,
          });
          setIsPolling(false);
            return true;
        }
    };

    const startPolling = async (jobId: string) => {
      console.log('in start polling');
      setIsPolling(true);
      let isPollingActive = true;
      console.log(isPolling)
      while (isPollingActive) {
        console.log('in while true');
        const shouldStop = await pollStatus(jobId);
        console.log('should stop:', shouldStop);

        if (shouldStop) {
            isPollingActive = false;
            setIsPolling(false);
            break;
        }
          await new Promise(resolve => setTimeout(resolve, 5000)); // Move delay here
      }
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError({ show: false, message: "", isSubscriptionError: false });

        try {
            const newSessionId = uuidv4();
            const submissionData = {
                ...formData,
                session_id: newSessionId
            };

            // Initial request
            const response = await fetch('/api/upscaler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            console.log(response);

            if (response.status === 403) {
                setError({
                    show: true,
                    message: "Please check your subscription plan",
                    isSubscriptionError: true,
                });
                return;
            }

            const data = await response.json();
            console.log('response data', data)
            if (data.success && data.jobId) {
                console.log('set job id')
                setJobId(data.jobId);
                // Start polling
                
                console.log('about to start polling after setting it as true')
                await startPolling(data.jobId);
                console.log('await is done')
              
            } else {
                throw new Error(data.data || "Failed to start processing");
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            setError({
                show: true,
                message: error.message || "Error processing request. Please try again",
                isSubscriptionError: false,
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
                    <h2 className="text-2xl font-bold">Legal Document Upscaler</h2>
                    {results && (
                        <Button onClick={toggleView} variant="outline">
                            View Results
                        </Button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="case_type">Case Type</Label>
                        <Select onValueChange={(value) => setFormData(prev => ({...prev, case_type: value}))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select case type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CIVIL">Civil</SelectItem>
                                <SelectItem value="CRIMINAL">Criminal</SelectItem>
                                <SelectItem value="SUO MOTO">Suo Moto</SelectItem>
                                <SelectItem value="WRIT">Writ</SelectItem>
                                <SelectItem value="ARBITRATION">Arbitration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="facts_at_hand">Facts at Hand</Label>
                        <textarea 
                            className="w-full h-24 p-2 border rounded-md"
                            value={formData.facts_at_hand}
                            onChange={(e) => setFormData(prev => ({...prev, facts_at_hand: e.target.value}))}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="legal_argument">Legal Argument</Label>
                        <textarea 
                            className="w-full h-24 p-2 border rounded-md"
                            value={formData.legal_argument}
                            onChange={(e) => setFormData(prev => ({...prev, legal_argument: e.target.value}))}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="prayer_sought">Prayer Sought</Label>
                        <textarea 
                            className="w-full h-24 p-2 border rounded-md"
                            value={formData.prayer_sought}
                            onChange={(e) => setFormData(prev => ({...prev, prayer_sought: e.target.value}))}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || isPolling}>
                        {(isLoading || isPolling) ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Generate Document
                    </Button>
                </form>
            </div>

            <Dialog 
                open={error.show} 
                onOpenChange={(open) => setError(prev => ({ ...prev, show: open }))}
            >
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

            <Dialog 
                open={isLoading || isPolling} 
                onOpenChange={(open) => {
                    // Only allow closing if we're not actively polling
                    if (!isPolling) {
                        setIsLoading(open);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generating Document</DialogTitle>
                        <DialogDescription className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>
                                {isPolling 
                                    ? "Processing your request. This may take a few minutes..."
                                    : "Please wait while we process your request..."
                                }
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Upscaler;