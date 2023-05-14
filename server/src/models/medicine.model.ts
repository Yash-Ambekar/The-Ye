import { readFile } from "fs/promises";
import Fuse from "fuse.js"


//Utility function for reading the JSON file
async function readJsonFile(path:string) {
  const file = await readFile(path, "utf8");
  return JSON.parse(file);
}

function wordToVector(word:string) {
  // Convert word to lowercase and split into characters
  const characters = word.toLowerCase().split("");

  // Create object to hold character frequencies
  const vector: {[char: string]: number} = {};

  // Count frequency of each character
  for (const char of characters) {
    if (vector[char]) {
      vector[char]++;
    } else {
      vector[char] = 1;
    }
  }

  return vector;
}

function cosineSimilarity(str1: string, str2: string) {
  // Convert strings to vectors
  const vec1 = wordToVector(str1);
  const vec2 = wordToVector(str2);

  // Calculate dot product
  let dotProduct: number = 0;
  for (const char in vec1) {
    if (vec2[char]) {
      dotProduct += vec1[char] * vec2[char];
    }
  }

  // Calculate magnitudes
  const mag1 = Math.sqrt(
    Object.values(vec1).reduce((acc, val) => acc + val ** 2, 0)
  );
  const mag2 = Math.sqrt(
    Object.values(vec2).reduce((acc, val) => acc + val ** 2, 0)
  );

  // Calculate cosine similarity
  return dotProduct / (mag1 * mag2);
}

async function fuzzyLogicSearch(medicineName:string) {
  const firstLetter = medicineName.toUpperCase().charAt(0);
  // const Fuse = require("fuse.js");

  // Create an array of medicine names to search through
  // const medicineNames = await import("../models/data.json", {
  //   assert: { type: "json" },
  // });

  const medicineNames = await readJsonFile("./src/models/data.json");
  // Set up the options for the Fuse.js search
  const options = {
    shouldSort: true,
    includeMatches: false,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"],
    includeScore: true,
  };

  let result = {
    0: "",
    1: "",
    2: "",
    3: 1,
  };
  // Create a new instance of the Fuse.js search object
  
  for (let i = 65; i <= 90; i++) {
      const fuse = new Fuse(medicineNames[String.fromCharCode(i)], options);
     
      
      // Search for a medicine name
      const searchTerm = medicineName;
      const tempRes = fuse.search(searchTerm);
      if (tempRes && tempRes[0] && tempRes[0].score && tempRes[0].score < result[3]) {
      
        result[2] = result[1];
        result[1] = result[0];
        result[0] = tempRes[0].item as string;
        result[3] =  tempRes[0].score;
      }
  }

  // Log the search results
  console.log(result[0]);
  return result;
}

async function getMedicine(medicineName:string) {
  if(medicineName === "") return null;
  const medicines = await readJsonFile("./src/models/data.json");
  const firstLetter = medicineName.toUpperCase().charAt(0);
  console.log(firstLetter);

  const similarWord = {
    0: 0,
    1: "",
    2: "",
  }
  medicines.default[firstLetter]?.map((medicine:string) => {
    if (similarWord[0] < cosineSimilarity(medicine, medicineName)) {
      similarWord[2] = similarWord[1];
      similarWord[0] = cosineSimilarity(medicine, medicineName);
      similarWord[1] = medicine;
    }
  });

  return {
    similarity: similarWord[0],
    name1: similarWord[1],
    name2: similarWord[2],
  };
}

module.exports = {
  getMedicine,
  fuzzyLogicSearch,
};
