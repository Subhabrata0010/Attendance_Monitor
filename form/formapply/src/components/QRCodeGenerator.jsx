import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import jsPDF from "jspdf";

const qrSize = 180; // Adjust QR size
const qrPositionX = 751; // Adjust position on ticket
const qrPositionY = 74; // Adjust position on ticket

const QRCodeGenerator = ({ data }) => {
    const qrCanvasRef = useRef(null);
    const ticketCanvasRef = useRef(null);
    const [qrCode, setQrCode] = useState(null);
    const [qrGenerated, setQrGenerated] = useState(false);
    const [ticketReady, setTicketReady] = useState(false);

    const qrOptions = {
        width: qrSize,
        height: qrSize,
        data: data || "",
        image: "/icon.png", // ✅ Add your image here (Make sure it's in /public/)
        imageOptions: { 
            crossOrigin: "anonymous", 
            margin: 10, 
            imageSize: 0.3 // ✅ Adjust image size (0.0 - 1.0)
        },
        dotsOptions: {
            type: "dots",
            gradient: {
                type: "linear",
                colorStops: [
                    { offset: 0, color: "#000000" },
                    { offset: 1, color: "#4A90E2" }
                ]
            }
        },
        backgroundOptions: { color: "white" }, // ✅ Removes white background
        cornersSquareOptions: { type: "extra-rounded", color: "#000000" },
        cornersDotOptions: { type: "extra-rounded", color: "#4A90E2" },
        qrOptions: { errorCorrectionLevel: "H" }
    };

    useEffect(() => {
        if (!qrCode) {
            const newQrCode = new QRCodeStyling(qrOptions);
            setQrCode(newQrCode);
        }
    }, []);

    useEffect(() => {
        if (qrCode && data) {
            qrCode.update({ data: JSON.stringify(data) });
            qrCode.append(qrCanvasRef.current);
            setQrGenerated(true);
        }
    }, [data, qrCode]);

    const drawTicketWithQR = async () => {
        if (!qrGenerated) {
            alert("Please generate the QR code first!");
            return;
        }

        const canvas = ticketCanvasRef.current;
        if (!canvas) {
            alert("Canvas not ready yet. Try again.");
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            alert("Failed to get canvas context!");
            return;
        }

        // Load the ticket image
        const ticketImg = new Image();
        ticketImg.src = "/ticket.png"; // Ensure ticket image is inside /public
        ticketImg.crossOrigin = "anonymous";

        ticketImg.onload = async () => {
            canvas.width = ticketImg.width;
            canvas.height = ticketImg.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw ticket background
            ctx.drawImage(ticketImg, 0, 0, canvas.width, canvas.height);

            // Get QR code as an image
            const qrBlob = await qrCode.getRawData("png");
            if (!qrBlob) {
                alert("QR code failed to generate.");
                return;
            }

            const qrImg = new Image();
            qrImg.src = URL.createObjectURL(qrBlob);
            qrImg.crossOrigin = "anonymous";

            qrImg.onload = () => {
                ctx.drawImage(qrImg, qrPositionX, qrPositionY, qrSize, qrSize);
                URL.revokeObjectURL(qrImg.src);
                setTicketReady(true);
            };

            qrImg.onerror = () => alert("QR image failed to load.");
        };

        ticketImg.onerror = () => alert("Ticket image failed to load. Ensure it's inside `/public/`.");
    };

    const downloadTicket = (format) => {
        if (!ticketReady) {
            alert("Please generate the ticket first!");
            return;
        }

        const canvas = ticketCanvasRef.current;
        if (format === "png" || format === "jpg") {
            const link = document.createElement("a");
            link.download = `ticket.${format}`;
            link.href = canvas.toDataURL(`image/${format}`);
            link.click();
        } else if (format === "pdf") {
            const pdf = new jsPDF();
            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", 10, 10, 180, 100); // Adjust size
            pdf.save("ticket.pdf");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Generated QR Code:</h3>
            <div ref={qrCanvasRef} style={{ margin: "10px auto", padding: "10px" }}></div>

            <button onClick={drawTicketWithQR}>Generate Ticket with QR</button>

            <canvas ref={ticketCanvasRef} style={{ display: "none" }}></canvas> {/* Keep hidden until needed */}

            {ticketReady && (
                <>
                    <h3>Final Ticket:</h3>
                    <canvas ref={ticketCanvasRef} style={{ border: "1px solid black" }}></canvas>
                    <br />
                    <button onClick={() => downloadTicket("png")}>Download PNG</button>
                    <button onClick={() => downloadTicket("jpg")}>Download JPG</button>
                    <button onClick={() => downloadTicket("pdf")}>Download PDF</button>
                </>
            )}
        </div>
    );
};

export default QRCodeGenerator;
