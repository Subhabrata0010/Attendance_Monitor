import React from "react";

const EmailInput = ({ email, setEmail, sendEmail }) => {
    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
            />
            <button onClick={sendEmail}>Submit</button>
        </div>
    );
};

export default EmailInput;
