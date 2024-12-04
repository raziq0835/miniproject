



const extractJSON = (response) => {
    try {
      // Convert buffer to string if needed
      const responseString = response.toString();
  
      // Find the JSON part using regex
      const jsonStart = responseString.indexOf('['); // Locate start of JSON
      const jsonEnd = responseString.lastIndexOf(']') + 1; // Locate end of JSON
      const jsonString = responseString.substring(jsonStart, jsonEnd);
  
      // Parse the valid JSON string
      const jsonArray = JSON.parse(jsonString);
  
      // Ensure it's an array
      if (Array.isArray(jsonArray)) {
        return jsonArray.map((item) => ({
          id: item.id,
          name: item.name,
          floor: item.floor,
          x_coord: item.x_coord,
          y_coord: item.y_coord,
        }));
      }
  
      throw new Error("Parsed JSON is not an array");
    } catch (err) {
      console.error("Error extracting JSON:", err);
      return [];
    }
  };

  module.exports = extractJSON;
  