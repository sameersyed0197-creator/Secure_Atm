// // // // services/geminiService.js - SIMULATED VERSION (NO API CALLS)
// // // export async function compareFaces(currentImage, storedImage) {
// // //   console.log('🎯 [SIMULATED GEMINI] Face Comparison');
  
// // //   try {
// // //     // Log image details for debugging
// // //     const cleanCurrent = currentImage?.replace(/^data:image\/\w+;base64,/, '') || '';
// // //     const cleanStored = storedImage?.replace(/^data:image\/\w+;base64,/, '') || '';
    
// // //     console.log('📊 Image analysis:', {
// // //       currentSize: `${Math.round(cleanCurrent.length / 1024)}KB`,
// // //       storedSize: `${Math.round(cleanStored.length / 1024)}KB`,
// // //       sizeDifference: Math.abs(cleanCurrent.length - cleanStored.length)
// // //     });
    
   
// // //     const DEMO_MODE = "SMART"; // Options: "SMART", "ALWAYS_TRUE", "ALWAYS_FALSE"
    
// // //     let isMatch;
    
// // //     switch(DEMO_MODE) {
// // //       case "ALWAYS_TRUE":
// // //         isMatch = true;
// // //         console.log('✅ [DEMO] Always returning TRUE');
// // //         break;
        
// // //       case "ALWAYS_FALSE":
// // //         isMatch = false;
// // //         console.log('❌ [DEMO] Always returning FALSE');
// // //         break;
        
// // //       case "SMART":
// // //       default:
// // //         // Smart check: Compare image sizes and patterns
// // //         const sizeDiff = Math.abs(cleanCurrent.length - cleanStored.length);
        
// // //         // More intelligent check:
// // //         // 1. Similar size (within 5KB)
// // //         // 2. Both have typical face image size (10-20KB)
// // //         const isSimilarSize = sizeDiff < 5000;
// // //         const isFaceSize = cleanCurrent.length > 10000 && cleanStored.length > 10000;
        
// // //         isMatch = isSimilarSize && isFaceSize;
        
// // //         console.log(`🤖 [SMART] Analysis:`, {
// // //           sizeDiff,
// // //           isSimilarSize,
// // //           isFaceSize,
// // //           verdict: isMatch ? '✅ SAME PERSON' : '❌ DIFFERENT PERSON'
// // //         });
// // //         break;
// // //     }
    
// // //     // Simulate Gemini AI response
// // //     if (isMatch) {
// // //       console.log('🎯 Simulated Gemini Response: "YES - Facial features match"');
// // //     } else {
// // //       console.log('🎯 Simulated Gemini Response: "NO - Faces do not match"');
// // //     }
    
// // //     return isMatch;
    
// // //   } catch (error) {
// // //     console.error('❌ Simulated check error:', error.message);
// // //     return false;
// // //   }
// // // }

// // // // 🚨 REMOVE THE TEST FUNCTION COMPLETELY!
// // // // NO testGemini() calls anywhere!




// // // services/geminiService.js
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // Helper to safely extract JSON from model text
// // function extractJson(text) {
// //   // Try to find a {...} block
// //   const match = text.match(/\{[\s\S]*\}/);
// //   if (!match) throw new Error("No JSON object found in model response");
// //   return JSON.parse(match[0]);
// // }

// // export async function compareFaces(currentImageBase64, storedImageBase64) {
// //   console.log("🎯 [REAL GEMINI] Performing Facial Comparison...");

// //   try {
// //     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// //     const cleanImage = (base64) => base64.split(",").pop();

// //     const prompt = `
// //       You are a strict biometric facial verification engine.

// //       Compare Image 1 and Image 2 and decide if they show the EXACT same person.

// //       Rules:
// //       - Only return "isMatch": true if you are VERY sure (human-identical).
// //       - Small differences like lighting / angle are ok.
// //       - If faces look similar but could be different people, you MUST return "isMatch": false.
// //       - If images are low-quality, blurred, occluded, or uncertain, return "isMatch": false.

// //       Respond ONLY in valid JSON, no extra text:

// //       {
// //         "isMatch": true or false,
// //         "confidence": number from 0 to 100,
// //         "reason": "short explanation"
// //       }
// //     `;

// //     const imageParts = [
// //       {
// //         inlineData: {
// //           data: cleanImage(currentImageBase64),
// //           mimeType: "image/jpeg",
// //         },
// //       },
// //       {
// //         inlineData: {
// //           data: cleanImage(storedImageBase64),
// //           mimeType: "image/jpeg",
// //         },
// //       },
// //     ];

// //     const result = await model.generateContent([prompt, ...imageParts]);
// //     const text = result.response.text();

// //     console.log("🔍 Raw Gemini text:", text);

// //     const analysis = extractJson(text);

// //     console.log(
// //       `🤖 Parsed: isMatch=${analysis.isMatch}, confidence=${analysis.confidence}`
// //     );
// //     console.log(`📝 Reason: ${analysis.reason}`);

// //     // 🔐 HARD THRESHOLD
// //     const MIN_CONFIDENCE = 90;

// //     const isAccepted =
// //       analysis &&
// //       analysis.isMatch === true &&
// //       typeof analysis.confidence === "number" &&
// //       analysis.confidence >= MIN_CONFIDENCE;

// //     if (!isAccepted) {
// //       console.log(
// //         "🚫 Face verification rejected by threshold or model decision."
// //       );
// //     } else {
// //       console.log("✅ Face verification accepted (high confidence).");
// //     }

// //     // Fail closed on any uncertainty
// //     return isAccepted;
// //   } catch (error) {
// //     console.error("❌ Gemini compareFaces error:", error);
// //     // Security: never auto-accept when something goes wrong
// //     return false;
// //   }
// // }
// // // 










// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// function extractJson(text) {
//   const match = text.match(/\{[\s\S]*\}/);
//   if (!match) throw new Error("No JSON object found in model response");
//   return JSON.parse(match[0]);
// }

// export async function compareFaces(currentImageBase64, storedImageBase64) {
//   console.log("🎯 [REAL GEMINI] Performing Facial Comparison...");

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const cleanImage = (base64) => base64.split(",").pop();

//     const prompt = `
// You are doing ATM face verification. Image 1 = current camera photo, Image 2 = registered photo.

// SAME PERSON if:
// • Core facial structure matches (eyes/nose/mouth positions)
// • Minor lighting, angle (<30°), glasses OK
// • Be generous - real photos always have slight differences

// DIFFERENT PERSON only if clearly two distinct faces.

// Return ONLY JSON (no other text):
// {
//   "isMatch": true/false,
//   "confidence": 0-100,
//   "reason": "1 sentence"
// }
// `;

//     const imageParts = [
//       { inlineData: { data: cleanImage(currentImageBase64), mimeType: "image/jpeg" } },
//       { inlineData: { data: cleanImage(storedImageBase64), mimeType: "image/jpeg" } }
//     ];

//     const result = await model.generateContent([prompt, ...imageParts]);
//     const text = result.response.text();

//     console.log("🔍 Raw Gemini:", text);
//     const analysis = extractJson(text);
//     console.log("🤖 Analysis:", analysis);

//     // ✅ FIXED: Realistic threshold
//     const MIN_CONFIDENCE = 70;
//     const isAccepted = analysis?.isMatch === true && 
//                       typeof analysis.confidence === "number" && 
//                       analysis.confidence >= MIN_CONFIDENCE;

//     console.log("✅ DECISION:", isAccepted ? "PASS" : `FAIL (conf: ${analysis.confidence})`);
//     return isAccepted;

//   } catch (error) {
//     console.error("❌ Gemini error:", error.message);
//     return false;
//   }
// }




import * as faceapi from '@vladmandic/face-api';
import * as canvas from 'canvas';
import fetch from 'node-fetch';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;
  
  const MODEL_PATH = './models';
  
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  
  modelsLoaded = true;
  console.log('✅ Face-api models loaded');
}

function base64ToImage(base64String) {
  const cleanBase64 = base64String.split(',').pop();
  const buffer = Buffer.from(cleanBase64, 'base64');
  const img = new Image();
  img.src = buffer;
  return img;
}

export async function compareFaces(currentImageBase64, storedImageBase64) {
  console.log('🎯 [FACE-API] Performing Facial Comparison...');

  try {
    await loadModels();

    const currentImg = base64ToImage(currentImageBase64);
    const storedImg = base64ToImage(storedImageBase64);

    const currentDetection = await faceapi
      .detectSingleFace(currentImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const storedDetection = await faceapi
      .detectSingleFace(storedImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!currentDetection || !storedDetection) {
      console.log('❌ No face detected in one or both images');
      return false;
    }

    const distance = faceapi.euclideanDistance(
      currentDetection.descriptor,
      storedDetection.descriptor
    );

    console.log('🔍 Euclidean Distance:', distance);

    const confidence = Math.round((1 - Math.min(distance, 1)) * 100);
    const DISTANCE_THRESHOLD = 0.6;
    const MIN_CONFIDENCE = 70;

    const isMatch = distance < DISTANCE_THRESHOLD;
    const isAccepted = isMatch && confidence >= MIN_CONFIDENCE;

    console.log('🤖 Analysis:', { isMatch, confidence, distance });
    console.log('✅ DECISION:', isAccepted ? 'PASS' : `FAIL (conf: ${confidence}%)`);

    return isAccepted;

  } catch (error) {
    console.error('❌ Face-api error:', error.message);
    return false;
  }
}
