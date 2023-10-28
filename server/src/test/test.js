function printResult(searchTerm, searchResult) {
  let finalResult = [];
  finalResult.push({
    searchTerm: searchTerm,
  });
  searchResult?.map((singleTerm) => {
    finalResult.push({
      term: singleTerm.item,
      score: singleTerm.score,
    });
  });
  return finalResult;
}

function fuzzyLogic() {
  const Fuse = require("fuse.js");

  const medicineNames = [
    "Aspirin 500mg Tablet",
    "Crocin 500mg Tablet",
    "Bacrocin 2% Ointment",
  ];

  // Set up the options for the Fuse.js search
  const options = {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"],
    includeScore: true,
  };

  // Create a new instance of the Fuse.js search object
  const fuse = new Fuse(medicineNames, options);

  // Search for a medicine name
  const searchTerm = "crocen";
  const results = fuse.search(searchTerm);

  // Log the search results

  console.log("Less score is Better \n", printResult(searchTerm, results));
}

function cosineSimilarity() {
  const medicineNames = [
    "Aspirin 500mg Tablet",
    "Crocin 500mg Tablet",
    "Bacrocin 2% Ointment",
  ];

  function wordToVector(word) {
    // Convert word to lowercase and split into characters
    const characters = word.toLowerCase().split("");

    // Create object to hold character frequencies
    const vector = {};

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

  function SingleStrSimilarity(str1, str2) {
    // Convert strings to vectors
    const vec1 = wordToVector(str1);
    const vec2 = wordToVector(str2);

    // Calculate dot product
    let dotProduct = 0;
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

  // Example usage
  const search = "crocene";
  console.log("\n\n");
  console.log(`Search term: ${search} \n`);
  console.log("More is Better\n");
  for (let i = 0; i < 3; i++) {
    const score = SingleStrSimilarity(search, medicineNames[i]);
    console.log({
      term: medicineNames[i],
      score: score,
    });
  }
  console.log("\n\n");
}

function lavensteinDistance() {
  const medicineNames = [
    "Aspirin 500mg Tablet",
    "Crocin 500mg Tablet",
    "Bacrocin 2% Ointment",
  ];

  function levenshteinDistance(str1, str2) {
    // Convert strings to arrays
    const s1 = str1.split("");
    const s2 = str2.split("");

    // Initialize matrix
    const matrix = [];

    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }

    // Calculate Levenshtein distance
    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2[i - 1] === s1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // Substitution
            matrix[i][j - 1] + 1, // Insertion
            matrix[i - 1][j] + 1 // Deletion
          );
        }
      }
    }

    return matrix[s2.length][s1.length];
  }

  function similarityScore(str1, str2) {
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return (1 - distance / maxLength) * 100;
  }

  // Example usage
  const search = "crocen";
  console.log("\n\n");
  console.log(`Search term: ${search} \n`);
  console.log("Less is Better\n");
  for (let i = 0; i < 3; i++) {
    const score = levenshteinDistance(search, medicineNames[i]);
    console.log({
      term: medicineNames[i],
      score: score,
    });
  }
  console.log("\n\n");
}

function euclideanDistance() {
  const medicineNames = [
    "Genericart Azithromycin 500mg Tablet",
    "Erythrocin 500mg Tablet",
    "Althrocin 500 Tablet",
  ];

  function euclideanDistance(str1, str2) {
    const arr1 = str1.split("");
    const arr2 = str2.split("");
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
      sum += Math.pow(arr1[i].charCodeAt(0) - arr2[i].charCodeAt(0), 2);
    }
    return Math.sqrt(sum);
  }

  // Example usage
  const search = "Azithomycin";
  console.log("\n\n");
  console.log(`Search term: ${search} \n`);
  console.log("Less is Better\n");
  for (let i = 0; i < 3; i++) {
    const score = euclideanDistance(search, medicineNames[i]);
    console.log({
      term: medicineNames[i],
      score: score,
    });
  }
  console.log("\n\n");
}

// fuzzyLogic();
// cosineSimilarity();
// lavensteinDistance();
euclideanDistance();
