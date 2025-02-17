const splitStringToJson = (inputString) => {
    if (typeof inputString !== "string" || !inputString) return JSON.stringify({});
    const length = inputString.length;
    const partSize = Math.ceil(length / 20);
    let parts = [];
    
    for (let i = length; i > 0; i -= partSize) {
      parts.unshift(inputString.substring(Math.max(0, i - partSize), i));
    }
  
    let dict = {};
    parts.forEach((part, index) => {
      dict[`part_${index + 1}`] = part;
    });
  
    return dict;
  };
  
  export default splitStringToJson;
  