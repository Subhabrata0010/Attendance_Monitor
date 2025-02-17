import React, { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbziO2Gf9A-_BE2Ao36-msyUq1tMBvM6SLpUtk342xpOAr4NI2AmzWZz2G6Trrpf2FQ1jA/exec"; // Replace with your script URL

const QRScanner = () => {
  const videoRef = useRef(null);
  const [qrResult, setQrResult] = useState("");
  const [email, setEmail] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result) {
          let processedData = processScannedData(result.text);
          setQrResult(processedData);
          extractEmail(processedData);
          codeReader.reset();
        }
      })
      .catch(console.error);

    return () => codeReader.reset();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFile(URL.createObjectURL(file));

    const codeReader = new BrowserMultiFormatReader();
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const result = await codeReader.decodeFromImageElement(img);
        let processedData = processScannedData(result.text);
        setQrResult(processedData);
        extractEmail(processedData);
      } catch (err) {
        console.error("Error scanning QR:", err);
        setQrResult("QR Code not detected.");
      }
    };
  };

  const mergeJsonParts = (json) => {
    try {
      return Object.keys(json)
        .sort((a, b) => parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]))
        .map((key) => json[key])
        .join("");
    } catch (error) {
      console.error("JSON merge error:", error);
      return json;
    }
  };

  const decryptData = (encodedString) => {
    try {
      let salt = "scece@2025"; 

      let saltedString = encodedString.replace(salt, "");
      let firstDecode = atob(saltedString);
      let finalDecode = atob(firstDecode);

      return finalDecode;
    } catch (err) {
      console.error("Decryption failed:", err);
      return encodedString;
    }
  };

  const processScannedData = (scannedText) => {
    try {
      let parsedJson = JSON.parse(scannedText); 
      let mergedString = mergeJsonParts(parsedJson); 
      return decryptData(mergedString); 
    } catch (err) {
      console.warn("QR data is not JSON, proceeding with decryption only.");
      return decryptData(scannedText); 
    }
  };

  const extractEmail = async (decodedData) => {
    try {
      let jsonData = JSON.parse(decodedData);
      if (jsonData.email) {
        setEmail(jsonData.email);
        await checkAttendanceStatus(jsonData.email);
      } else {
        console.warn("No email found in QR data");
        setEmail(null);
      }
    } catch (err) {
      console.warn("Decoded data is not JSON");
      setEmail(null);
    }
  };

  const checkAttendanceStatus = async (email) => {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: email, 
      });

      const result = await response.text();
      if (result === "empty") {
        setAttendanceStatus("pending");
      } else {
        setAttendanceStatus("marked");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("⚠️ Error checking attendance.");
    }
  };

  const submitAttendance = async () => {
    if (!email) {
      setMessage("No valid email found in the QR code.");
      return;
    }

    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ email: email, attendance: "Yes" }),
      });

      const result = await response.text();
      if (result === "success") {
        setMessage("✅ Attendance marked successfully!");
        setAttendanceStatus("marked");
      } else {
        setMessage("❌ Failed to mark attendance.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("⚠️ Error submitting attendance.");
    }
  };

  return (
    <div>
      <h2>QR Code Scanner</h2>

      <video ref={videoRef} style={{ width: "300px" }}></video>

      <h3>Upload QR Image</h3>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {file && <img src={file} alt="Uploaded QR" style={{ width: "200px", marginTop: "10px" }} />}

      {qrResult && (
        <div>
          <h3>Decoded Result:</h3>
          <p>{qrResult}</p>
        </div>
      )}

      {email && (
        <div>
          <h3>Extracted Email: {email}</h3>
          {attendanceStatus === "pending" ? (
            <button onClick={submitAttendance}>Submit Attendance</button>
          ) : (
            <p>✅ Attendance already marked</p>
          )}
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default QRScanner;
