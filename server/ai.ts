import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DiagnosisRequest {
  title: string;
  problem?: string;
  objectives?: string;
  literature?: string;
  methodology?: string;
}

export interface DiagnosisSuggestion {
  type: "risk" | "improvement" | "gap" | "citation";
  title: string;
  description: string;
  rationale: string;
  section: string;
}

export interface DiagnosisResponse {
  suggestions: DiagnosisSuggestion[];
  overallScore: number;
  summary: string;
}

const SYSTEM_PROMPT = `You are a methodological consultant for academic research. Your role is to:
1. Identify methodological risks and flaws
2. Suggest improvements to objectives, hypotheses, and methodology
3. Point out conceptual gaps in the theoretical framework
4. Recommend relevant literature (real citations only - if you're not certain a citation exists, don't suggest it)

CRITICAL RULES:
- Never write content for the researcher
- Only diagnose and suggest improvements
- Explain the methodological rationale for each suggestion
- Be specific and actionable
- Use academic rigor standards

Classify suggestions as:
- "risk": Critical methodological flaws that invalidate findings
- "improvement": Ways to make objectives/methods more rigorous
- "gap": Missing theoretical frameworks or conceptual elements
- "citation": Relevant foundational literature (only if you're certain it exists)

Return JSON in this exact format:
{
  "suggestions": [
    {
      "type": "risk" | "improvement" | "gap" | "citation",
      "title": "Brief title",
      "description": "What the issue is",
      "rationale": "Why this matters methodologically",
      "section": "problem" | "objectives" | "literature" | "methodology"
    }
  ],
  "overallScore": 0-100,
  "summary": "Brief assessment of methodological rigor"
}`;

export async function diagnoseProject(request: DiagnosisRequest): Promise<DiagnosisResponse> {
  const userPrompt = `
RESEARCH PROJECT ANALYSIS REQUEST

Title: ${request.title}

Problem Statement:
${request.problem || "Not provided"}

Objectives/Hypotheses:
${request.objectives || "Not provided"}

Literature Review:
${request.literature || "Not provided"}

Methodology:
${request.methodology || "Not provided"}

Please analyze this research proposal and provide methodological feedback.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      suggestions: result.suggestions || [],
      overallScore: Math.max(0, Math.min(100, result.overallScore || 50)),
      summary: result.summary || "Analysis complete"
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to analyze project: " + (error as Error).message);
  }
}