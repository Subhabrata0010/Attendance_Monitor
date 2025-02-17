const mergeJsonToString = (jsonObject) => {
    if (typeof jsonObject !== "object" || jsonObject === null) return "";
    
    const parts = Object.keys(jsonObject)
      .sort((a, b) => parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]))
      .map((key) => jsonObject[key]);
    
    return parts.join("");
  };
  
  export default mergeJsonToString;
  