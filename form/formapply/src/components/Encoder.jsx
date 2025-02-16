export default function encodeBase64(text) {
    const salt = "scece@2025"; // Fixed salt
    const textString = typeof text === 'string' ? text : JSON.stringify(text);
    const saltedText = salt + textString;
    
    // Encode to Base64
    let encoded = btoa(saltedText);
    // Remove '=' padding
    return encoded.replace(/=+$/, '');
}
