import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, FileText, X } from "lucide-react";

interface PdfUploaderProps {
  onSelect: (file: File | null) => void;
}

export function PdfUploader({ onSelect }: PdfUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onSelect(file);
    } else if (file) {
      alert("Please select a PDF file.");
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    onSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        id="pdf-input"
        ref={fileInputRef}
        className="hidden"
        accept="application/pdf"
        onChange={handleFileChange}
        data-testid="pdf-input"
      />
      
      {!selectedFile ? (
        <label
          htmlFor="pdf-input"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors z-10 relative"
          data-testid="pdf-select"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF (MAX. 10MB)</p>
          </div>
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium truncate">{selectedFile.name}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSelection}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
