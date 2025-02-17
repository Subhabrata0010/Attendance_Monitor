import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import QRTicketGenerator from "./Ticket";

const qrColorType = "solid";
const bgColorType = "gradient";
const qrColor = "#000000";
const bgColor = "#FFFFFF";
const gradStartColor = "#000000";
const gradEndColor = "#000000";
const gradientType = "linear";
const qrSize = 400;
const dotStyle = "dots";
const cornerSquareStyle = "extra-rounded";
const cornerDotStyle = "extra-rounded";
const bgGradStart = "#FF00FF";
const bgGradEnd = "#FFFF00";

const QRCodeGenerator = ({ data, setQrImage }) => {
    const qrCodeContainer = useRef(null);
    const [qrCode, setQrCode] = useState(null);
    const [options, setOptions] = useState({
        width: qrSize,
        height: qrSize,
        data: "",
        image: "/icon.png", // ✅ Add your image here (Make sure it's in /public/)
        imageOptions: { 
            crossOrigin: "anonymous", 
            margin: 10, 
            imageSize: 0.3 // ✅ Adjust image size (0.0 - 1.0)
        },
        dotsOptions: {
            type: dotStyle,
            gradient: qrColorType === "gradient" ? {
                type: gradientType,
                colorStops: [
                    { offset: 0, color: gradStartColor },
                    { offset: 1, color: gradEndColor }
                ]
            } : null,
            color: qrColorType === "solid" ? qrColor : null
        },
        backgroundOptions: {
            gradient: bgColorType === "gradient" ? {
                type: gradientType,
                colorStops: [
                    { offset: 0, color: bgGradStart },
                    { offset: 1, color: bgGradEnd }
                ]
            } : null,
            color: bgColorType === "solid" ? bgColor : null
        },
        cornersSquareOptions: { type: cornerSquareStyle, color: gradStartColor },
        cornersDotOptions: { type: cornerDotStyle, color: gradEndColor },
        imageOptions: { crossOrigin: "anonymous", margin: 5 },
        qrOptions: { errorCorrectionLevel: "H" },
    });

    useEffect(() => {
        if (!qrCode) {
            setQrCode(new QRCodeStyling(options));
        }
    }, []);

    useEffect(() => {
        if (qrCode && data) {
            setOptions((prev) => ({ ...prev, data: JSON.stringify(data) }));
            qrCode.update({ ...options, data: JSON.stringify(data) });
            qrCode.append(qrCodeContainer.current);

            // Generate QR as base64 image and pass it to parent
            qrCode.getRawData("png").then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (setQrImage) {
                        setQrImage(reader.result); // Set the base64 image in state
                    }
                };
                reader.readAsDataURL(blob);
            });
        }
    }, [data, qrCode]);

    const downloadQR = (format) => {
        if (qrCode) {
            qrCode.download({ name: "qr_code", extension: format });
        } else {
            alert("Please generate a QR code first!");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Generated QR Code:</h3>
            <div
                ref={qrCodeContainer}
                style={{
                    margin: "20px auto",
                    padding: "10px",
                    width: `${options.width}px`,
                    height: `${options.height}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #ccc"
                }}
            ></div>
            <button onClick={() => downloadQR("png")}>Download PNG</button>
            <button onClick={() => downloadQR("jpg")}>Download JPG</button>
        </div>
    );
};

export default QRCodeGenerator;
