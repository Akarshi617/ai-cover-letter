import pdf from "pdf-parse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { name, role, company, skills, resume } = req.body;

  if (!name || !role || !company || !skills) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  let resumeText = "";
  if (resume) {
    try {
      const buffer = Buffer.from(resume, "base64");
      const parsed = await pdf(buffer);
      resumeText = parsed.text;
    } catch (err) {
      console.error("PDF parse error:", err);
    }
  }

  const prompt = `Write a professional, concise cover letter (under 300 words) in markdown format with paragraphs.
Candidate name: ${name}
Job role: ${role}
Target company: ${company}
Key skills: ${skills}
${resumeText ? "Resume content for additional context:\n" + resumeText : ""}

Make it sound natural and tailored, not generic. End with "Sincerely, ${name}".`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data));

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate letter, try again.";

    const htmlLetter = rawText
      .split("\n\n")
      .filter((p) => p.trim() !== "")
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");

    return res.status(200).json({ letter: htmlLetter });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error generating letter" });
  }
}
