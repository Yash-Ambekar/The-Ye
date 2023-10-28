import cv from "@techstark/opencv-js";
import jimp from "jimp";
import * as tf from "@tensorflow/tfjs";

let loadedModel: tf.LayersModel;
export async function loadModel() {
  try {
    loadedModel = await tf.loadLayersModel(
      "https://raw.githubusercontent.com/Yash-Ambekar/The-Ye/main/server/src/classifier/JS_Converted_Model/model.json"
    );
    console.log("Classifier loaded!")
  } catch (err) {
    console.error("Failed to load the classifier: ", err);
  }
}
export async function imageClassifier(imagePath: string, retries = 0) {
  try {
    const resultPromise = new Promise<boolean>((resolve, reject) => {
      const initializeOpenCV = async () => {
        try {
          const jimpLoadImage = Date.now();
          const jimpSrc = (await jimp.read(imagePath)).resize(256, 256);
          const src = cv.matFromImageData(jimpSrc.bitmap);
          const jimpCVTime = Date.now() - jimpLoadImage;
          console.log("Jimp Loader time: " + jimpCVTime + " ms")
          const Uintarray = src.data;

          //In the next step we are removing the alpha channel value from the flatten array

          const newImg: number[] = [];
          Array.from(Uintarray, (value: unknown, index: number) => {
            (index + 1) % 4 ? newImg.push((value as number) / 255) : null;
          });
          const imgWithoutAlpha = new Float32Array(newImg);

          //Importing our model from github
          const startTimeForLoading = Date.now();
          const model = loadedModel;
          const timeForLoadingModel = Date.now() - startTimeForLoading;
          console.log("Time taken for loading model: " + timeForLoadingModel + " ms")

          const a = tf.tensor(imgWithoutAlpha, [256, 256, 3]);
          console.log("Shape of Final Tensor:", a.shape);

          //Making prediction after adding a wrapping dimension as per the CNN model input dimensions
          const predictionStart = Date.now();
          const prediction = (
            await (model.predict(tf.expandDims(a, 0)) as tf.Tensor).data()
          )[0];
          const timeTakenForPrediction = Date.now() - predictionStart;
          console.log("Time taken for prediction: " + timeTakenForPrediction + " ms")
          const result = prediction > 0.85;
          resolve(result);
        } catch (error) {
          if (retries >= 5) {
            reject(error);
            throw error;
          }
          await imageClassifier(imagePath);
        }
      };

      if (typeof cv.onRuntimeInitialized === "function") {
        initializeOpenCV();
      } else {
        cv["onRuntimeInitialized"] = initializeOpenCV;
      }
    });

    return resultPromise;
  } catch (err) {
    console.error(`Image Classifier error: ${err}`);
    throw err; // Rethrow the error to be handled by the caller
  }
}



export default {
  imageClassifier,
};
