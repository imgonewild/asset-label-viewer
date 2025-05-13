
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ScannerProps {
  onScan: (result: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setHasCamera(true);
          setScanning(true);
        }
      } else {
        toast({
          title: "Camera Error",
          description: "Your device doesn't support camera access",
          variant: "destructive",
        });
        setHasCamera(false);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Failed to access the camera. Please ensure you've granted permission.",
        variant: "destructive",
      });
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setScanning(false);
    }
  };

  const captureFrame = () => {
    if (scanning && videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simulate barcode detection with a mock value
        // In a real app, you would use a barcode scanning library here
        // like zxing-js/library or quagga
        setTimeout(() => {
          const mockLabelId = "WP-DV-23101"; // This is from your backend code comment
          onScan(mockLabelId);
          stopCamera();
          toast({
            title: "Scan Complete",
            description: `Label detected: ${mockLabelId}`,
          });
        }, 2000);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    
    if (scanning) {
      interval = window.setInterval(captureFrame, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-lg border-2 border-dashed rounded-lg overflow-hidden bg-muted min-h-[320px] mb-4 flex items-center justify-center">
        {scanning ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary opacity-70 animate-pulse"></div>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <p>Camera preview will appear here</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="space-x-2">
        {!scanning && (
          <Button onClick={startCamera}>
            Start Camera
          </Button>
        )}
        {scanning && (
          <Button variant="destructive" onClick={stopCamera}>
            Stop Camera
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Position the barcode/QR code within the frame to scan automatically
      </p>
    </div>
  );
};

export default Scanner;
