import { Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import {useEffect} from "react";
import {Html5QrcodeScannerConfig} from "html5-qrcode/html5-qrcode-scanner";

const grcodeRegionId = "html5gr-code-full-region";

type Html5QrcodePluginProps = {
    fps: number,
    qrbox: number,
    aspectRatio?: number,
    disableFlip?: boolean,
    verbose?: false,
    qrCodeSuccessCallback: QrcodeSuccessCallback,
    qrCodeErrorCallback?: QrcodeErrorCallback,
}
const createConfig = (props: Readonly<Html5QrcodePluginProps>) => {
    const config: Html5QrcodeScannerConfig = {
        useBarCodeDetectorIfSupported: true,
        fps: props.fps,
        qrbox: props.qrbox,
        aspectRatio: props.aspectRatio,
        disableFlip: props.disableFlip,
    };
    return config;
};

export default function BarcodeScanner(props: Readonly<Html5QrcodePluginProps>) {

    useEffect(() => {
        const config = createConfig(props);
        const verbose = props.verbose === false;
        // Success callback is required
        if (!props.qrCodeSuccessCallback) {
            throw new Error("qrCodeSuccessCallback is required callback.");
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(
            grcodeRegionId,
            config,
            verbose
        );
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch((error) => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={grcodeRegionId}/>
    )
}