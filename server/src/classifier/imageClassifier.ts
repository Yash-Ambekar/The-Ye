import cv from "@techstark/opencv-js";
import jimp from "jimp";
import * as tf from "@tensorflow/tfjs";


export async function imageClassifier(imagePath: string) {
  try {
    console.log("Inside imageClassifier: ", imagePath);
    const resultPromise = new Promise<boolean>((resolve, reject) => {
      const initializeOpenCV = async () => {
        try {
          console.log("Inside CV1");
          const jimpSrc = (await jimp.read(imagePath)).resize(256, 256);
          console.log("Inside CV2");
          const src = cv.matFromImageData(jimpSrc.bitmap);
          const Uintarray = src.data;

          //In the next step we are removing the alpha channel value from the flatten array

          const newImg: number[] = [];
          Array.from(Uintarray, (value: unknown, index: number) => {
            (index + 1) % 4 ? newImg.push((value as number) / 255) : null;
          });
          const imgWithoutAlpha = new Float32Array(newImg);
          console.log("Image without Alpha\n", imgWithoutAlpha);

          //Importing our model from github

          const model = await tf.loadLayersModel(
            "https://raw.githubusercontent.com/Yash-Ambekar/The-Ye/main/server/src/classifier/JS_Converted_Model/model.json"
          );

          const a = tf.tensor(imgWithoutAlpha, [256, 256, 3]);
          console.log("Shape of Final Tensor:", a.shape);
          console.log("Final Tensor:\n", a);

          //Making prediction after adding a wrapping dimension as per the CNN model input dimensions

          const prediction = (
            await (model.predict(tf.expandDims(a, 0)) as tf.Tensor).data()
          )[0];

          const result = prediction > 0.85;
          resolve(result);
        } catch (error) {
          console.error("Error inside CV:", error);
          reject(error);
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
