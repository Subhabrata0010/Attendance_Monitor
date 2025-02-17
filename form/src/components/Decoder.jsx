export default function decodeBase64(encodedText) {
    const salt = "scece@2025"; // Fixed salt
    
    // Add '=' padding if needed
    while (encodedText.length % 4 !== 0) {
      encodedText += "=";
    }
    
    // Decode from Base64
    let decoded = atob(encodedText);
    
    // Remove the salt
    if (decoded.startsWith(salt)) {
      return decoded.slice(salt.length);
    }
    
    return "Invalid encoded text";
  }
  