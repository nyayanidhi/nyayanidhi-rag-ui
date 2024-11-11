import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

type UpscalerForm = {
  case_type: string;
  facts_at_hand: string;
  legal_argument: string;
  prayer_sought: string;
};

const Upscaler = () => {
  const [formData, setFormData] = useState<UpscalerForm>({
    case_type: "",
    facts_at_hand: "",
    legal_argument: "",
    prayer_sought: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Legal Document Upscaler</h2>
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

        <div className="space-y-2">
          <Label htmlFor="facts_at_hand">Facts at Hand</Label>
          <textarea 
            className="w-full h-24 p-2 border rounded-md"
            value={formData.facts_at_hand}
            onChange={(e) => setFormData(prev => ({...prev, facts_at_hand: e.target.value}))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legal_argument">Legal Argument</Label>
          <textarea 
            className="w-full h-24 p-2 border rounded-md"
            value={formData.legal_argument}
            onChange={(e) => setFormData(prev => ({...prev, legal_argument: e.target.value}))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prayer_sought">Prayer Sought</Label>
          <textarea 
            className="w-full h-24 p-2 border rounded-md"
            value={formData.prayer_sought}
            onChange={(e) => setFormData(prev => ({...prev, prayer_sought: e.target.value}))}
          />
        </div>

        <Button type="submit" className="w-full">
          Generate Document
        </Button>
      </form>
    </div>
  );
};

export default Upscaler;