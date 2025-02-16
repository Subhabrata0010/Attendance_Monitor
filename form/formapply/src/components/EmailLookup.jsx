import React, { useState } from "react";
import QRCodeGenerator from "./QRCodeGenerator";
import ResponseDisplay from "./ResponseDisplay";
import EmailInput from "./EmailInput";
import encodeBase64 from "./Encoder";
import splitStringToJson from "./Splitter";

const EmailLookup = () => {
    const [email, setEmail] = useState("");
    const [responseData, setResponseData] = useState(null);

    const sendEmail = async () => {
        if (!email) {
            alert("Please enter an email.");
            return;
        }

        const url = "https://script.google.com/macros/s/AKfycbwHCSogzOIBGgMAfTfjbFEQJoB4CHFMuz4wYRBtoMxJAcCvrV_P4YA-qUJU_w20uNyjng/exec"; // Replace with your actual URL

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            setResponseData(data);
        } catch (error) {
            console.error("Error:", error);
            setResponseData({ error: "Error fetching data." });
        }
    };
    const encodedResult1 = encodeBase64(responseData);
    const encodedResult2 = encodeBase64(encodedResult1);
    const jsonsplit = splitStringToJson(encodedResult2);
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Enter Lead email</h2>
            <EmailInput email={email} setEmail={setEmail} sendEmail={sendEmail} />
            <ResponseDisplay responseData={responseData} />
            <QRCodeGenerator data={jsonsplit} />
        </div>
    );
};

export default EmailLookup;
