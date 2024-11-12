import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Loader2 } from "lucide-react";
import Results from "./Results";

type UpscalerForm = {
  case_type: string;
  facts_at_hand: string;
  legal_argument: string;
  prayer_sought: string;
   session_id: string,
};

const Upscaler = () => {
  const [formData, setFormData] = useState<UpscalerForm>({
    case_type: "",
    facts_at_hand: "",
    legal_argument: "",
    prayer_sought: "",
    session_id: uuidv4(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/upscaler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.data.case_details);
        setShowResults(true);
      } else {
        console.error('Failed to process upscaler request:', data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setShowResults(!showResults);
  };

  if (showResults && results) {
    return <Results cases={results} onBack={toggleView} />;
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Generate Document
          </Button>
        </form>
      </div>

      <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-md" hideClose>
          <DialogHeader>
            <DialogTitle>Generating Document</DialogTitle>
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

export default Upscaler;