# AI Cover Letter Generator

This is my Sprint 4 project for Prodesk IT. Made a simple tool that generates cover letters using AI, based on the candidate's name, job role, company and skills. Built it in plain HTML, CSS and JS (no framework, kept it simple).

## What it does

You fill a form with your name, the job role you're applying for, the company name and your key skills. Optionally you can also upload your resume (PDF) and it'll use that for more personalized output. Then it calls Gemini API and generates a cover letter for you. There's also a copy button so you can just copy the letter and paste it wherever you need.

## Phases done

**Phase 1 - basic MVP**
- form with 4 fields (name, role, company, skills)
- generates a hardcoded template letter using the values
- copy to clipboard button

**Phase 2 - actual AI integration**
- connected to Google Gemini API
- API key is stored in env variables on Vercel, not hardcoded anywhere
- shows "Generating..." while waiting for response since it can take a few seconds

**Phase 3 - resume upload (stretch goal)**
- added a PDF upload option
- it extracts text from the resume using pdf-parse
- that text gets added into the prompt so the letter is more tailored to the actual resume
- output is parsed into proper html paragraphs instead of just plain text

## Tech used

- HTML / CSS / JS for frontend
- Vercel serverless function (api/generate.js) for backend logic
- Google Gemini API (gemini-flash-latest model)
- pdf-parse npm package for reading resume text

## How to run locally

Since this uses a serverless function, opening index.html directly in browser won't make the API call work (the /api/generate route only works when deployed, or using vercel dev locally).

1. clone the repo
2. create a `.env` file and add `GEMINI_API_KEY=your_key_here`
3. run `vercel dev` (if you have vercel cli installed)
4. open the local url it gives you

## Live link

deployed on vercel, link below
https://ai-cover-letter-olive.vercel.app/

## Notes

- the api key is never committed, .gitignore takes care of that
- resume upload is optional, form works fine without it too
- spent more time than expected debugging the gemini model name issue lol, turns out the model names keep changing so had to check the actual available models list to fix it

---
Developed by Akarshi Agrahari
