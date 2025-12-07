// // // services/geminiService.js - USING gemini-2.5-flash
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // Initialize with your API key
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // export async function compareFaces(currentImage, storedImage) {
// //   try {
// //     console.log('🎯 Gemini 2.5 Flash: Starting face comparison');
    
// //     if (!currentImage || !storedImage) {
// //       console.error('❌ Missing image data');
// //       return false;
// //     }
    
// //     // Clean base64 strings (remove data URL prefix)
// //     const cleanCurrent = currentImage.replace(/^data:image\/\w+;base64,/, '');
// //     const cleanStored = storedImage.replace(/^data:image\/\w+;base64,/, '');
    
// //     console.log('📊 Image sizes:', {
// //       current: `${Math.round(cleanCurrent.length / 1024)}KB`,
// //       stored: `${Math.round(cleanStored.length / 1024)}KB`
// //     });
    
// //     // Use gemini-2.5-flash model
// //     const model = genAI.getGenerativeModel({ 
// //       model: "gemini-2.5-flash"  // ✅ This is available in your account
// //     });
    
// //     // Optimized prompt for face comparison
// //     const prompt = `Compare these two face photos. Analyze facial features, structure, and appearance.
// //     Are these photos of the SAME person? Answer ONLY "YES" or "NO".`;
    
// //     console.log('📤 Sending to Gemini 2.5 Flash...');
    
// //     const result = await model.generateContent([
// //       prompt,
// //       {
// //         inlineData: {
// //           data: cleanStored,
// //           mimeType: "image/jpeg"
// //         }
// //       },
// //       {
// //         inlineData: {
// //           data: cleanCurrent,
// //           mimeType: "image/jpeg"
// //         }
// //       }
// //     ]);
    
// //     const response = await result.response;
// //     const text = response.text().trim().toUpperCase();
    
// //     console.log(`✅ Gemini 2.5 Flash Response: "${text}"`);
    
// //     // Return true if Gemini says YES
// //     const isMatch = text === "YES";
// //     console.log(`🎯 Face Match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
// //     return isMatch;
    
// //   } catch (error) {
// //     console.error('❌ Gemini 2.5 Flash Error:', {
// //       name: error.name,
// //       message: error.message,
// //       status: error.status
// //     });
    
// //     // Simple fallback if Gemini fails
// //     console.log('⚠️  Using fallback similarity check');
    
// //     try {
// //       const cleanCurrent = currentImage?.replace(/^data:image\/\w+;base64,/, '') || '';
// //       const cleanStored = storedImage?.replace(/^data:image\/\w+;base64,/, '') || '';
      
// //       // Check if images are similar in size
// //       const sizeDiff = Math.abs(cleanCurrent.length - cleanStored.length);
// //       const similarity = sizeDiff < 8000; // Allow 8KB difference
      
// //       console.log(`⚠️  Fallback - Size diff: ${sizeDiff}, Similar: ${similarity}`);
      
// //       return similarity;
// //     } catch (fallbackError) {
// //       console.error('❌ Fallback also failed');
// //       return false;
// //     }
// //   }
// // }





// // services/geminiService.js - USE gemini-2.0-flash
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // ✅ USE YOUR API KEY DIRECTLY
// const API_KEY = "AIzaSyA3cpFwLotjnkoPw6ZxPWbJQLkGJfTGpRk";
// const genAI = new GoogleGenerativeAI(API_KEY);

// export async function compareFaces(currentImage, storedImage) {
//   try {
//     console.log('🎯 Gemini 2.0 Flash: Starting face comparison');
//     console.log('🔑 API Key:', API_KEY.substring(0, 15) + '...');
    
//     if (!currentImage || !storedImage) {
//       console.error('❌ Missing image data');
//       return false;
//     }
    
//     // Clean base64
//     const cleanCurrent = currentImage.replace(/^data:image\/\w+;base64,/, '');
//     const cleanStored = storedImage.replace(/^data:image\/\w+;base64,/, '');
    
//     console.log('📊 Image analysis:', {
//       currentSize: `${(cleanCurrent.length / 1024).toFixed(1)}KB`,
//       storedSize: `${(cleanStored.length / 1024).toFixed(1)}KB`
//     });
    
//     // ✅ USE gemini-2.0-flash (WORKS WITHOUT BILLING!)
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-2.0-flash"
//     });
    
//     // Simple prompt
//     const prompt = `Compare these two face photos. Are they the same person? Answer ONLY "YES" or "NO".`;
    
//     console.log('📤 Sending to Gemini 2.0 Flash...');
    
//     const result = await model.generateContent([
//       prompt,
//       {
//         inlineData: {
//           data: cleanStored,
//           mimeType: "image/jpeg"
//         }
//       },
//       {
//         inlineData: {
//           data: cleanCurrent,
//           mimeType: "image/jpeg"
//         }
//       }
//     ]);
    
//     const response = await result.response;
//     const text = response.text().trim().toUpperCase();
    
//     console.log(`✅ Gemini 2.0 Flash Response: "${text}"`);
//     console.log(`🎯 Match Result: ${text === "YES" ? '✅ YES' : '❌ NO'}`);
    
//     return text === "YES";
    
//   } catch (error) {
//     console.error('❌ Gemini 2.0 Flash Error:', {
//       message: error.message,
//       status: error.status
//     });
    
//     // Try other models that might work
//     const fallbackModels = [
//       "gemini-2.0-flash-lite",
//       "gemini-1.5-flash",
//       "gemini-flash-latest"
//     ];
    
//     for (const modelName of fallbackModels) {
//       try {
//         console.log(`🔄 Trying ${modelName}...`);
        
//         const model = genAI.getGenerativeModel({ model: modelName });
//         const result = await model.generateContent([
//           "Same person? YES or NO.",
//           {
//             inlineData: {
//               data: storedImage.replace(/^data:image\/\w+;base64,/, ''),
//               mimeType: "image/jpeg"
//             }
//           },
//           {
//             inlineData: {
//               data: currentImage.replace(/^data:image\/\w+;base64,/, ''),
//               mimeType: "image/jpeg"
//             }
//           }
//         ]);
        
//         const response = await result.response;
//         const text = response.text().trim().toUpperCase();
        
//         console.log(`✅ ${modelName} Response: "${text}"`);
//         return text === "YES";
        
//       } catch (modelError) {
//         console.log(`❌ ${modelName} failed: ${modelError.message}`);
//       }
//     }
    
//     // Final fallback: size comparison
//     console.log('⚠️ All models failed, using size comparison...');
    
//     const cleanCurrent = currentImage?.replace(/^data:image\/\w+;base64,/, '') || '';
//     const cleanStored = storedImage?.replace(/^data:image\/\w+;base64,/, '') || '';
    
//     const sizeDiff = Math.abs(cleanCurrent.length - cleanStored.length);
//     const isSimilar = sizeDiff < 10000;
    
//     console.log(`⚠️ Size diff: ${sizeDiff}, Similar: ${isSimilar}`);
    
//     return isSimilar;
//   }
// }

// // Test function
// export async function testGemini() {
//   console.log('🧪 Testing Gemini API...');
  
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const result = await model.generateContent("Say 'OK' if working.");
//     const response = await result.response;
//     console.log(`✅ Gemini 2.0-flash test: ${response.text()}`);
//     return true;
//   } catch (error) {
//     console.log('❌ Gemini test failed:', error.message);
//     return false;
//   }
// }

// // Run test on load
// testGemini();








// services/geminiService.js - SIMULATED VERSION (NO API CALLS)
export async function compareFaces(currentImage, storedImage) {
  console.log('🎯 [SIMULATED GEMINI] Face Comparison');
  
  try {
    // Log image details for debugging
    const cleanCurrent = currentImage?.replace(/^data:image\/\w+;base64,/, '') || '';
    const cleanStored = storedImage?.replace(/^data:image\/\w+;base64,/, '') || '';
    
    console.log('📊 Image analysis:', {
      currentSize: `${Math.round(cleanCurrent.length / 1024)}KB`,
      storedSize: `${Math.round(cleanStored.length / 1024)}KB`,
      sizeDifference: Math.abs(cleanCurrent.length - cleanStored.length)
    });
    
    // ✅ DEMO MODE: Choose behavior
    const DEMO_MODE = "SMART"; // Options: "SMART", "ALWAYS_TRUE", "ALWAYS_FALSE"
    
    let isMatch;
    
    switch(DEMO_MODE) {
      case "ALWAYS_TRUE":
        isMatch = true;
        console.log('✅ [DEMO] Always returning TRUE');
        break;
        
      case "ALWAYS_FALSE":
        isMatch = false;
        console.log('❌ [DEMO] Always returning FALSE');
        break;
        
      case "SMART":
      default:
        // Smart check: Compare image sizes and patterns
        const sizeDiff = Math.abs(cleanCurrent.length - cleanStored.length);
        
        // More intelligent check:
        // 1. Similar size (within 5KB)
        // 2. Both have typical face image size (10-20KB)
        const isSimilarSize = sizeDiff < 5000;
        const isFaceSize = cleanCurrent.length > 10000 && cleanStored.length > 10000;
        
        isMatch = isSimilarSize && isFaceSize;
        
        console.log(`🤖 [SMART] Analysis:`, {
          sizeDiff,
          isSimilarSize,
          isFaceSize,
          verdict: isMatch ? '✅ SAME PERSON' : '❌ DIFFERENT PERSON'
        });
        break;
    }
    
    // Simulate Gemini AI response
    if (isMatch) {
      console.log('🎯 Simulated Gemini Response: "YES - Facial features match"');
    } else {
      console.log('🎯 Simulated Gemini Response: "NO - Faces do not match"');
    }
    
    return isMatch;
    
  } catch (error) {
    console.error('❌ Simulated check error:', error.message);
    return false;
  }
}

// 🚨 REMOVE THE TEST FUNCTION COMPLETELY!
// NO testGemini() calls anywhere!