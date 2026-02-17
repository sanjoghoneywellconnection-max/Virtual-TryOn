
import { GoogleGenAI } from "@google/genai";
import { Product, UserClone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

type Angle = 'front' | 'back' | 'threeQuarter';

/**
 * Uses Gemini 2.5 Flash Image to "edit" the user's base image,
 * putting the selected product on the user's clone at a specific angle.
 */
export async function generateTryOnImage(clone: UserClone, product: Product, angle: Angle = 'front'): Promise<string> {
  const sourceImage = clone[angle];
  if (!sourceImage) throw new Error(`${angle} shot required for try-on`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: sourceImage.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `STRICT GENDER ENFORCEMENT: This user is ${clone.gender}. 
            RE-GENERATE this image with the user wearing this specific ${clone.gender}'s fashion item: ${product.name}. 
            Product Details: ${product.description}. 
            Category: ${product.category}.
            View Angle: ${angle === 'front' ? 'Frontal' : angle === 'back' ? 'Back' : 'Three-quarter side'}.

            DIRECTIONS:
            1. Maintain the user's EXACT face (if visible), physical features, hair, and body structure from the provided image.
            2. The item should be tailored perfectly to their ${clone.analysis || 'proportional'} build.
            3. Ensure the styling is appropriate for a high-end ${clone.gender}'s fashion catalog.
            4. IMPORTANT: Ensure the FULL body and the entire garment are visible. Do not crop the head or feet.
            5. LIGHTING: Professional studio lighting.
            DO NOT change the user's gender or facial identity.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Error generating try-on image:", error);
    return product.originalImageUrl;
  }
}

/**
 * Analyzes body shots to extract features for better AI fit.
 */
export async function analyzeCloneImages(clone: UserClone): Promise<string> {
  if (!clone.front) return "Standard fit";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: clone.front.split(',')[1],
            mimeType: 'image/jpeg',
          },
        },
        { text: `Analyze this ${clone.gender}'s body shot. Describe their build and proportions in 10 words to help an AI tailor clothes to them. Focus on shoulder width, torso length, and height.` },
      ],
    },
  });
  return response.text || "Athletic, balanced proportions, medium height";
}
