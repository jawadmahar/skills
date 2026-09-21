---
name: personal-health-record
description: Use when building or maintaining a personal health knowledge base for someone — organising medical reports, lab results, prescriptions, scans and consumer genetic data into a structured record that stays current as new documents arrive. Covers setting up the record, extracting data from reports faithfully, reconciling contradictions, ranking what matters now, and preparing briefs for appointments. Use when someone asks to organise medical records, build a health project, track lab trends over time, or prepare for a doctor's visit.
---

# Personal Health Record

Builds a durable, evolving health knowledge base for one person from their own
medical documents.

The problem this solves is real and common: a person's records are scattered
across labs, hospitals and specialists, none of whom sees the whole picture.
Documents arrive as scans, photographs of handwriting, and PDFs in inconsistent
formats. The useful signal — what changed, what is drifting, what nobody has
followed up — is buried in repetition.

## Scope and limits

This skill organises records and prepares people for appointments. It does not
practise medicine.

**Never:**
- Diagnose, or present a possibility as a conclusion
- Tell someone to start, stop, or change the dose of a medication
- Give a numeric target that is not either written in their own records by their
  own clinician, or named explicitly as a general published guideline their
  doctor must individualise
- Treat consumer genetic data as diagnostic

**Always:**
- Frame findings as things to raise with a clinician, with the reasoning
- Lead with an urgent-care instruction if the person describes red-flag symptoms
  (chest pain, stroke symptoms, diabetic ketoacidosis features, sudden vision
  loss, inability to pass urine, spreading infection)
- Say when the record is silent, rather than inferring

## Privacy — read before writing any file

A populated health record contains a named person's diagnoses, national ID
numbers, address and possibly genetic data.

**Never commit populated records to a git repository**, and check before writing
them anywhere shared — a fork of a public repository is public, and a repository
made private later does not retract what was pushed. Write populated files to a
local or scratch directory and hand them to the user directly. Only
de-identified templates belong in version control.

If the user asks for the record to be committed, tell them what it would expose
and offer the split: templates in the repo, populated files delivered to them.

## Building the record

### 1. Extract faithfully

For every document capture: document type, facility, clinician, **collection
date** (more important than report date), and every value with units and
reference range — including the normal ones, which are what prove a trend later.

Never round. Never skip. Never guess a drug name or dose from context: mark it
`[ILLEGIBLE — needs re-photographing]` and log it. A wrong drug name in a health
record is worse than a missing one.

For large multi-page PDFs, dispatch parallel subagents, one per document, each
returning a structured summary. Verify page counts — reported counts are often
wrong.

### 2. Reconcile before adding

Four checks on every new document:

- **Duplicate?** Match on facility + collection date + case number. The same
  report is frequently uploaded twice under different filenames.
- **Contradiction?** Never silently pick a winner. Record both, flag it, and say
  which is more likely and why. Watch for auto-filled defaults — a date of birth
  equal to the visit date is a form default, not a fact.
- **Answers an open question?** Close it with the date and answer.
- **Changes the picture?** A single value rarely does; a value plus a trend often
  does.

### 3. Structure

Six files, described in full with fill-in templates in
[references/templates.md](references/templates.md):

| File | Contents | Load |
|---|---|---|
| `01-patient-profile.md` | Identity, care team, baseline, lifestyle, allergies | always |
| `02-conditions-and-medications.md` | Active problems ranked by attention needed; drugs | always |
| `03-lab-timeline.md` | Every value, append-only, one column per visit | always |
| `04-imaging-and-specialists.md` | Scans, procedures, consultations | on demand |
| `05-genomics.md` | Consumer genetic analysis, with limits stated | on demand |
| `06-open-questions.md` | Gaps, conflicts, unfollowed-up items — the agenda | always |

The lab timeline is **append-only**: each new panel is a new right-hand column,
never an edit. Its value is that it shows direction of travel.

### 4. Rank what matters

Apply the four-tier scale in
[references/prioritisation.md](references/prioritisation.md): ACTIVE,
MONITORED, BACKGROUND, ARCHIVE. Relevance is not recency and is not severity —
it is *likelihood of changing a decision now*. Nothing is ever deleted; items
are demoted.

Two overrides: anything affecting a prescribing decision is ACTIVE regardless of
score; and a background fact is promoted the moment it explains an active
question.

### 5. Report, then hand back files

Tell the user what changed before editing anything:

> **What's new** · **What changed** · **What stayed the same** · **What this
> raises** · **What I'd take to the doctor**

Then regenerate only the changed files, complete and ready to use. Hand back
whole files, never diffs — most destinations (ChatGPT projects, shared drives)
cannot patch.

## Analysing consumer genetic data

23andMe, MyHeritage and AncestryDNA raw files are tab- or comma-separated:
rsid, chromosome, position, genotype. See
[references/genomics.md](references/genomics.md) for method, a starting variant
panel, and the interpretation rules.

Essentials:

- **Run QC first** — variant count, no-call rate, autosomal heterozygosity,
  and genetic sex from X heterozygosity and Y presence. A male sample should
  show near-zero X heterozygosity; anything else means a quality problem.
- **Check strand orientation.** These files report the forward strand, which
  often differs from how a variant is described in the literature. A genotype
  whose alleles do not match the expected pair has been reported on the opposite
  strand — reverse-complement it, and lower your confidence in that call.
- **Report absence explicitly.** A missing variant is not a negative result. If
  a key marker is absent, say the status is *undetermined* and name what a
  clinical test would settle.
- **Prioritise pharmacogenomics.** Drug-metabolism findings are the most
  actionable part of a consumer file. Genetic disease-risk scores mostly are not.
- **Cross-check against measured values.** Where a genetic prediction can be
  compared to a blood result, do it — agreement is a real confidence signal, and
  disagreement is a warning about the file.
- **Handle sensitive results carefully.** APOE status and similar findings carry
  implications for relatives and cannot be untold. Do not volunteer them
  speculatively from proxy markers; say they need a clinical test with
  counselling.

## Keeping it current

Run a review quarterly even with no new uploads: trend check, overdue-screening
check, stale open questions, medication reconciliation, and demotion of settled
items. Output a short summary — what improved, what worsened, what is due, and
the three things to raise next.

## Appointment briefs

One page, tailored to the specialty: who they are in a line, why they are there,
what changed since last time, current medications with uncertainties marked,
questions in priority order phrased as the patient would say them, and what to
bring. A doctor with ten minutes reads one page and does not read four.

## Answering well

Lead with the one thing that matters most, with its number, dates and direction.
Then what else is active, then **what is genuinely going well** — specifically,
not as a platitude. Most records contain real good news, and burying it gives a
false picture and discourages the person. Finish with the one or two concrete
next steps, framed as questions for their doctor.

Resist listing everything. A complete answer that buries the important thing is
worse than a short one that leads with it.
