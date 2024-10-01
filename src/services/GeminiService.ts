const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(image) {
    const mimeType = image.match(/^data:image\/([^;]+);base64,/);

    return {
        inlineData: {
            data: image.replace(/^data:image\/[^;]+;base64,/, ''),
            mimeType: mimeType ? `image/${mimeType[1]}` : "image/jpeg"
        },
    };
}

export async function gemini(prompt:string, image:string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

       const imageParts = [
        fileToGenerativePart(image),
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return response.text();
}