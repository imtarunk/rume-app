import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Parse the incoming form data
  const formData = await request.formData();
  const file = formData.get("resume");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: "No resume file uploaded." },
      { status: 400 }
    );
  }

  // The prompt to guide the Gemini model
  const prompt = `
    Extract the following information from the attached resume and return it as a **valid JSON object**.  
**Do not include any text before or after the JSON object.**

The JSON should have the following structure:

- name: string  
- contact: object with the following properties:
  - email: string  
  - phone: string  
  - linkedin: string  
  - github: string  
- summary: string  
- work_experience: array of objects, each with:
  - company: string  
  - role: string  
  - duration: string  
- education: array of objects, each with:
  - degree: string  
  - university: string  
  - graduation_year: string  
- skills: array of strings

  `;

  try {
    // Read file as ArrayBuffer and convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "application/octet-stream";

    // Prepare the payload for the Gemini API
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    // Call the Gemini API
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: API key not found." },
        { status: 500 }
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      return NextResponse.json(
        {
          error: "Failed to get a response from the AI model.",
          details: errorBody,
        },
        { status: apiResponse.status }
      );
    }

    const result = await apiResponse.json();

    // Process the response and send it back to the client
    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
      let text = result.candidates[0].content.parts[0].text;
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      try {
        const jsonData = JSON.parse(text);
        return NextResponse.json(jsonData);
      } catch (jsonError) {
        return NextResponse.json(
          {
            error: "Failed to parse the extracted data as JSON.",
            raw_text: text,
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: "No content was returned from the API.",
          full_response: result,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred on the server.",
        details: String(err),
      },
      { status: 500 }
    );
  }
}
