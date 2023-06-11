import cv from "@techstark/opencv-js";
import jimp from "jimp";
import * as tf from '@tensorflow/tfjs'

export async function imageReader() {
  cv["onRuntimeInitialized"] = async () => {
    const jimpSrc = await jimp.read("./Donald_Trump.jpg");
    var src = cv.matFromImageData(jimpSrc.bitmap);
    console.log(src);
    const model = await tf.loadLayersModel('./JS_Converted_Model/model.json'); 
    console.log(model)
  };
}

imageReader();
