# ReSprout: AI-Powered Waste-to-Value Sustainable Ideation & Validation

> **Course:** BIK 20803 Creativity and Innovation (UTHM)  
> **SDG Alignment:** UN SDG 9 (Target 9.B: Domestic technology development, research and innovation)  
> **Tagline:** Plant an idea. Grow a business.

---

## 1. Overview

ReSprout is a responsive digital platform designed for Malaysian students, researchers, and entrepreneurs to photograph leftover agricultural or industrial waste materials (such as coconut husk, spent coffee grounds, palm kernel shell, used cooking oil, and textile scraps) and systematically:
1. **Identify the waste material** using AI vision.
2. **Generate 5 viable SCAMPER business ideas** tailored for under RM 30,000 startup capital in Malaysia.
3. **Score each idea out of 100** using a weighted multi-factor validation algorithm.
4. **Publish a public fake-door pledge page** with a shareable QR code to measure real community demand.
5. **Watch the venture grow as a tree** in the **Idea Garden**: Seed &rarr; Sprout &rarr; Sapling &rarr; Tree &rarr; Forest.

---

## 2. Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (mobile-first, earth & forest tones, 44px+ touch targets)
- **Icons:** Lucide React
- **QR Code:** `qrcode` client/server generator
- **Database / Store:** Resilient in-memory database store with seed data & local persistence fallback (ready out-of-the-box without requiring external database setup)

---

## 3. Environment Variables

Create `.env.local` based on `.env.local.example`:

```bash
# AI Service Configuration (OpenAI or compatible vision API)
AI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini

# Demo Mode: returns instant verified hero material results
DEMO_MODE=true

# Tree Growth Targets
PLEDGE_TARGET_TREE=10
PLEDGE_TARGET_FOREST=50
```

*Note:* When `DEMO_MODE=true` (the default), the app runs without external API keys using verified pre-tested SCAMPER business models for all 5 Hero materials.

---

## 4. End-to-End Demo Script (Section 8 Verification)

Follow this sequence to demonstrate the entire platform:

1. **Log in as Demo Maker:**
   - Open the homepage and tap **"Start Scanning Waste"** or **"Demo Login"**. You will automatically be authenticated as `Nur Fitri (Demo Maker)`.
2. **Upload / Select Coconut Husk:**
   - Tap **"Photograph or Choose Waste Material"** on `/scan`. Select coconut husk or pick from the Hero materials dropdown.
   - Result: *"We think this is: **Coconut husk** (confidence 92%)"*.
3. **Spin Ideas:**
   - Tap **"Confirm Material & Spin Ideas"**.
   - Exactly 5 business ideas appear, each linked to a distinct SCAMPER technique (Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse).
4. **Save Idea to Garden:**
   - Tap **"Save to Garden"** on *"Husk-fibre biodegradable seedling trays"*.
   - A **Seed** is planted in your **Idea Garden** (`/garden`).
5. **Score the Idea (Validation Engine):**
   - Tap **"Score this idea"** (`/score`).
   - The algorithmic score computes **81 / 100 ("Strong" band)** with 5 weighted breakdown bars.
   - Because the score is &ge; 60, the plant advances and animates into a **Sprout**!
6. **Create Public Pledge Page:**
   - Tap **"Create Public Pledge Page"**.
   - Edit the headline/price hint, and click **"Publish & Advance Tree to Sapling"**.
   - The plant advances to **Sapling**, and generates a public link `/p/[slug]` and QR code.
7. **Submit Public Pledges:**
   - Open the public link in an incognito/private tab or another phone.
   - Enter name, email, quantity, check the PDPA consent box, and submit.
   - Shows *"Thank you! You are pledge number N"*.
8. **Verify Idea Garden Growth:**
   - Return to `/garden`. The pledge count is updated, and progress hints indicate progress towards **Tree** (&ge; 10 pledges) and **Forest** (&ge; 50 pledges).
   - A pre-filled demo idea (`Coffee-infused eco-fire logs`) is already displayed at **Tree** stage with 11 pledges!

---

## 5. Mathematical Scoring Formula (Module 4)

$$\text{Score} = \text{round}\left(\sum \frac{\text{weight}_i \times \text{subscore}_i}{5}\right)$$

| Factor | Weight | Sub-score Formula |
|---|---|---|
| **Demand** | 30% | Given 1 to 5 |
| **Startup Cost** | 20% | $\le \text{RM}1,000 \to 5;\ \le 5,000 \to 4;\ \le 15,000 \to 3;\ \le 30,000 \to 2;\ > 30,000 \to 1$ |
| **Ease** | 15% | $6 - \text{difficulty}$ |
| **SDG Impact** | 20% | Given 1 to 5 |
| **CO₂ Diverted** | 15% | $\ge 1,000\text{ kg} \to 5;\ \ge 500 \to 4;\ \ge 100 \to 3;\ \ge 20 \to 2;\ < 20 \to 1$ |

*Test Case:* Demand 4, Cost RM 4,500, Difficulty 3, SDG 5, CO₂ 800 kg $\implies$ **81 (Strong)**.

---

## 6. Project Structure

```
project cni/
├── ReSprout_Module_Requirements.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Welcome & Hero landing
│   │   ├── login/page.tsx      # M1 Authentication
│   │   ├── signup/page.tsx     # M1 Maker sign up
│   │   ├── scan/page.tsx       # M2 Scan & Identify material
│   │   ├── ideas/page.tsx      # M3 SCAMPER Idea generator
│   │   ├── score/page.tsx      # M4 Validation scoring engine
│   │   ├── garden/page.tsx     # M5 Idea Garden dashboard
│   │   ├── pledge/manage/page.tsx # M6 Maker pledge studio
│   │   ├── p/[slug]/page.tsx   # M6 Public supporter page
│   │   ├── admin/page.tsx      # M7 Admin & materials
│   │   ├── privacy/page.tsx    # PDPA Privacy notice
│   │   └── terms/page.tsx      # Terms of service
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── PlantGraphic.tsx    # Visual SVG plant stages
│   │   └── SdgBadge.tsx        # SDG 9 Target 9.B badge
│   └── lib/
│       ├── types.ts            # Data models
│       ├── scoring.ts          # Exact M4 scoring formulas
│       ├── seed.ts             # 5 Hero materials & cached models
│       ├── store.ts            # Persistent data store singleton
│       └── auth-context.tsx    # User session & roles
└── README.md
```
