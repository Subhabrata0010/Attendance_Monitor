import React from "react";

const ResponseDisplay = ({ responseData }) => {
    return (
        <div>
            <h3>Team Details:</h3>
            <div style={{
                textAlign: "left",
                margin: "20px auto",
                width: "100%",
                background: "#f4f4f4",
                padding: "10px",
                borderRadius: "5px",
                overflowX: "auto"
            }}>
                {responseData ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            {Object.entries(responseData).map(([key, value]) => (
                                <tr key={key} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={{ fontWeight: "bold", padding: "8px", width: "50%" }}>{key}</td>
                                    <td style={{ padding: "8px" }}>{String(value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Waiting for response...</p>
                )}
            </div>
        </div>
    );
};

export default ResponseDisplay;
