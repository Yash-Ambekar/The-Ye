const {closest} = require('fastest-levenshtein');
const medicine = [["abc, adc, atf"], ["bcd", "bgf", "btf"], ["Crocin Tablet", "chaymorale Forte Tablet", "Cyclopam Tablet"]];



function wordToVector(word) {
    // Convert word to lowercase and split into characters
    const characters = word.toLowerCase().split('');
  
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
  
  function cosineSimilarity(str1, str2) {
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
    const mag1 = Math.sqrt(Object.values(vec1).reduce((acc, val) => acc + val ** 2, 0));
    const mag2 = Math.sqrt(Object.values(vec2).reduce((acc, val) => acc + val ** 2, 0));
  
    // Calculate cosine similarity
    return dotProduct / (mag1 * mag2);
  }

function getMedicine(medicineName){
    if(typeof(medicineName) !== 'string' && medicineName === "") return null;

    const firstLetter = medicineName.toUpperCase().charCodeAt(0) - 65;
    // const closestMedicineName = closest(medicineName, medicine[firstLetter])
    const similarWord = [0, ""]
    medicine[firstLetter].map((medicine)=>{
        if(similarWord[0] < cosineSimilarity(medicine, medicineName)){
            similarWord[0] = cosineSimilarity(medicine, medicineName);
            similarWord[1] = medicine
        }
        
    })

    return {similarity: similarWord[0], name: similarWord[1]};
}

  
module.exports = {
    getMedicine
};