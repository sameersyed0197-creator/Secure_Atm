// // // // // // services/geminiService.js - SIMULATED VERSION (NO API CALLS)
// // // // // export async function compareFaces(currentImage, storedImage) {
// // // // //   console.log('🎯 [SIMULATED GEMINI] Face Comparison');
  
// // // // //   try {
// // // // //     // Log image details for debugging
// // // // //     const cleanCurrent = currentImage?.replace(/^data:image\/\w+;base64,/, '') || '';
// // // // //     const cleanStored = storedImage?.replace(/^data:image\/\w+;base64,/, '') || '';
    
// // // // //     console.log('📊 Image analysis:', {
// // // // //       currentSize: `${Math.round(cleanCurrent.length / 1024)}KB`,
// // // // //       storedSize: `${Math.round(cleanStored.length / 1024)}KB`,
// // // // //       sizeDifference: Math.abs(cleanCurrent.length - cleanStored.length)
// // // // //     });
    
   
// // // // //     const DEMO_MODE = "SMART"; // Options: "SMART", "ALWAYS_TRUE", "ALWAYS_FALSE"
    
// // // // //     let isMatch;
    
// // // // //     switch(DEMO_MODE) {
// // // // //       case "ALWAYS_TRUE":
// // // // //         isMatch = true;
// // // // //         console.log('✅ [DEMO] Always returning TRUE');
// // // // //         break;
        
// // // // //       case "ALWAYS_FALSE":
// // // // //         isMatch = false;
// // // // //         console.log('❌ [DEMO] Always returning FALSE');
// // // // //         break;
        
// // // // //       case "SMART":
// // // // //       default:
// // // // //         // Smart check: Compare image sizes and patterns
// // // // //         const sizeDiff = Math.abs(cleanCurrent.length - cleanStored.length);
        
// // // // //         // More intelligent check:
// // // // //         // 1. Similar size (within 5KB)
// // // // //         // 2. Both have typical face image size (10-20KB)
// // // // //         const isSimilarSize = sizeDiff < 5000;
// // // // //         const isFaceSize = cleanCurrent.length > 10000 && cleanStored.length > 10000;
        
// // // // //         isMatch = isSimilarSize && isFaceSize;
        
// // // // //         console.log(`🤖 [SMART] Analysis:`, {
// // // // //           sizeDiff,
// // // // //           isSimilarSize,
// // // // //           isFaceSize,
// // // // //           verdict: isMatch ? '✅ SAME PERSON' : '❌ DIFFERENT PERSON'
// // // // //         });
// // // // //         break;
// // // // //     }
    
// // // // //     // Simulate Gemini AI response
// // // // //     if (isMatch) {
// // // // //       console.log('🎯 Simulated Gemini Response: "YES - Facial features match"');
// // // // //     } else {
// // // // //       console.log('🎯 Simulated Gemini Response: "NO - Faces do not match"');
// // // // //     }
    
// // // // //     return isMatch;
    
// // // // //   } catch (error) {
// // // // //     console.error('❌ Simulated check error:', error.message);
// // // // //     return false;
// // // // //   }
// // // // // }

// // // // // // 🚨 REMOVE THE TEST FUNCTION COMPLETELY!
// // // // // // NO testGemini() calls anywhere!




// // // // // services/geminiService.js
// // // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // // // Helper to safely extract JSON from model text
// // // // function extractJson(text) {
// // // //   // Try to find a {...} block
// // // //   const match = text.match(/\{[\s\S]*\}/);
// // // //   if (!match) throw new Error("No JSON object found in model response");
// // // //   return JSON.parse(match[0]);
// // // // }

// // // // export async function compareFaces(currentImageBase64, storedImageBase64) {
// // // //   console.log("🎯 [REAL GEMINI] Performing Facial Comparison...");

// // // //   try {
// // // //     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // // //     const cleanImage = (base64) => base64.split(",").pop();

// // // //     const prompt = `
// // // //       You are a strict biometric facial verification engine.

// // // //       Compare Image 1 and Image 2 and decide if they show the EXACT same person.

// // // //       Rules:
// // // //       - Only return "isMatch": true if you are VERY sure (human-identical).
// // // //       - Small differences like lighting / angle are ok.
// // // //       - If faces look similar but could be different people, you MUST return "isMatch": false.
// // // //       - If images are low-quality, blurred, occluded, or uncertain, return "isMatch": false.

// // // //       Respond ONLY in valid JSON, no extra text:

// // // //       {
// // // //         "isMatch": true or false,
// // // //         "confidence": number from 0 to 100,
// // // //         "reason": "short explanation"
// // // //       }
// // // //     `;

// // // //     const imageParts = [
// // // //       {
// // // //         inlineData: {
// // // //           data: cleanImage(currentImageBase64),
// // // //           mimeType: "image/jpeg",
// // // //         },
// // // //       },
// // // //       {
// // // //         inlineData: {
// // // //           data: cleanImage(storedImageBase64),
// // // //           mimeType: "image/jpeg",
// // // //         },
// // // //       },
// // // //     ];

// // // //     const result = await model.generateContent([prompt, ...imageParts]);
// // // //     const text = result.response.text();

// // // //     console.log("🔍 Raw Gemini text:", text);

// // // //     const analysis = extractJson(text);

// // // //     console.log(
// // // //       `🤖 Parsed: isMatch=${analysis.isMatch}, confidence=${analysis.confidence}`
// // // //     );
// // // //     console.log(`📝 Reason: ${analysis.reason}`);

// // // //     // 🔐 HARD THRESHOLD
// // // //     const MIN_CONFIDENCE = 90;

// // // //     const isAccepted =
// // // //       analysis &&
// // // //       analysis.isMatch === true &&
// // // //       typeof analysis.confidence === "number" &&
// // // //       analysis.confidence >= MIN_CONFIDENCE;

// // // //     if (!isAccepted) {
// // // //       console.log(
// // // //         "🚫 Face verification rejected by threshold or model decision."
// // // //       );
// // // //     } else {
// // // //       console.log("✅ Face verification accepted (high confidence).");
// // // //     }

// // // //     // Fail closed on any uncertainty
// // // //     return isAccepted;
// // // //   } catch (error) {
// // // //     console.error("❌ Gemini compareFaces error:", error);
// // // //     // Security: never auto-accept when something goes wrong
// // // //     return false;
// // // //   }
// // // // }
// // // // // 










// // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // function extractJson(text) {
// // //   const match = text.match(/\{[\s\S]*\}/);
// // //   if (!match) throw new Error("No JSON object found in model response");
// // //   return JSON.parse(match[0]);
// // // }

// // // export async function compareFaces(currentImageBase64, storedImageBase64) {
// // //   console.log("🎯 [REAL GEMINI] Performing Facial Comparison...");

// // //   try {
// // //     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// // //     const cleanImage = (base64) => base64.split(",").pop();

// // //     const prompt = `
// // // You are doing ATM face verification. Image 1 = current camera photo, Image 2 = registered photo.

// // // SAME PERSON if:
// // // • Core facial structure matches (eyes/nose/mouth positions)
// // // • Minor lighting, angle (<30°), glasses OK
// // // • Be generous - real photos always have slight differences

// // // DIFFERENT PERSON only if clearly two distinct faces.

// // // Return ONLY JSON (no other text):
// // // {
// // //   "isMatch": true/false,
// // //   "confidence": 0-100,
// // //   "reason": "1 sentence"
// // // }
// // // `;

// // //     const imageParts = [
// // //       { inlineData: { data: cleanImage(currentImageBase64), mimeType: "image/jpeg" } },
// // //       { inlineData: { data: cleanImage(storedImageBase64), mimeType: "image/jpeg" } }
// // //     ];

// // //     const result = await model.generateContent([prompt, ...imageParts]);
// // //     const text = result.response.text();

// // //     console.log("🔍 Raw Gemini:", text);
// // //     const analysis = extractJson(text);
// // //     console.log("🤖 Analysis:", analysis);

// // //     // ✅ FIXED: Realistic threshold
// // //     const MIN_CONFIDENCE = 70;
// // //     const isAccepted = analysis?.isMatch === true && 
// // //                       typeof analysis.confidence === "number" && 
// // //                       analysis.confidence >= MIN_CONFIDENCE;

// // //     console.log("✅ DECISION:", isAccepted ? "PASS" : `FAIL (conf: ${analysis.confidence})`);
// // //     return isAccepted;

// // //   } catch (error) {
// // //     console.error("❌ Gemini error:", error.message);
// // //     return false;
// // //   }
// // // }




// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // function extractJson(text) {
// //   const match = text.match(/\{[\s\S]*\}/);
// //   if (!match) throw new Error("No JSON object found in model response");
// //   return JSON.parse(match[0]);
// // }

// // export async function compareFaces(currentImageBase64, storedImageBase64) {
// //   console.log("🎯 [GEMINI] Performing Facial Comparison...");

// //   try {
// //     // Validate inputs
// //     if (!currentImageBase64 || !storedImageBase64) {
// //       throw new Error("Missing image data");
// //     }

// //     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-exp" });
// //     const cleanImage = (base64) => base64.split(",").pop();

// //     const prompt = `
// // You are doing ATM face verification. Image 1 = current camera photo, Image 2 = registered photo.

// // SAME PERSON if:
// // • Core facial structure matches (eyes/nose/mouth positions)
// // • Minor lighting, angle (<30°), glasses OK
// // • Be generous - real photos always have slight differences

// // DIFFERENT PERSON only if clearly two distinct faces.

// // Return ONLY JSON (no other text):
// // {
// //   "isMatch": true/false,
// //   "confidence": 0-100,
// //   "reason": "1 sentence"
// // }
// // `;

// //     const imageParts = [
// //       { inlineData: { data: cleanImage(currentImageBase64), mimeType: "image/jpeg" } },
// //       { inlineData: { data: cleanImage(storedImageBase64), mimeType: "image/jpeg" } }
// //     ];

// //     const result = await model.generateContent([prompt, ...imageParts]);
// //     const text = result.response.text();

// //     console.log("🔍 Raw Gemini:", text);
// //     const analysis = extractJson(text);
// //     console.log("🤖 Analysis:", analysis);

// //     // Validate response structure
// //     if (typeof analysis.isMatch !== 'boolean' || typeof analysis.confidence !== 'number') {
// //       throw new Error("Invalid response format from Gemini");
// //     }

// //     const MIN_CONFIDENCE = 70;
// //     const isAccepted = analysis.isMatch === true && analysis.confidence >= MIN_CONFIDENCE;

// //     console.log("✅ DECISION:", isAccepted ? "PASS" : `FAIL (conf: ${analysis.confidence}%)`);
// //     console.log("📝 Reason:", analysis.reason);
    
// //     return isAccepted;

// //   } catch (error) {
// //     console.error("❌ Gemini error:", error.message);
    
// //     // Log more details for debugging
// //     if (error.response) {
// //       console.error("API Response Error:", error.response);
// //     }
    
// //     return false;
// //   }
// // }
















// import cv from 'opencv4nodejs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load face detection classifier once
// const classifierPath = path.join(__dirname, '../models/haarcascade_frontalface_default.xml');
// let faceClassifier;

// try {
//   faceClassifier = new cv.CascadeClassifier(classifierPath);
// } catch (error) {
//   console.error('❌ Failed to load face classifier:', error.message);
// }

// /**
//  * Convert base64 image to OpenCV Mat
//  */
// function base64ToMat(base64String) {
//   const cleanBase64 = base64String.split(',').pop();
//   const buffer = Buffer.from(cleanBase64, 'base64');
//   return cv.imdecode(buffer);
// }

// /**
//  * Detect face in image and return face region
//  */
// function detectFace(mat) {
//   // Convert to grayscale for better detection
//   const gray = mat.bgrToGray();
  
//   // Detect faces
//   const faces = faceClassifier.detectMultiScale(gray, {
//     scaleFactor: 1.1,
//     minNeighbors: 5,
//     minSize: new cv.Size(30, 30)
//   });

//   if (faces.objects.length === 0) {
//     return null;
//   }

//   // Return first detected face
//   const face = faces.objects[0];
//   return gray.getRegion(face);
// }

// /**
//  * Calculate histogram-based similarity
//  */
// function calculateHistogramSimilarity(face1, face2) {
//   // Resize faces to same size
//   const size = new cv.Size(100, 100);
//   const resized1 = face1.resize(size.height, size.width);
//   const resized2 = face2.resize(size.height, size.width);

//   // Calculate histograms
//   const histBins = [256];
//   const histRanges = [0, 256];
  
//   const hist1 = cv.calcHist(resized1, [{ channel: 0, bins: histBins[0], ranges: histRanges }]);
//   const hist2 = cv.calcHist(resized2, [{ channel: 0, bins: histBins[0], ranges: histRanges }]);

//   // Normalize histograms
//   const norm1 = hist1.normalize(0, 1, cv.NORM_MINMAX);
//   const norm2 = hist2.normalize(0, 1, cv.NORM_MINMAX);

//   // Compare using correlation method
//   return cv.compareHist(norm1, norm2, cv.HISTCMP_CORREL);
// }

// /**
//  * Calculate template matching similarity
//  */
// function calculateTemplateSimilarity(face1, face2) {
//   // Resize to same size
//   const size = new cv.Size(100, 100);
//   const resized1 = face1.resize(size.height, size.width);
//   const resized2 = face2.resize(size.height, size.width);

//   // Template matching
//   const result = resized1.matchTemplate(resized2, cv.TM_CCOEFF_NORMED);
//   const minMax = result.minMaxLoc();
  
//   return minMax.maxVal;
// }

// /**
//  * Calculate SSIM (Structural Similarity Index)
//  */
// function calculateSSIM(face1, face2) {
//   // Resize to same size
//   const size = new cv.Size(100, 100);
//   const resized1 = face1.resize(size.height, size.width);
//   const resized2 = face2.resize(size.height, size.width);

//   // Convert to float
//   const f1 = resized1.convertTo(cv.CV_32F);
//   const f2 = resized2.convertTo(cv.CV_32F);

//   // Calculate mean and variance
//   const mean1 = f1.mean();
//   const mean2 = f2.mean();
  
//   const stdDev1 = f1.stdDev();
//   const stdDev2 = f2.stdDev();

//   // Simple SSIM approximation
//   const c1 = 6.5025;
//   const c2 = 58.5225;
  
//   const numerator = (2 * mean1 * mean2 + c1) * (2 * stdDev1 * stdDev2 + c2);
//   const denominator = (mean1 * mean1 + mean2 * mean2 + c1) * (stdDev1 * stdDev1 + stdDev2 * stdDev2 + c2);
  
//   return numerator / denominator;
// }

// /**
//  * Compare two faces using OpenCV
//  */
// export async function compareFaces(currentImageBase64, storedImageBase64) {
//   console.log("🎯 [OPENCV] Performing Facial Comparison...");

//   try {
//     // Validate inputs
//     if (!currentImageBase64 || !storedImageBase64) {
//       throw new Error("Missing image data");
//     }

//     if (!faceClassifier) {
//       throw new Error("Face classifier not loaded");
//     }

//     // Convert base64 to Mat
//     const currentMat = base64ToMat(currentImageBase64);
//     const storedMat = base64ToMat(storedImageBase64);

//     console.log("📊 Image sizes:", {
//       current: `${currentMat.rows}x${currentMat.cols}`,
//       stored: `${storedMat.rows}x${storedMat.cols}`
//     });

//     // Detect faces
//     const currentFace = detectFace(currentMat);
//     const storedFace = detectFace(storedMat);

//     if (!currentFace || !storedFace) {
//       console.log("❌ No face detected in one or both images");
//       return false;
//     }

//     console.log("✅ Faces detected in both images");

//     // Calculate multiple similarity metrics
//     const histogramSimilarity = calculateHistogramSimilarity(currentFace, storedFace);
//     const templateSimilarity = calculateTemplateSimilarity(currentFace, storedFace);
//     const ssimSimilarity = calculateSSIM(currentFace, storedFace);

//     console.log("🔍 Similarity Metrics:", {
//       histogram: histogramSimilarity.toFixed(3),
//       template: templateSimilarity.toFixed(3),
//       ssim: ssimSimilarity.toFixed(3)
//     });

//     // Combined weighted score
//     const weightedScore = (
//       histogramSimilarity * 0.3 +
//       templateSimilarity * 0.4 +
//       ssimSimilarity * 0.3
//     );

//     const confidence = Math.round(weightedScore * 100);
    
//     // Determine if match
//     const SIMILARITY_THRESHOLD = 0.70; // 70% similarity
//     const isMatch = weightedScore >= SIMILARITY_THRESHOLD;

//     const analysis = {
//       isMatch,
//       confidence,
//       reason: isMatch 
//         ? "Facial features match within acceptable threshold"
//         : "Facial features do not match sufficiently",
//       metrics: {
//         histogram: histogramSimilarity,
//         template: templateSimilarity,
//         ssim: ssimSimilarity
//       }
//     };

//     console.log("🤖 Analysis:", analysis);

//     const MIN_CONFIDENCE = 70;
//     const isAccepted = isMatch && confidence >= MIN_CONFIDENCE;

//     console.log("✅ DECISION:", isAccepted ? "PASS" : `FAIL (conf: ${confidence}%)`);
//     console.log("📝 Reason:", analysis.reason);

//     return isAccepted;

//   } catch (error) {
//     console.error("❌ OpenCV error:", error.message);
//     return false;
//   }
// }

















// backend/services/faceComparison.js

export async function compareFaces(currentImageBase64, storedImageBase64) {
  console.log("🎯 [Face++] Performing Facial Comparison...");

  try {
    if (!currentImageBase64 || !storedImageBase64) {
      throw new Error("Missing image data");
    }

    const cleanBase64 = (b64) => b64.split(',').pop();

    // Create form data
    const formData = new URLSearchParams();
    formData.append('api_key', process.env.FACEPP_API_KEY);
    formData.append('api_secret', process.env.FACEPP_API_SECRET);
    formData.append('image_base64_1', cleanBase64(currentImageBase64));
    formData.append('image_base64_2', cleanBase64(storedImageBase64));

    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      throw new Error(`Face++ API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error_message) {
      throw new Error(data.error_message);
    }

    const confidence = Math.round(data.confidence);
    const isMatch = confidence >= 70;

    console.log('🔍 Raw Face++ Response:', {
      confidence: data.confidence,
      threshold: data.thresholds
    });
    console.log('🤖 Analysis:', { confidence, isMatch });
    console.log('✅ DECISION:', isMatch ? 'PASS' : `FAIL (conf: ${confidence}%)`);
    
    return isMatch;

  } catch (error) {
    console.error('❌ Face++ error:', error.message);
    return false;
  }
}
