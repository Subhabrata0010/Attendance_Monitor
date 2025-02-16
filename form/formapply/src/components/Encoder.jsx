export default function encodeBase64(text) {
    const salt = "086724@2025synntaxical"; // Fixed salt
    const textString = typeof text === 'string' ? text : JSON.stringify(text);
    const saltedText = salt + textString; 
    return btoa(saltedText);
}
