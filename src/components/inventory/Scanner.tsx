
import React, { useRef, useState } from 'react';
import { Html5QrcodeScanType } from 'html5-qrcode';
import { Card, CardContent } from "@/components/ui/card";
import Html5QrcodePlugin from './Html5QrcodePlugin';
import './style.css';

interface ScannerProps {
  onScan: (result: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const [scanning, setScanning] = useState(true);
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full">
            <Html5QrcodePlugin
              fps={20}
              disableFlip={false}
              qrCodeSuccessCallback={onNewScanResult}
              supportedScanTypes={[Html5QrcodeScanType.SCAN_TYPE_CAMERA]}
            />
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
