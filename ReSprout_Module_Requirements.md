# ReSprout: Module Requirements for Builders

**Project:** ReSprout, an AI-powered digital platform for ideating and validating waste-to-value sustainable businesses
**Course:** BIK 20803 Creativity and Innovation (UTHM), SDG 9 Target 9.B
**Purpose of this file:** Hand this to the person building the website/app. Each module is self-contained: build in the order given in Section 4 and tick off the acceptance criteria.

---

## 1. Product summary

A user photographs a leftover material (coconut husk, coffee grounds, palm kernel shell, used cooking oil, fabric scraps). ReSprout:

1. Identifies the material using AI vision.
2. Generates 5 business ideas for it.
3. Scores each idea out of 100.
4. Lets the user publish a "pledge page" so real people can show interest.
5. Shows each idea growing as a tree: Seed, Sprout, Sapling, Tree, Forest.

**Primary platform:** responsive web app (works well on a phone browser). A clickable Figma prototype is acceptable as a fallback only for modules marked "mock allowed".

**Demo rule:** The final video will demonstrate one flow end to end: **scan, ideas, score, pledge page, tree grows**. Modules M2 to M6 must work reliably together. Everything else is secondary.

---

## 2. Actors

| Actor | Description | Modules used |
|---|---|---|
| Maker | Student or entrepreneur who owns the waste and wants a business idea | M1 to M6 |
| Supporter | Visitor who opens a shared pledge link; no account required | M6 |
| Admin | Team member who manages material data | M7 |
| AI service | External API (vision + text); not a human | M2, M3, M4 |

---

## 3. Recommended tech stack (builder may substitute)

| Layer | Suggestion | Notes |
|---|---|---|
| Front end | React (Vite or Next.js) + Tailwind CSS | Mobile-first layout |
| Backend | Serverless functions (Next.js API routes, Supabase Edge Functions or Firebase Functions) | Required so the AI key stays secret |
| Database and auth | Supabase (Postgres + Auth + Storage) or Firebase | Free tier is enough |
| AI | OpenAI API (vision-capable chat model) | Model name stored in an environment variable, never hardcoded |
| Animation | Lottie (lottie-react) or simple SVG/CSS | For the tree stages |
| Hosting | Vercel or Netlify | Free tier |

**Environment variables**

```
AI_API_KEY=...            # server only, never exposed to the browser
AI_MODEL=...              # vision-capable model name, check provider docs
DEMO_MODE=true            # use cached results for hero materials
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
PLEDGE_TARGET_TREE=10     # pledges needed for Tree stage
PLEDGE_TARGET_FOREST=50   # pledges needed for Forest stage
```

**Global rules for every module**

- The AI key must never appear in front-end code or network responses.
- Every screen needs loading, empty and error states.
- All AI responses must be valid JSON; validate, and retry once if parsing fails.
- Mobile-first: usable at 360 px width.
- Images are resized to a maximum of 1024 px on the longest side before upload and are limited to 10 MB.
- Plain, friendly English. Currency in RM.

---

## 4. Build order

| Order | Module | Why |
|---|---|---|
| 1 | M1 Authentication | Everything else needs a user |
| 2 | M2 Scan and identify | Start of the main flow |
| 3 | M3 Idea generator | Core feature |
| 4 | M4 Validation scoring | Core feature |
| 5 | M5 Idea Garden | The "wow" visual |
| 6 | M6 Pledge page | Real-world validation |
| 7 | M7 Admin and material data | Supports M3 and M4; can be a seeded table with no UI |

---

## 5. Data model

Use these tables (Postgres style). Add `created_at` timestamps to all.

**profiles**
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | Matches auth user id |
| display_name | text | |
| role | text | `maker` or `admin`, default `maker` |

**materials** (seed data, managed in M7)
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | e.g. "Coconut husk" |
| category | text | agri, food, textile, oil, other |
| description | text | |
| typical_cost_range_rm | text | e.g. "500 to 3000" |
| is_hero | boolean | One of the 5 demo materials |
| cached_result | jsonb | Pre-tested ideas and scores for demo mode |

**scans**
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK profiles | |
| image_url | text | Storage URL |
| material_name | text | AI result or user correction |
| confidence | numeric | 0 to 1 |
| material_id | uuid, FK materials, nullable | Matched if found |

**ideas**
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| scan_id | uuid, FK scans | |
| user_id | uuid, FK profiles | |
| name | text | |
| description | text | |
| technique | text | SCAMPER letter or name |
| why_this_works | text | Short explanation |
| est_startup_cost_rm | numeric | |
| demand | int | 1 to 5 |
| difficulty | int | 1 to 5 (5 = hardest) |
| sdg_impact | int | 1 to 5 |
| co2_saved_kg_year | numeric | Estimate |
| score | int | 0 to 100, computed by M4 |
| stage | text | `seed`, `sprout`, `sapling`, `tree`, `forest` |
| saved | boolean | True when the user keeps the idea |

**pledge_pages**
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| idea_id | uuid, FK ideas, unique | |
| slug | text, unique | Used in the public URL |
| headline | text | Editable |
| body | text | Editable |
| price_hint_rm | numeric, nullable | Optional "expected price" |
| is_published | boolean | |

**pledges**
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| page_id | uuid, FK pledge_pages | |
| name | text | |
| email | text | |
| quantity | int | Default 1 |
| consent | boolean | Must be true (PDPA) |

---

## 6. Modules

### M1: Authentication

**Purpose:** Let a Maker create an account and log in so ideas are saved. (Mock allowed if short on time: single hardcoded demo user.)

**Functional requirements**
- M1-F1: Sign up with email and password, or Google sign-in.
- M1-F2: Log in and log out.
- M1-F3: Password reset by email.
- M1-F4: On first login create a `profiles` row with role `maker`.
- M1-F5: All pages except the public pledge page (M6) require login.

**Screens:** Welcome/landing (logo, tagline "Plant an idea. Grow a business.", Log in and Sign up buttons), Sign up, Log in.

**Validation:** Email format check; password at least 8 characters; show inline errors.

**Acceptance criteria**
- [ ] New user can sign up and lands on the Scan screen (M2).
- [ ] Logged-out user opening a protected URL is redirected to Log in.
- [ ] Log out clears the session.

---

### M2: Scan and identify material

**Purpose:** Turn a photo (or a manual choice) into a named material. This is step 1 of the main flow.

**Inputs:** Image file (JPG, PNG, WEBP) or a material picked from a list.
**Outputs:** A `scans` record with `material_name`, `confidence`, optional `material_id`.

**Functional requirements**
- M2-F1: Upload a photo or take one with the device camera (HTML `capture` attribute).
- M2-F2: Resize the image client-side to a maximum of 1024 px before upload.
- M2-F3: Send the image to the backend endpoint `POST /api/scan`.
- M2-F4: Backend calls the AI vision API with the scan prompt (below) and returns JSON.
- M2-F5: Show the result as "We think this is: **Coconut husk** (confidence 92%)" with an Edit button so the user can correct the name.
- M2-F6: Fallback "Pick a material instead": searchable list from `materials`.
- M2-F7: If confidence is below 0.5, show "Not sure, please confirm or choose from the list."
- M2-F8: If `DEMO_MODE=true` and the image or choice matches a hero material, the result may come from `materials.cached_result` so the demo never fails.
- M2-F9: A "Continue" button saves the scan and goes to M3.

**API contract**

`POST /api/scan` (multipart image) returns:

```json
{
  "scan_id": "uuid",
  "material_name": "Coconut husk",
  "category": "agri",
  "confidence": 0.92,
  "notes": "Fibrous brown outer shell of coconut."
}
```

**Scan prompt template**

```
You are a waste-material identification assistant for Malaysia.
Look at the image and identify the main waste or by-product material.
Return ONLY valid JSON, no markdown:
{"material_name": "", "category": "agri|food|textile|oil|plastic|other",
 "confidence": 0.0, "notes": ""}
If the image does not show a reusable material, set material_name to "Unknown"
and confidence to 0.
```

**Acceptance criteria**
- [ ] Photo of each of the 5 hero materials is identified correctly (or via cached demo mode).
- [ ] User can correct a wrong name.
- [ ] Oversized image is resized before upload.
- [ ] Non-material image shows a friendly "Unknown" message, not a crash.

---

### M3: Idea generator

**Purpose:** Produce 5 business ideas for the confirmed material using SCAMPER prompts. This shows the creativity and ideation side of the theme.

**Inputs:** `material_name`, `category`, optional user context (location, budget, skills).
**Outputs:** 5 `ideas` records.

**Functional requirements**
- M3-F1: Show the material name with an optional input "Anything we should know? (budget, skills, location)".
- M3-F2: "Spin ideas" button calls `POST /api/ideas`.
- M3-F3: Backend returns exactly 5 ideas, each linked to a different SCAMPER technique.
- M3-F4: Display ideas as cards: name, one-line description, technique badge, "Why this works" text.
- M3-F5: "Spin again" generates 5 new ideas (limit 3 spins per scan).
- M3-F6: User can Save an idea (sets `saved = true`, stage `seed`) or select one to score.
- M3-F7: Each card has a "Score this idea" button that goes to M4.

**API contract**

`POST /api/ideas` with `{ "scan_id": "uuid", "context": "optional text" }` returns:

```json
{
  "ideas": [
    {
      "id": "uuid",
      "name": "Husk-fibre biodegradable seedling trays",
      "description": "Press coconut husk into trays for nurseries.",
      "technique": "Combine",
      "why_this_works": "Nurseries need cheap compostable trays and husk is abundant.",
      "est_startup_cost_rm": 4500,
      "demand": 4,
      "difficulty": 3,
      "sdg_impact": 5,
      "co2_saved_kg_year": 800
    }
  ]
}
```

**Ideas prompt template**

```
You are a startup ideation coach in Malaysia.
Material: {{material_name}} (category: {{category}}).
User context: {{context or "none"}}.
Generate exactly 5 realistic, low-capital business ideas that use this material.
Use a different SCAMPER technique for each (Substitute, Combine, Adapt,
Modify, Put to another use, Eliminate, Reverse). Prefer ideas a student or
small team could start in Malaysia for under RM 30,000.
Return ONLY valid JSON, no markdown:
{"ideas":[{"name":"","description":"","technique":"",
"why_this_works":"","est_startup_cost_rm":0,"demand":1,
"difficulty":1,"sdg_impact":1,"co2_saved_kg_year":0}]}
Rules: demand, difficulty and sdg_impact are integers 1 to 5
(difficulty 5 = hardest). Estimates must be conservative.
```

**Acceptance criteria**
- [ ] Always exactly 5 ideas, each with a different technique.
- [ ] Invalid AI JSON triggers one automatic retry, then a friendly error.
- [ ] Saved ideas appear in M5.
- [ ] Hero materials return instantly from cache when `DEMO_MODE=true`.

---

### M4: Validation scoring

**Purpose:** Convert the AI estimates into a clear score out of 100 with a visual breakdown. This is the "validation" half of the theme.

**Inputs:** An `ideas` record (fields from M3).
**Outputs:** `score` (0 to 100) and a breakdown.

**Scoring formula (implement exactly; this is plain code, not AI)**

Convert each factor to a 1 to 5 sub-score:

| Factor | Weight | Sub-score rule |
|---|---|---|
| Demand | 30 | `demand` as given (1 to 5) |
| Startup cost | 20 | cost ≤ RM1,000 → 5; ≤ 5,000 → 4; ≤ 15,000 → 3; ≤ 30,000 → 2; above → 1 |
| Ease (inverse difficulty) | 15 | `6 - difficulty` |
| SDG impact | 20 | `sdg_impact` as given |
| CO₂ saved per year | 15 | ≥ 1,000 kg → 5; ≥ 500 → 4; ≥ 100 → 3; ≥ 20 → 2; below → 1 |

```
score = round( sum( weight_i * subscore_i / 5 ) )
```

Score bands: 80 to 100 "Strong", 60 to 79 "Promising", 40 to 59 "Needs work", below 40 "Rethink".

**Functional requirements**
- M4-F1: Score screen shows the idea name, the big score number, the band label and five horizontal bars (one per factor).
- M4-F2: Each bar shows the factor name, the sub-score and a short tooltip explaining it.
- M4-F3: Show a clear disclaimer: "Estimates are AI-generated. Real validation comes from pledges."
- M4-F4: Compute the score on the server when scoring is requested and save it to `ideas.score`.
- M4-F5: If `score >= 60` and the stage is `seed`, upgrade the stage to `sprout` and trigger the growth animation (M5).
- M4-F6: Allow the user to edit the estimates (cost, demand, difficulty) with sliders and see the score recalculate live.
- M4-F7: Show an "Impact" card: kg waste diverted (user-entered monthly volume × 12), CO₂ saved, and the SDG 9.B badge.
- M4-F8: Buttons: "Create pledge page" (goes to M6) and "Back to ideas".

**API contract**

`POST /api/score` with `{ "idea_id": "uuid", "overrides": { "cost": 3000, "demand": 4, "difficulty": 2 } }` returns:

```json
{
  "idea_id": "uuid",
  "score": 81,
  "band": "Strong",
  "breakdown": [
    { "factor": "Demand", "weight": 30, "subscore": 4 },
    { "factor": "Startup cost", "weight": 20, "subscore": 4 },
    { "factor": "Ease", "weight": 15, "subscore": 3 },
    { "factor": "SDG impact", "weight": 20, "subscore": 5 },
    { "factor": "CO2 saved", "weight": 15, "subscore": 4 }
  ],
  "stage": "sprout"
}
```

**Acceptance criteria**
- [ ] Known test case: demand 4, cost RM4,500, difficulty 3, SDG 5, CO₂ 800 kg gives **81** (24 + 16 + 9 + 20 + 12), band "Strong".
- [ ] Moving a slider updates the score within one second.
- [ ] Score of 60 or above upgrades the stage to Sprout and triggers the animation.
- [ ] Disclaimer is always visible.

---

### M5: Idea Garden

**Purpose:** The visual dashboard where each saved idea appears as a plant that grows as it is validated. This is the memorable "wow" screen.

**Stages and rules**

| Stage | Name | Condition |
|---|---|---|
| 1 | Seed | Idea saved |
| 2 | Sprout | Score computed and ≥ 60 |
| 3 | Sapling | Pledge page published |
| 4 | Tree | Pledges ≥ `PLEDGE_TARGET_TREE` (default 10) |
| 5 | Forest | Pledges ≥ `PLEDGE_TARGET_FOREST` (default 50) |

Stage can only go up, never down.

**Functional requirements**
- M5-F1: Garden screen lists all of the user's saved ideas as plant cards in a grid.
- M5-F2: Each card shows: plant graphic for the current stage, idea name, score, pledge count, stage label.
- M5-F3: When a stage changes, play a short growth animation (Lottie or CSS, about 2 seconds) the next time the card is shown.
- M5-F4: Each card has a progress hint: "3 more pledges to become a Tree."
- M5-F5: Tapping a card opens a detail view: description, score breakdown (read-only), pledge page link, pledge list (names only, no emails shown on screen), and buttons to Edit estimates (M4) or Open pledge page (M6).
- M5-F6: Empty state: "Your garden is empty. Scan a material to plant your first seed." with a button to M2.
- M5-F7: Stage is recalculated on the server whenever a score changes, a page is published or a pledge arrives.
- M5-F8: Header shows summary stats: total ideas, total pledges, total estimated CO₂ saved.

**Graphics needed:** five plant illustrations or Lottie files (seed, sprout, sapling, tree, forest). Free Lottie files are acceptable; credit the source in the report.

**Acceptance criteria**
- [ ] A new saved idea shows as a Seed.
- [ ] Scoring ≥ 60 changes it to Sprout with animation.
- [ ] Publishing the pledge page changes it to Sapling.
- [ ] Reaching 10 pledges changes it to Tree.
- [ ] Empty state is shown for a new user.

**Optional extra (only if all modules are done):** "Future Mode" toggle that shows projected 5-year impact (simple multiplication of yearly CO₂ and volume).

---

### M6: Pledge page (fake-door validation)

**Purpose:** Auto-generate a public landing page for an idea so real people can show interest. The pledge count is the real validation.

**Maker side**

- M6-F1: From M4 or M5, click "Create pledge page". Backend creates a draft page with an AI-written headline and short description (use idea name and description).
- M6-F2: Edit screen: headline, body text, optional expected price (RM), live preview.
- M6-F3: "Publish" sets `is_published = true`, generates a unique `slug` and shows the shareable link with Copy and Share buttons. Generate a QR code for the link (library such as `qrcode`).
- M6-F4: Maker can unpublish.
- M6-F5: Maker can view the list of pledges (name, email, quantity, date) and export as CSV.

**Public side (no login)**

- M6-F6: Route `/p/:slug` shows: idea name, headline, body, an illustration or the material photo, the SDG 9 badge, current pledge count and a progress bar toward the Tree target.
- M6-F7: Pledge form: name, email, quantity (default 1), consent checkbox "I agree to be contacted about this product" (required).
- M6-F8: On submit show "Thank you! You are pledge number N." and update the count.
- M6-F9: Page must clearly state: "This is a demand test. No payment is taken."
- M6-F10: Prevent duplicate pledges from the same email on the same page.
- M6-F11: Basic spam protection (honeypot field or simple rate limit).

**API contract**

- `POST /api/pledge-pages` with `{ "idea_id": "uuid" }` returns the draft page.
- `PATCH /api/pledge-pages/:id` for edits and publish/unpublish.
- `GET /api/public/pledge-pages/:slug` returns page content and pledge count (no personal data).
- `POST /api/public/pledges` with `{ "slug": "", "name": "", "email": "", "quantity": 1, "consent": true }`.

**Acceptance criteria**
- [ ] Published link opens in a private/incognito window without login.
- [ ] Submitting a pledge increases the count and triggers the stage check in M5.
- [ ] Same email cannot pledge twice on one page.
- [ ] Form cannot be submitted without consent.
- [ ] Emails are never shown on the public page.

---

### M7: Admin and material data

**Purpose:** Keep the material list and demo data tidy. (Can be done with a seeded table and no screen if time is short.)

**Functional requirements**
- M7-F1: Admin role can view, add, edit and delete `materials`.
- M7-F2: Flag up to 5 materials as `is_hero` and store a pre-tested `cached_result` (ideas and scores) for each.
- M7-F3: A "Demo mode" switch (environment variable is fine) that makes hero materials return cached results.
- M7-F4: Admin can view basic totals: users, scans, ideas, pledges.

**Seed data (minimum 5 hero materials)**

| Material | Category | Example idea to pre-test |
|---|---|---|
| Coconut husk | agri | Biodegradable seedling trays |
| Used coffee grounds | food | Mushroom-growing kits |
| Palm kernel shell | agri | Activated-charcoal products |
| Used cooking oil | oil | Handmade soap and candles |
| Fabric scraps | textile | Patchwork accessories |

**Acceptance criteria**
- [ ] 5 hero materials exist with cached results.
- [ ] Non-admin users cannot reach admin routes.

---

## 7. Cross-cutting requirements

**Design**
- Colour palette: greens and warm earth tones; one accent colour for scores.
- Logo and name: "ReSprout" with a sprout icon. Tagline: "Plant an idea. Grow a business."
- Include the UN SDG 9 icon on the score screen and pledge page.
- Buttons at least 44 px tall for touch.

**Security and privacy**
- Row-level security: a Maker can only read and write their own scans, ideas and pledge pages.
- Pledge emails are visible only to the owner of that page.
- A short privacy notice and terms page, referencing Malaysia's PDPA (Personal Data Protection Act).
- Rate-limit AI endpoints (for example 20 requests per user per hour) to protect the budget.

**Performance**
- AI calls show a loading animation and should complete within about 15 seconds; show a timeout message after 30 seconds.
- Cache AI results per scan so refreshing the page does not re-call the API.

**Error handling**
- Every API failure shows a human-friendly message and a retry button.
- Log errors server-side without logging user images or emails.

---

## 8. End-to-end demo script (must work before filming)

1. Log in as the demo Maker.
2. Upload a coconut husk photo. Result: "Coconut husk (92%)".
3. Tap Spin ideas. Five idea cards appear.
4. Save the best idea. A Seed appears in the Garden.
5. Tap Score this idea. Score screen shows about 80 with breakdown bars; the plant grows to a Sprout.
6. Tap Create pledge page. Edit the headline and publish. The plant becomes a Sapling.
7. Open the public link in another tab or phone and submit 2 or 3 pledges.
8. Return to the Garden. Pledge count updated and progress hint shown ("7 more pledges to become a Tree").
9. (Pre-filled demo data) Show a second idea that is already a Tree.

---

## 9. Out of scope (do not build)

- Real payments or pre-order checkout
- Supplier and maker matching or marketplace logic (Forest stage is only a label)
- Native mobile apps (a responsive web app is enough)
- Multi-language support
- Social features (comments, likes, following)
- Material Passport QR and community map (optional extras only after everything above is done)

---

## 10. Definition of done

- [ ] All acceptance criteria for M1 to M6 are ticked (M7 may be a seeded table).
- [ ] The Section 8 demo script runs without errors three times in a row.
- [ ] Source code is in a GitHub repository with a README explaining setup and environment variables.
- [ ] The app is deployed at a public URL (or a clickable prototype link is provided).
- [ ] No API keys are present in the repository or the browser.
