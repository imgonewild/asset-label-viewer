
import React, { useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import ApiService from "@/services/ApiService";

const CsvUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const result = await ApiService.uploadCsv(file);
      setUploadStatus({
        success: true,
        message: "CSV data uploaded successfully!",
      });
      toast({
        title: "Upload successful",
        description: "CSV data has been uploaded and processed",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        success: false,
        message: "Failed to upload CSV. Please check the file format and try again.",
      });
      toast({
        title: "Upload failed",
        description: "Failed to upload CSV file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadExample = () => {
    // Create URL for the example CSV file
    const exampleCsvPath = `${window.location.protocol}//${window.location.hostname}:3000/WPJK IT Data example.csv`;
    
    // Create a temporary anchor element for downloading
    const link = document.createElement('a');
    link.href = exampleCsvPath;
    link.download = "WPJK IT Data example.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Example CSV template is being downloaded",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Inventory Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex-1 border-2 border-dashed rounded-md p-6 text-center hover:border-primary transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {file ? file.name : "Click to select a CSV file"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload a CSV file with inventory data
                </p>
              </div>
            </label>
            <Button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="min-w-[100px]"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleDownloadExample} 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Example CSV Template
          </Button>
          
          {uploadStatus && (
            <Alert variant={uploadStatus.success ? "default" : "destructive"}>
              <AlertDescription>{uploadStatus.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvUploader;
