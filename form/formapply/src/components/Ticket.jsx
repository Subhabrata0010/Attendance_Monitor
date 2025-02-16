import React, { useEffect, useRef, useState } from "react";

const qrSize = 680;
const qrPositionX = 3020;
const qrPositionY = 230;

const QRTicketGenerator = ({ qrImage }) => {
    const ticketCanvasRef = useRef(null);
    const [ticketReady, setTicketReady] = useState(false);

    const drawTicketWithQR = () => {
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

        const ticketImg = new Image();
        ticketImg.src = "/ticket.png";
        ticketImg.crossOrigin = "anonymous";

        ticketImg.onload = () => {
            canvas.width = ticketImg.width;
            canvas.height = ticketImg.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(ticketImg, 0, 0, canvas.width, canvas.height);

            const qrImg = new Image();
            qrImg.src = qrImage;
            qrImg.crossOrigin = "anonymous";

            qrImg.onload = () => {
                ctx.drawImage(qrImg, qrPositionX, qrPositionY, qrSize, qrSize);
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
        const link = document.createElement("a");
        link.download = `ticket.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <button onClick={drawTicketWithQR}>Generate Ticket with QR</button>
            <canvas ref={ticketCanvasRef} style={{ display: "none" }}></canvas>
            {ticketReady && (
                <>
                    <h3>Final Ticket:</h3>
                    <canvas ref={ticketCanvasRef} style={{ border: "1px solid black", width: "800px", height: "260px" }}></canvas>
                    <br />
                    <button onClick={() => downloadTicket("png")}>Download PNG</button>
                    <button onClick={() => downloadTicket("jpg")}>Download JPG</button>
                    <button onClick={() => downloadTicket("pdf")}>Download PDF</button>
                </>
            )}
        </div>
    );
};

export default QRTicketGenerator;
