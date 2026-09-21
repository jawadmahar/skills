# Prioritisation Scale

How to decide what surfaces first when a health record grows past the point
where everything can be shown at once.

**Relevance is not recency, and it is not severity. The most relevant fact is
the one most likely to change a decision now.**

## The four tiers

Tiers describe an item's status *now* and are reassessed at every intake and
every quarterly review.

### Tier 1 — ACTIVE
*Surface in every clinical answer, unprompted.*

Qualifies if any of these is true:
- Changing in a concerning direction over the last 12 months
- Uncontrolled against a target the person's own clinician has set
- Under active treatment with that treatment under review
- A safety flag that could affect a prescribing decision today
- An unanswered question blocking a decision

### Tier 2 — MONITORED
*Surface when relevant to the question, or when its trend changes.*

- Stable conditions under treatment
- Abnormal values that are not moving
- Findings needing periodic recheck but no action now
- Genetic flags relevant only to specific drugs

### Tier 3 — BACKGROUND
*Surface only when asked, or when it explains something.*

- Resolved or excluded conditions
- Normal results that establish a baseline
- Settled explanations — facts that stop future investigation
- History older than two years with no bearing on current care

### Tier 4 — ARCHIVE
*Retained and indexed, surfaced only on request.*

- Superseded values kept for trend continuity
- Administrative detail: case numbers, billing, facility addresses
- Duplicates
- Non-clinical content from scanned records (adverts, vouchers)

**Nothing is ever deleted.** Tier 4 is the floor, not the bin. A value that
looks irrelevant today is the baseline that proves a change in five years.

## Scoring when the tier is unclear

Score 0–3 on each dimension:

| Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **Actionability** — would it change a decision? | No | Maybe later | Likely next visit | Yes, now |
| **Trajectory** | Improving | Stable | Drifting | Worsening |
| **Recency** | >3 years | 1–3 years | 3–12 months | <3 months |
| **Consequence if ignored** | Nothing | Minor | Significant | Serious |

**10–12 → Tier 1 · 6–9 → Tier 2 · 3–5 → Tier 3 · 0–2 → Tier 4**

### Overrides

- **Safety override.** Anything that could cause harm through a prescribing or
  procedural decision is Tier 1 regardless of score — a drug allergy, a
  pharmacogenomic contraindication, an interaction.
- **Explanatory override.** A Tier 3 fact becomes Tier 1 the moment it explains
  a Tier 1 question. A benign inherited condition is ordinarily background —
  until a clinician starts investigating the abnormal value it causes, at which
  point it is the most important fact in the record.

## Promotion and demotion

| Trigger | Move |
|---|---|
| Value worsens materially | Promote to Tier 1 |
| Value normalises and holds 12 months | Demote to Tier 3 |
| Condition resolved or excluded | Demote to Tier 3, keep the evidence |
| Open question answered | Close it; promote the answer if it changes anything |
| No mention in 2 years, nothing pending | Demote one tier |
| New drug started | Promote related monitoring to Tier 1 for 6 months |

## Recency weighting

Weight the latest value most heavily, but **never show a single value alone**.
Always show at least the last three so direction is visible. One HbA1c of 7.8%
is a number; 6.9 → 7.8 over six months is information.

## Contradiction between old and new

Newer generally wins — **but not automatically**. A newer value from a less
reliable source (an illegible photograph, a handwritten note, an auto-filled
form field) does not override an older value from a clear laboratory report.
State both, say which you trust and why, and log it as an open question.

Watch for form defaults masquerading as data: a date of birth identical to the
visit date, an age that contradicts every other document, a filename date that
contradicts the document's own date.

## When files get large

Past roughly 1,500 words, split rather than trim:

- Keep **current state** in the main file
- Move superseded detail to an `ARCHIVE` section at the bottom of the same file
- Split into a separate file only when the archive exceeds the live content

Keep the profile, conditions, timeline and open-questions files always loaded;
let imaging and genomics load on demand. This keeps the working set small
without losing depth.

## Worked contrast

> **Bad:** "HbA1c is 7.8%, fasting glucose 118, LDL 112, HDL 36, triglycerides
> 162, ALP 131, GGT 58, WBC 10.9, ESR 8, creatinine 0.78…"
>
> **Good:** "The main thing is diabetes control, which has slipped — HbA1c 7.8%
> this month, up from 6.9% six months ago. Second, the cholesterol treatment
> seems to have stopped working or stopped being taken: LDL roughly doubled over
> the same period. Those two together are worth an appointment soon. The good
> news is the kidneys are in excellent shape despite years of diabetes, and the
> liver enzymes have largely normalised."

The second uses fewer numbers and conveys far more.
