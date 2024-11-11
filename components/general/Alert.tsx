import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useProgressStore } from "@/hooks/useModelStore";

export function AlertDemo() {

  const { loading } = useProgressStore();
  
  return (
    loading && (
    <Alert variant="default">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
            <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span>Processing your files</span>
            </div>
        </AlertDescription>
    </Alert>
    )
  )
}
