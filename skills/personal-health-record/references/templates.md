# Knowledge Base Templates

Blank templates for the six knowledge-base files. All placeholders are in
`{{braces}}`. No real patient data belongs in this file or in any repository.

Every file carries a header:

```markdown
**Last updated:** {{date}}
**Status:** CORE — always load  |  REFERENCE — load on demand
**Sources:** {{documents this file was built from}}
```

---

## 01 — Patient Profile

```markdown
# 01 — Patient Profile

## Identity
| Field | Value | Source |
|---|---|---|
| Name | {{name}} | {{source}} |
| Name variants in records | {{other spellings}} | {{source}} |
| Sex | {{sex}} | {{source}} |
| Date of birth | {{dob}} {{flag if disputed}} | {{source}} |
| Age | {{age}} | — |
| Ethnicity | {{ethnicity}} — note where it changes clinical thresholds | — |
| Blood group | {{value or "not recorded"}} | — |

## Identifiers
*(Do not reproduce in outputs unless asked.)*
| Identifier | Value | Issuer |
|---|---|---|

## Addresses and contact
## Care team
| Clinician | Role | Where | Seen |
|---|---|---|---|

## Baseline anthropometrics
Height, weight, BMI, waist, blood pressure — or state plainly that they are
not recorded. For South Asian patients note the lower BMI thresholds
(overweight ≥23, obesity ≥27.5) and waist ≥90 cm for men.

## Lifestyle
Smoking, alcohol, diet, activity, sleep — record "not documented" where true.

## Allergies and adverse drug reactions
## Immunisations
## Family history
```

---

## 02 — Conditions and Medications

```markdown
# 02 — Active Conditions and Medications

## Active problem list
*Ordered by how much attention each needs now, not by severity in the abstract.*

### 1. {{condition}} — {{ACTIVE / STABLE / WATCH}}, {{direction}}
- {{key findings with dates}}
- **Reassuring:** {{what is going well}}
- **Gap:** {{what is missing}}
- **Genetics:** {{relevant variant, framed as predisposition not diagnosis}}

## Resolved / excluded
| Item | Result | Date |
|---|---|---|

## Medications

### Current
| Drug | Dose / frequency | Duration | Prescriber | Source | Confidence |
|---|---|---|---|---|---|

### Previously taken
| Drug | Dose | Started | Stopped | Reason stopped |
|---|---|---|---|---|

### Inferred but not documented
| Likely present | Why we think so |
|---|---|

### Medication safety notes from genetics
*Hypotheses to verify with a clinical test, not instructions.*
```

**Rule:** never overwrite a medication entry. Move it to "Previously taken" with
dates and, if known, why it stopped. Knowing a drug was tried and abandoned is
often more useful than knowing today's list.

---

## 03 — Lab Timeline

```markdown
# 03 — Laboratory Timeline

> **Rule:** append-only. Every new panel is a new right-hand column. Old values
> are never edited or removed. If a value is later found wrong, strike it and
> footnote it.

## Visit index
| Date | Case no. | Where | What |
|---|---|---|---|

## {{Panel name}}
| Test | Ref | {{date 1}} | {{date 2}} | **{{latest}}** |
|---|---|---|---|---|

**Reading this:** {{two or three sentences on direction of travel and what it
means — this prose is what makes the table useful}}

## Cross-check: genetics against measured values
| Prediction from DNA | Measured | Agrees? |
|---|---|---|
```

Group panels by system: glycaemic, lipids, liver, kidneys, blood count and
inflammation, thyroid, other endocrine. Bold the most recent column and any
out-of-range value.

---

## 04 — Imaging and Specialists

```markdown
# 04 — Imaging, Procedures and Specialist Visits

## {{Study}} — {{date}}
**Where:** {{facility}} · **Referred by:** {{clinician}} · **Reported by:** {{radiologist}}
**Indication:** {{why}}

### Impression, as written
> {{verbatim}}

### Findings in detail
| Organ / structure | Finding |
|---|---|

**What this adds:** {{how it changes or confirms the picture}}

## {{Consultation}} — {{facility}}, {{date}}
**Clinician:** {{name and specialty}}
**Recorded:** {{findings}}
**Investigations ordered:** {{list — and flag any whose results are missing}}
**Prescribed:** {{→ cross-reference file 02}}
**Advice given:** {{translate if in another language}}

## Documented gaps in imaging and screening
| Missing | Why it matters | Reference |
|---|---|---|
```

---

## 05 — Genomics

See [genomics.md](genomics.md) for method. Structure:

```markdown
# 05 — Genetic Analysis ({{provider}} raw data)

## Read this first
{{the three mandatory limits}}

## File quality
| Metric | Value | Verdict |
|---|---|---|

## Findings that matter clinically
### {{n}}. {{finding}} — {{one-line verdict}}
| Variant | Gene | Genotype | Meaning |
|---|---|---|---|
{{what it explains, what to do with it, confidence caveat}}

## What this file could NOT determine
| Not determinable | Why it matters |
|---|---|

## Suggested next step
{{framed as a discussion for their doctor}}
```

---

## 06 — Open Questions

```markdown
# 06 — Open Questions, Gaps and Data Conflicts

*Each item has an ID so other files can reference it. Answered items move to
Closed with the date — they are never deleted.*

## Priority A — resolve before or at the next appointment
### OQ-{{n}} · {{question}}
{{context with dates and values}}
**Ask / Action:** {{what specifically to do or ask}}

## Priority B — raise at the next relevant appointment
## Priority C — worth clarifying, not urgent

## Closed
| ID | Question | Answer | Closed |
|---|---|---|---|
```

Categories worth checking for on every record: missing baseline observations
(blood pressure, weight); undocumented medications implied by lab changes;
ordered-but-missing investigations; overdue screening; conflicting identity
data; and whether anyone holds the whole picture.

---

## Intake report format

What to output before editing any file:

```markdown
**What's new:** {{document and date}}
**What changed:** {{values that moved, direction and magnitude}}
**What stayed the same:** {{briefly — stability is information}}
**What this raises:** {{new questions}}
**What I'd take to the doctor:** {{the one or two things that matter}}
```

## Appointment brief format

One page, tailored to the specialty:

```markdown
# {{Specialty}} appointment — {{date}}

**Patient:** {{age}}, {{main diagnoses in one line}}
**Key safety flags:** {{allergies, pharmacogenomics}}
**Why this visit:** {{reason}}

## Since last time
{{only what this doctor needs}}

## Current medications
{{full list, uncertainties marked}}

## Questions to ask
1. {{phrased as the patient would say it}}

## To bring
{{reports, images, medicine boxes}}
```
