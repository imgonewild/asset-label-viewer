
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

const Html5QrcodePlugin = ({ 
  fps = 10, 
  qrbox = 250, 
  disableFlip = false,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
  supportedScanTypes
}) => {
  useEffect(() => {
    // when component mounts
    const config = {
      fps,
      qrbox,
      disableFlip,
      supportedScanTypes
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      /* verbose= */ false
    );
    html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [fps, qrbox, disableFlip, qrCodeSuccessCallback, qrCodeErrorCallback, supportedScanTypes]);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
