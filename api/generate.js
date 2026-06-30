export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }
  
    const { name, role, company, skills } = req.body;
  
    if (!name || !role || !company || !skills) {
      return res.status(400).json({ error: "Missing fields" });
    }
  
    const apiKey = process.env.GEMINI_API_KEY;
  
    const prompt = `Write a professional, concise cover letter (under 300 words).
  Candidate name: ${name}
  Job role: ${role}
  Target company: ${company}
  Key skills: ${skills}
  
  Make it sound natural and tailored, not generic. End with "Sincerely, ${name}".`;
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
  
      const data = await response.json();
  
      const letter =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate letter, try again.";
  
      return res.status(200).json({ letter: letter });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error generating letter" });
    }
  }
