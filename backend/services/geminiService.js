// // services/geminiService.js - SIMULATED VERSION (NO API CALLS)
// export async function compareFaces(currentImage, storedImage) {
//   console.log('🎯 [SIMULATED GEMINI] Face Comparison');
  
//   try {
//     // Log image details for debugging
//     const cleanCurrent = currentImage?.replace(/^data:image\/\w+;base64,/, '') || '';
//     const cleanStored = storedImage?.replace(/^data:image\/\w+;base64,/, '') || '';
    
//     console.log('📊 Image analysis:', {
//       currentSize: `${Math.round(cleanCurrent.length / 1024)}KB`,
//       storedSize: `${Math.round(cleanStored.length / 1024)}KB`,
//       sizeDifference: Math.abs(cleanCurrent.length - cleanStored.length)
//     });
    
   
//     const DEMO_MODE = "SMART"; // Options: "SMART", "ALWAYS_TRUE", "ALWAYS_FALSE"
    
//     let isMatch;
    
//     switch(DEMO_MODE) {
//       case "ALWAYS_TRUE":
//         isMatch = true;
//         console.log('✅ [DEMO] Always returning TRUE');
//         break;
        
//       case "ALWAYS_FALSE":
//         isMatch = false;
//         console.log('❌ [DEMO] Always returning FALSE');
//         break;
        
//       case "SMART":
//       default:
//         // Smart check: Compare image sizes and patterns
//         const sizeDiff = Math.abs(cleanCurrent.length - cleanStored.length);
        
//         // More intelligent check:
//         // 1. Similar size (within 5KB)
//         // 2. Both have typical face image size (10-20KB)
//         const isSimilarSize = sizeDiff < 5000;
//         const isFaceSize = cleanCurrent.length > 10000 && cleanStored.length > 10000;
        
//         isMatch = isSimilarSize && isFaceSize;
        
//         console.log(`🤖 [SMART] Analysis:`, {
//           sizeDiff,
//           isSimilarSize,
//           isFaceSize,
//           verdict: isMatch ? '✅ SAME PERSON' : '❌ DIFFERENT PERSON'
//         });
//         break;
//     }
    
//     // Simulate Gemini AI response
//     if (isMatch) {
//       console.log('🎯 Simulated Gemini Response: "YES - Facial features match"');
//     } else {
//       console.log('🎯 Simulated Gemini Response: "NO - Faces do not match"');
//     }
    
//     return isMatch;
    
//   } catch (error) {
//     console.error('❌ Simulated check error:', error.message);
//     return false;
//   }
// }

// // 🚨 REMOVE THE TEST FUNCTION COMPLETELY!
// // NO testGemini() calls anywhere!



import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key
const genAI = new GoogleGenerativeAI("AIzaSyCR3GYoRahUVFgsAnBUV_5zRDuCxEBzytM");

export async function compareFaces(currentImageBase64, storedImageBase64) {
  console.log('🎯 [REAL GEMINI] Performing Facial Comparison...');

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Helper to strip metadata (e.g., "data:image/jpeg;base64,") if present
    const cleanImage = (base64) => base64.split(',').pop();

    const prompt = `
      Task: Biometric Facial Verification.
      Compare the person in Image 1 with the person in Image 2.
      Are they the EXACT same individual? 
      
      Respond in this exact JSON format:
      {
        "isMatch": true/false,
        "confidence": 0-100,
        "reason": "short explanation"
      }
    `;

    const imageParts = [
      {
        inlineData: {
          data: cleanImage(currentImageBase64),
          mimeType: "image/jpeg"
        }
      },
      {
        inlineData: {
          data: cleanImage(storedImageBase64),
          mimeType: "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the JSON response from Gemini
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanJson);

    console.log(`🤖 Analysis Result: ${analysis.isMatch ? '✅ MATCH' : '❌ NO MATCH'} (${analysis.confidence}%)`);
    console.log(`📝 Reason: ${analysis.reason}`);

    return analysis.isMatch;

  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    // Fallback: Default to false for security if API fails
    return false;
  }
}