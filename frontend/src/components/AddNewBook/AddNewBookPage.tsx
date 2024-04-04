import NewBookSearchbar from "./NewBookSearchbar.tsx";
import BarcodeScanner from "./BarcodeScanner.tsx";
import {Html5QrcodeResult} from "html5-qrcode";
import {useState} from "react";


export default function AddNewBookPage() {
    const [isScannerActive, setIsScannerActive] = useState(false)
    const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeResult) => {
        alert(`Scan result: ${decodedText}`)
        console.log(`Scan result: ${decodedResult}`)
    }

    function handleScannerToggle() {
        setIsScannerActive(!isScannerActive)
    }

    return (
        <>
        <div className={"header-title--wrapper"}>
            <h1 className={"header-title"}>Neues Buch hinzufügen</h1>
        </div>
            <NewBookSearchbar  />
            <div>
                <h2>Buch über ISBN suchen</h2>
                <button onClick={handleScannerToggle}>
                    {isScannerActive ? "Barcode Scanner stoppen" : "Barcode Scanner starten"}
                </button>
            </div>
            {isScannerActive && (
                <BarcodeScanner
                    qrCodeSuccessCallback={onNewScanResult}
                    qrCodeErrorCallback={error => console.error(error)}
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                />
            )}
        </>
    )
}