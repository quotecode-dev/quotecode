# ProFlow SaaS - Development Rules & Architecture Protocol

## Project Overview
* **Project Name**: ProFlow (Business management and smart quoting SaaS system).
* **Production Domain**: https://www.quotecodepro.com/
* **Tech Stack**: React (Vite), Supabase (Auth, Database, Edge Functions), Vercel (Hosting), GitHub (Version Control).
* **Environment**: Cloud-only development (No Localhost).

---

## Iron Rules for Code & Responses

1. **Complete File Delivery**: When making code changes (React, Tailwind, Supabase, etc.), always provide the **full updated file from start to finish**. Never provide partial code snippets or manual insertion instructions.
2. **Git Commands**: At the end of every code update, provide the required Git commands in a dedicated code block (`git add . ; git commit -m "..." ; git push`).
3. **Simple Explanations**: Explanations must be step-by-step, simple, and accessible without assuming advanced developer knowledge.
4. **Visual Highlights**: Always highlight warnings or critical points in bright red using HTML (`<span style="color:red;"><b>...</b></span>`).
5. **Copy Instructions Formatting**: Always add an underscore before and after the prompt instruction for copying and pasting code files.
6. **VAT Rules**: 18% for local Israeli clients (`business_settings.country === 'Local'`), 0% for international clients (`business_settings.country === 'International'`).
7. **Strict International Language Isolation**: 
   - Language localization (`isHebrew`) is tied strictly and exclusively to the database field `business_settings.country` (or currency if specified).
   - International users/businesses (`International`) must **never** under any circumstances be exposed to Hebrew text or labels in public quotes or dashboards.
8. **Owner View Safety**: 
   - When a business owner views their own quote from the management dashboard (`PublicQuote.jsx`), the client signature box (`canvas`) must be hidden, showing a clean management preview instead. Client signatures are reserved exclusively for the external public client link.
9. **Prior History Analysis**: Before giving any answer, project continuation proposal, or future task reference, analyze previous conversation history and decisions in two parallel vectors: Technical (code, features, architecture) and Business/Strategic (marketing, business model, explicitly deferred processes). Never propose development that contradicts past decisions.
