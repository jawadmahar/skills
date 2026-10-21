# The interview (multiple choice)

Two or three short rounds of multiple-choice questions before production. They take the user a minute or two and stop the mistakes that cost a full re-render: the wrong offer, wrong dates, wrong audience, wrong tone.

## How to ask

- Use the multiple-choice question tool (AskUserQuestion in Claude Code). If there is no such tool, send the same questions as a numbered list with lettered options in one message.
- Up to four questions per round, two to four options each. Put the recommended option first and add "(Recommended)". The user can always type their own answer.
- Pre-fill from what you already know (guidelines, brief, earlier campaigns, Meta data). Do not ask what you know; state it as an assumption in the round's intro instead, e.g. "I'll keep £18 tickets and the same T&Cs unless you say otherwise."
- Ask about anything expensive to get wrong. Skip anything cheap to change later.
- After the last round, summarise the decisions in five to eight bullets and get going.

## Round 1: campaign facts

| Question | Typical options |
|---|---|
| Which offer runs, exactly? | The current offer as worded in the brief (Recommended) / A different offer / No offer, brand awareness only |
| Dates and end wording? | Fixed start and end date (Recommended) / Ongoing until further notice / Date plus "we may end this offer sooner" |
| Who matters most? | All key audiences equally (Recommended) / A named audience first (e.g. grandparents) / A new audience to test |
| Prices and terms unchanged? | Same as last campaign (Recommended) / Price change / New terms |

For promotions with an end date, confirm the exact wording of any early-end clause and read the promotions section of `compliance-uk.md` first.

## Round 2: creative direction

| Question | Typical options |
|---|---|
| How many videos, and how long? | Mix of 8, 12 and 15 seconds (Recommended) / All short, 6 to 10 seconds / Some longer stories, 20 to 30 seconds |
| Which series? | Mostly proven concepts plus some new (Recommended) / Half and half / Mostly new concepts |
| Seasonal moments to include? (multi-select) | Pick from the calendar for the dates, e.g. Bonfire Night, Black Friday, Christmas, New Year, half term |
| Tone? | Warm and playful (Recommended for family brands) / Bold and urgent / Calm and premium |

## Round 3: delivery

| Question | Typical options |
|---|---|
| Formats? | 9:16 only for Reels and Stories (Recommended) / 9:16 plus 4:5 versions of the best for Feed / 9:16 plus 1:1 |
| Music? | A new licensed track for every video (Recommended) / Reuse proven tracks where they fit / One sonic identity across the set |
| How should the files arrive? | One zip per batch or month (Recommended) / One zip for everything / One zip per series |
| Google Drive? | Upload to a new folder (Recommended) / Upload to an existing folder / No Drive, files in chat only |

Ask who should receive the files only if sharing is wanted, and never share a Drive folder with anyone until the user confirms the exact email address.

## The feedback round (at delivery)

Ask straight after delivering, while the work is fresh:

1. "Which are your favourites?" (multi-select, list four standouts, the rest via Other)
2. "What should change next time?" (multi-select): More like the favourites / Different photos / Different music / Shorter / Bolder offer / Nothing, keep going

Log the answers as active feedback (`feedback-loop.md`).

## Example call

```json
{
  "questions": [
    {
      "header": "Offer",
      "question": "Which offer should the videos show from Mon 2 Nov?",
      "multiSelect": false,
      "options": [
        {"label": "Keep buy 2, get 3rd free (Recommended)", "description": "Same maths and T&Cs as half term: 3 for £36"},
        {"label": "Switch offer in December", "description": "B2G3 in November, a gift or voucher push in December"},
        {"label": "Different offer each month", "description": "I'll give you the offers"}
      ]
    }
  ]
}
```
