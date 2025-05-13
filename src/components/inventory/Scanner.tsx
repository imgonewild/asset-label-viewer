
import React from 'react';
import { Html5QrcodeScanType } from 'html5-qrcode';
import { Card, CardContent } from "@/components/ui/card";
import { Scan } from "lucide-react";
import Html5QrcodePlugin from './Html5QrcodePlugin';
import './style.css';

interface ScannerProps {
  onScan: (result: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  let canTrigger = true;
  
  const onNewScanResult = (decodedText: string) => {
    if (canTrigger) {
      canTrigger = false;
      
      onScan(decodedText);
      
      setTimeout(() => {
        canTrigger = true;
      }, 1000); // Allow triggering again after 1 second
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-2 flex items-center justify-center gap-2 text-primary">
              <Scan className="h-5 w-5" />
              <span className="font-medium">Scanner</span>
            </div>
            <div className="scanner-container">
              <Html5QrcodePlugin
                fps={20}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
                supportedScanTypes={[Html5QrcodeScanType.SCAN_TYPE_CAMERA]}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Position the barcode or QR code in front of your camera to scan
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Scanner;
