# Consumer Genetic Data Analysis

How to process a 23andMe / MyHeritage / AncestryDNA raw data file as part of a
personal health record.

## What these files are

Plain text, tab- or comma-separated, one variant per line:

```
RSID,CHROMOSOME,POSITION,RESULT
"rs3131972","1","752721","GG"
```

Typically 500k–700k variants on build GRCh37 (build 37 / hg19). Some newer
files are imputed low-pass whole-genome sequencing rather than genotyping
arrays — the header usually says which.

## Mandatory framing

State these limits before any findings, every time:

1. **Not a clinical test.** These files carry an explicit disclaimer that they
   are for genealogical use. Individual calls can be wrong, especially in
   imputed data.
2. **Common variants only.** Most rare disease-causing mutations are invisible
   to these arrays, and genes are not sequenced end to end. **A negative result
   does not rule anything out.**
3. **Never a diagnosis.** Anything that would change treatment must be confirmed
   by an accredited clinical laboratory.

## Step 1 — Quality control, before any interpretation

| Check | Method | Expected |
|---|---|---|
| Variant count | line count | 500k–700k typical |
| No-call rate | count `--`, `00`, empty | <1% is good; >5% questionable |
| Autosomal heterozygosity | het / total autosomal calls | ~15–25% |
| Genetic sex | X heterozygosity + Y call count | Male: Y present, X het ≈ 0. Female: no Y, X het normal |
| Chromosome coverage | count per chromosome | all of 1–22, X; Y and MT vary |

A male sample with meaningful X heterozygosity indicates contamination or a
processing error — stop and say so rather than interpreting.

## Step 2 — Strand orientation

**This is the most common source of wrong interpretation.**

These files report the **forward (+) strand** of the reference build. Published
literature often describes a variant in the gene's orientation, which for
genes on the minus strand is the reverse complement.

Practical rule: if a genotype's alleles do not match the expected allele pair
for that variant, it has been reported on the opposite strand. Reverse-complement
it (A↔T, C↔G) and **lower your stated confidence** in that call.

Example: a variant documented as `G>A` that reads `CT` in the file is the same
variant reported on the other strand — `C` corresponds to `G`, `T` to `A`.

**A/T and C/G variants are irreducibly ambiguous** — the reverse complement is
indistinguishable from the original. Flag these as low confidence and do not
build conclusions on them.

## Step 3 — What to look up, in priority order

### Pharmacogenomics — the most actionable part of any consumer file

| Gene | Key variants | Clinical relevance |
|---|---|---|
| SLCO1B1 | rs4149056 | Statin-induced myopathy risk |
| CYP2C19 | rs4244285 (*2), rs4986893 (*3), rs12248560 (*17) | Clopidogrel, PPIs, some antidepressants |
| CYP2D6 | rs3892097 (*4), rs1065852 (*10) | Codeine, tramadol (prodrugs — reduced function means reduced analgesia), many antidepressants |
| CYP2C9 | rs1799853 (*2), rs1057910 (*3) | Warfarin, NSAIDs |
| VKORC1 | rs9923231 (proxy rs9934438) | Warfarin dosing |
| TPMT | rs1800460, rs1142345 | Thiopurine toxicity |
| DPYD | rs3918290 | 5-fluorouracil toxicity |
| UGT1A1 | rs887829, rs6742078 | Gilbert's syndrome; irinotecan toxicity |
| G6PD | rs1050828, rs5030868 | Haemolysis with certain drugs — common in South Asian, African and Mediterranean populations |
| HLA-B*57:01 | rs2395029 (proxy) | Abacavir hypersensitivity |

**CYP2D6 caveat:** the gene has copy-number variants, deletions and
duplications that arrays cannot see. Array-based CYP2D6 calls are indicative
only and need a proper panel before they drive prescribing.

### Conditions with a strong single-variant contribution

| Area | Variants |
|---|---|
| Fatty liver | PNPLA3 rs738409, TM6SF2 rs58542926, MBOAT7 rs641738, HSD17B13 rs72613567 (protective) |
| Haemochromatosis | HFE rs1800562 (C282Y), rs1799945 (H63D) |
| Thrombophilia | F5 rs6025 (Factor V Leiden), F2 rs1799963 (prothrombin G20210A) |
| Alpha-1 antitrypsin | SERPINA1 rs28929474 (PiZ), rs17580 (PiS) |
| Lipoprotein(a) | LPA rs10455872, rs3798220 |
| Familial hypercholesterolaemia | PCSK9 rs11591147 (protective) — note arrays miss most LDLR mutations |

### Polygenic contributors — interpret with restraint

Type 2 diabetes (TCF7L2 rs7903146 is the strongest common variant; also KCNQ1,
SLC30A8, CDKAL1, CDKN2A/B, FTO, MTNR1B, KCNJ11, HHEX), coronary disease (9p21:
rs1333049, rs10757278), osteoarthritis (GDF5 rs143383).

These shift risk modestly. Say so. Someone who carries no risk alleles at the
strongest diabetes locus can still have diabetes — which is a useful, honest
point to make, because it means the modifiable factors carry more weight.

### Everyday findings that genuinely help

MTHFR rs1801133/rs1801131 (folate — and a corrective for online supplement
marketing), CYP1A2 rs762551 (caffeine clearance), LCT rs4988235 (lactose
tolerance), vitamin D genetics (GC rs2282679, CYP2R1 rs10741657).

## Step 4 — Report absence as absence

Key markers are frequently missing from consumer files. **A missing variant is
not a negative result.**

When a marker is absent, say the status is **undetermined**, explain what it
would have told you, and name the clinical test that would settle it. Build an
explicit "could not determine" section — it is as valuable as the findings.

Do not substitute proxy markers for a missing variant and present the result as
if it were measured. Proxy linkage varies by population and is often weaker in
non-European ancestries.

## Step 5 — Cross-check against measured values

Where a genetic prediction can be compared against a laboratory result the
person already has, do it explicitly:

| Prediction | Compare against |
|---|---|
| LPA risk variants | Measured Lp(a) |
| MTHFR genotype | Measured homocysteine |
| UGT1A1 Gilbert's genotype | Bilirubin, especially the unconjugated fraction |
| Lipid-raising variants | Measured lipid panel |
| Haemochromatosis variants | Ferritin, transferrin saturation |

Agreement is a genuine confidence signal for the whole file. Disagreement is a
warning — report it rather than explaining it away.

## Sensitive results

Some findings carry implications beyond the individual and cannot be untold.
**APOE** (Alzheimer's risk) is the main one; carrier status for recessive
conditions and any cancer-predisposition variant also qualify.

Handle these by: not volunteering a speculative call from proxy markers; stating
plainly when the defining marker is absent so no conclusion can be drawn; and
recommending a clinical test with genetic counselling if the person wants to
know. Note that these results have implications for their children and siblings.

If the record is being built for someone by a family member, flag that a
sensitive result is about to be surfaced and let them decide whether it belongs
in a shared knowledge base.

## Output structure

1. File quality and QC — including genetic sex confirmation
2. The mandatory limits, stated up front
3. Findings that matter clinically, most actionable first, each with the
   variant, genotype, and what it does and does not mean
4. What could **not** be determined, and what would settle it
5. A cross-check table against measured values
6. Suggested next step, if any, framed as a discussion for their doctor
