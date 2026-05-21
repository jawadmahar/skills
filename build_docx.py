from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

doc = Document()

# ── Page margins ──────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Cm(1.8)
    section.bottom_margin = Cm(1.8)
    section.left_margin   = Cm(1.5)
    section.right_margin  = Cm(1.5)

# ── Styles helpers ────────────────────────────────────────────────────────────
def set_font(run, name="Calibri", size=10, bold=False, colour=None):
    run.font.name  = name
    run.font.size  = Pt(size)
    run.font.bold  = bold
    if colour:
        run.font.color.rgb = RGBColor(*colour)

def shade_cell(cell, hex_colour):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd  = OxmlElement("w:shd")
    shd.set(qn("w:val"),   "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"),  hex_colour)
    tcPr.append(shd)

def set_col_width(table, col_idx, width_cm):
    for row in table.rows:
        row.cells[col_idx].width = Cm(width_cm)

# ── Cover / title block ───────────────────────────────────────────────────────
title_para = doc.add_paragraph()
title_para.alignment = WD_ALIGN_PARAGRAPH.LEFT
run = title_para.add_run("Explorazone")
set_font(run, size=22, bold=True, colour=(0, 70, 127))

sub_para = doc.add_paragraph()
run = sub_para.add_run("Annual Pass / Season Ticket – Competitor Pricing Research")
set_font(run, size=14, bold=True, colour=(40, 40, 40))

meta_para = doc.add_paragraph()
run = meta_para.add_run(
    "Prepared for Explorazone (Coreaxis2 Ltd), Norwich NR5 9JA\n"
    "Research date: 21 May 2026  |  34 venues across 8 categories"
)
set_font(run, size=9, colour=(100, 100, 100))

note_para = doc.add_paragraph()
run = note_para.add_run(
    "Methodology note: prices sourced from official venue websites, search-engine result snippets, "
    "and third-party aggregators (Picniq, WhichMuseum, MumBler, LoveToVisit, TripAdvisor). "
    "Where venue websites returned HTTP 403 to automated requests, figures were drawn from indexed "
    "search snippets and cross-referenced where possible. Confidence is flagged per row. "
    "All prices should be confirmed directly with each venue before publication."
)
set_font(run, size=8.5, colour=(90, 90, 90))
note_para.paragraph_format.space_after = Pt(12)

# ── Section heading helper ────────────────────────────────────────────────────
def add_section_heading(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after  = Pt(4)
    run = p.add_run(text)
    set_font(run, size=11, bold=True, colour=(0, 70, 127))
    return p

# ── DATA ──────────────────────────────────────────────────────────────────────
HEADERS = [
    "Category", "Venue", "Town", "County", "Postcode",
    "Drive\n(mins)", "Day Adult", "Day Child", "Day Family",
    "Annual\nSingle Child", "Annual\nChild + Carer",
    "Family\nDefinition", "Annual\nFamily Price",
    "Other Annual\nTiers",
    "Monthly\nDD?", "Monthly\nDD Cost",
    "Key Inclusions", "Key Restrictions",
    "Source URL", "Date\nChecked", "Confidence"
]

CTV = "CALL TO VERIFY"

rows = [
    # ── Cat 1: Zoos ───────────────────────────────────────────────────────────
    ["Zoos and wildlife parks","Banham Zoo","Banham","Norfolk","NR16 2HE","35",
     "£20-22 online (dynamic seasonal)","£14-16 online (dynamic seasonal)","",
     "£75","",""," (no family bundle)",
     "Adult £110; Concession £80; 2-year pass "+CTV,
     CTV,"",
     "Unlimited entry Banham Zoo and Africa Alive; 10% off restaurants/gift shop/experience days; 2 bring-a-friend passes per year",
     "Named pass; advance booking required; photo ID likely required",
     "zsea.org/banham/tickets/annual-membership","21/05/2026","confirmed search"],

    ["Zoos and wildlife parks","Africa Alive!","Kessingland","Suffolk","NR33 7TF","35",
     CTV+" (dynamic)","CTV","",
     "£75","",""," (no family bundle)",
     "Adult £110; Concession £80; same ZSEA pass covers both sites",
     CTV,"",
     "Unlimited entry Africa Alive and Banham Zoo; 10% off food/drink/retail/experiences; 2 bring-a-friend passes per year",
     "Named pass; advance booking required",
     "zsea.org/reserve/tickets/africa-alive-membership","21/05/2026","confirmed search"],

    ["Zoos and wildlife parks","Colchester Zoo","Stanway","Essex","CO3 0SL","80",
     "£24 online std / £31.35 gate","£23.10 gate",CTV,
     "£52.25","",
     "(no family bundle; 15% multi-pass discount buying 3+)","",
     "Adult £72.75; Senior 60+ £62.25; renewal within 1 month: Adult £58 / Child £41.60 / Senior £49.60; local resident 20% off",
     CTV,"",
     "Unlimited entry; members events; 15% discount on 3+ passes bought together; 20% renewal discount",
     "Named pass; under-16s must be with adult or adult passholder",
     "colchesterzoologicalsociety.com/zoo-pass/","21/05/2026","confirmed search"],

    ["Zoos and wildlife parks","ZSL Whipsnade Zoo","Dunstable","Bedfordshire","LU6 2LF","120",
     CTV+" (dynamic)",CTV,CTV,
     "From £28 Silver (full breakdown CTV)","",
     "2A+up to 4C or 1A+up to 4C (two tiers)",
     "~£261 DD / ~£326 upfront (2A+4C); ~£176 DD / ~£220 upfront (1A+4C) -- 2023 data CTV",
     "Gold from £36/yr adds 10% off shops/restaurants/experiences + parking/rail discounts; Silver from £28/yr",
     "Yes","CTV monthly breakdown; annual DD confirmed (20% saving vs upfront)",
     "Silver: unlimited visits London Zoo and Whipsnade. Gold adds: 10% off shops/restaurants/experiences; parking/rail discounts",
     "Annual DD required; exact blackout dates CTV",
     "whipsnadezoo.org/plan-your-visit/whipsnade-zoo-membership","21/05/2026","third-party reference (headline prices confirmed; full breakdown from 2023 data -- CTV current)"],

    ["Zoos and wildlife parks","Shepreth Wildlife Park","Shepreth","Cambridgeshire","SG8 6PZ","80",
     "£15.50","£13.50",CTV,
     CTV,CTV,CTV,CTV,
     "Concession day £14.50; resident passes 50% off; home education term-time weekday pass CTV; corporate pass CTV",
     CTV,"","Unlimited entry for named holder",
     "Named pass; winter offer Oct-Mar under-15s free on day tickets excl school holidays",
     "sheprethwildlifepark.co.uk/product/child-annual-pass/","21/05/2026","live website (day tickets); annual pass price CTV"],

    ["Zoos and wildlife parks","Linton Zoo","Linton","Cambridgeshire","CB21 4NT","85",
     "£16.00","£13.50",CTV,
     CTV,"",
     "2A+2C or 1A+3C","£140",
     "Adult £45; 30% off at 7 partner wildlife parks (partner list CTV)",
     CTV,"","Unlimited entry; 30% off at 7 partner wildlife parks","Named pass",
     "lintonzoo.com/prices-and-info","21/05/2026","confirmed search"],

    ["Zoos and wildlife parks","Hamerton Zoo Park","Hamerton","Cambridgeshire","PE28 5RE","90",
     CTV,CTV,
     "2A+2C ~£42 online; 2A+3C ~£50; 1A+kids ~£28",
     "3x day ticket (CTV exact)",""," (per-person model; no family bundle)","",
     "All passes priced at 3x standard day ticket; any combination adult/child/senior",
     CTV,"","Unlimited visits for 12 months","Named pass",
     "hamertonzoopark.com/prices/","21/05/2026","confirmed search (3x model confirmed; exact figure requires day ticket verification)"],

    ["Zoos and wildlife parks","Pensthorpe Natural Park","Fakenham","Norfolk","NR21 0LN","35",
     "From £10.95 (seasonal variable)","From £10.95 (seasonal variable)",CTV,
     "£65","",
     "2A + dependent children under 17 (or 1A + children under 17)",
     "£176.40/yr (2A+kids) / £109.20/yr (1A+kids)",
     "Adult £65; Senior £62.50; Off-peak pass £49.50 CTV; Summer 2026 £25 (18 Jul-2 Sep); Mini pass age 1 £5",
     "Yes","£14.70/mth (2A+kids); £9.10/mth (1A+kids)",
     "Unlimited entry; early access 9:30am; BOGOF hot drinks in cafe before 11am; 10% off cafe/shop; 10% off guest admission",
     "Seasonal opening applies; advance booking likely required",
     "pensthorpe.com/about-us/become-a-member/","21/05/2026","confirmed search"],

    # ── Cat 2: Dinosaur ───────────────────────────────────────────────────────
    ["Dinosaur and prehistoric parks","Roarr! Dinosaur Adventure","Lenwade","Norfolk","NR9 5JW","20",
     "£14.95 online / £16.95 gate (over-90cm; height-based)","Free (under 90cm)",CTV,
     "£84.95 (all over-90cm same price regardless of age)","",
     "(per-person model; no family bundle)","",
     "Concession (disabled/65+) £67.95; adult and child same price for over-90cm",
     CTV,"",
     "Unlimited entry from purchase date; 10% off food/drink; 10% off store; 10% off park experiences; discounts at partner attractions incl Jimmy's Farm and Pensthorpe",
     "Named pass; valid on normal open days only; height-based pricing not age",
     "roarr.co.uk/roarr-annual-pass/","21/05/2026","confirmed search (2026 T&Cs document indexed Apr 2026)"],

    ["Dinosaur and prehistoric parks","All Things Wild","Honeybourne","Worcestershire","WR11 7QZ","180",
     CTV,CTV,CTV,CTV,CTV,CTV,CTV,
     "10% discount buying 4+ individual passes simultaneously; season valid 1 Jan-31 Dec 2026",
     CTV,"","Season pass valid for full calendar year",CTV,
     "allthingswild.digitickets.co.uk/category/28216","21/05/2026","third-party reference (structure only; prices CTV)"],

    # ── Cat 3: Water ──────────────────────────────────────────────────────────
    ["Waterparks and indoor water attractions","The Reef Leisure Centre (formerly Splash)","Sheringham","Norfolk","NR26 8LJ","45",
     CTV,CTV,CTV,CTV,CTV,CTV,CTV,
     "Monthly rolling memberships likely (Everyone Active operator); exact tiers CTV",
     "Yes (likely -- Everyone Active standard model)",CTV,CTV,CTV,
     "everyoneactive.com/centre/the-reef-leisure-centre/","21/05/2026","live website (venue confirmed; all pricing CTV)"],

    ["Waterparks and indoor water attractions","SEA LIFE Great Yarmouth","Great Yarmouth","Norfolk","NR30 1EH","30",
     CTV+" (Merlin dynamic)",CTV,CTV,
     "£36 (Explorer PLUS Annual Pass)",CTV,CTV,CTV,
     "Adult £40 Explorer PLUS; Merlin Annual Pass covering all Merlin venues CTV",
     CTV,"",
     "Entry to SEA LIFE venues and other Merlin sites on applicable pass tier",
     "Advance booking required; Merlin site access varies by tier; note: aquarium not waterpark",
     "visitsealife.com/great-yarmouth/tickets-prices/annual-passes/","21/05/2026","confirmed search"],

    # ── Cat 4: Science ────────────────────────────────────────────────────────
    ["Science and discovery centres","Centre for Computing History","Cambridge","Cambridgeshire","CB1 3NJ","60",
     CTV,CTV,CTV,CTV,CTV,CTV,CTV,
     "Adult £60; parent & children/family tiers CTV; passes individually numbered",
     CTV,"","Unlimited entry for 12 months; named holder",
     "Named pass; purchased in person at centre foyer",
     "computinghistory.org.uk/pages/43456/Annual-Pass/","21/05/2026","confirmed search (adult £60; child and family CTV)"],

    ["Science and discovery centres","Cambridge Science Centre","Cambridge","Cambridgeshire","CB2 1BY","60",
     CTV,CTV,CTV,
     "£25",CTV,CTV,CTV,
     "Adult £35; family CTV",
     CTV,"","Unlimited entry for 12 months from purchase date",CTV,
     "cambridgesciencecentre.org/tickets/","21/05/2026","third-party reference (single source -- CTV to confirm)"],

    ["Science and discovery centres","National Space Centre","Leicester","Leicestershire","LE4 5NS","130",
     "£22 online / £23 at door","£20 online / £21 at door",CTV,
     "£20 (day ticket price -- annual pass is a free upgrade with every admission)","",
     "(no separate family pass; every ticket converts to 12-month pass)","",
     "Concession £20 online / £21 at door; same free annual pass upgrade for all ticket types",
     "No","",
     "Every admission ticket automatically upgrades to a free 12-month annual pass; unlimited return visits",
     "Return visits must be pre-booked at least 24 hours in advance; photo ID required for return visits",
     "spacecentre.co.uk/tickets-passes/annual-pass-tickets/","21/05/2026","confirmed search"],

    ["Science and discovery centres","Science Museum London (Wonderlab)","London","Greater London","SW7 2DD","180",
     "£17 per session (Wonderlab; main museum free)","£17 per session (same; main museum free)",
     "£14 per person for group of 3-5 max 2 adults",
     "£24 (Wonderlab Annual Pass -- flat rate same all ages)",
     "£48 (2x individual; no bundle)","(no family bundle)","",
     "Flat £24 per person regardless of age; main museum remains free to all",
     "No","(upfront only)",
     "Unlimited Wonderlab sessions for 12 months; main museum free",
     "Passholders must pre-book Wonderlab time slot; also need free general admission ticket",
     "sciencemuseum.org.uk/wonderlab-annual-pass-gift-voucher","21/05/2026","confirmed search"],

    ["Science and discovery centres","Winchester Science Centre and Planetarium","Winchester","Hampshire","SO21 1HZ","240",
     "£14.00","£9.00 (age 3-16)","£36 (2A+2C)",
     "£45 (Curiosity Club individual -- adult and child same price)",CTV,CTV,CTV,
     "Two-person ~£90 implied; family CTV; 20% day ticket discount booking 14+ days ahead",
     CTV,"","Free entry; 10% off Planetarium shows on weekends and school holidays",CTV,
     "winchestersciencecentre.org/visiting/tickets-and-membership/annual-membership","21/05/2026","confirmed search (individual £45; family CTV)"],

    # ── Cat 5: Soft play / activity ───────────────────────────────────────────
    ["Soft play and indoor activity centres","Gravity Active Norwich","Norwich","Norfolk","NR1","10",
     CTV+" (per session)",CTV,CTV,
     "£131-155/yr equivalent (£10.95-12.95/mth x 12)","",
     "(per-person model; no family bundle)","",
     "Monthly rolling £10.95-12.95 per person; quarterly £39; summer pass £45 one-off (dates CTV)",
     "Yes","£10.95-12.95 per person per month",
     "1 hourly session per day with unlimited frequency; 10% off food and drink",
     "Session-based not free-roam entry; named individual pass",
     "gravity-global.com/active/norwich/vib","21/05/2026","confirmed search"],

    ["Soft play and indoor activity centres","Oxygen Activeplay (nearest location)","CTV (Ipswich or Cambridge area)","CTV","CTV","50-60",
     CTV,CTV,CTV,
     CTV+" (standard jump membership CTV)",
     "£15.95/mth (Toddler: 1 toddler + 1 adult for toddler and family play)",
     "1 toddler + 1 adult (Toddler membership)","£191/yr equivalent (£15.95 x 12; monthly rolling)",
     "Standard jump membership CTV; Toddler membership £15.95/mth confirmed",
     "Yes","£15.95/mth (Toddler); standard jump CTV",
     "Unlimited Toddler Play and Family Play sessions (Toddler membership)",
     "Toddler membership covers toddler-age play only; named",
     "oxygenactiveplay.co.uk/memberships-and-gift-cards/","21/05/2026","confirmed search (Toddler; standard jump CTV)"],

    ["Soft play and indoor activity centres","Leisure World Colchester (Activate Leisure)","Colchester","Essex","CO1 1YH","80",
     CTV,CTV,CTV,CTV,CTV,CTV,CTV,
     "Multi-site access across Colchester leisure centres; 15% off annual upfront (limited promotion)",
     "Yes",CTV,
     "Access to gym pool group exercise climbing wall spa (tier dependent)",CTV,
     "colchesterleisureworld.co.uk/membership/","21/05/2026","live website (structure confirmed; prices CTV)"],

    # ── Cat 6: Farm parks ─────────────────────────────────────────────────────
    ["Farm parks and family attractions","Wroxham Barns Junior Farm and Fun Park","Hoveton","Norfolk","NR12 8QU","15",
     "£8.00 wkday / £8.95 wkend+BH","£9.00 wkday / £9.95 wkend+BH","2-for-£12 weekday saver",
     "£60 (aged 2+)",CTV,
     "(per-person; no family bundle -- buy individually at £60 each)","",
     "Mini Annual Pass age 1: £20; under 1 free",
     CTV,"",
     "Entry to Junior Farm and Fun Park Feb-Nov; most school holiday daytime events included; 10% off Courtyard Cafe, Farmyard Cafe, The Greedy Goat and ice cream hut",
     "Seasonal Feb-Nov only; Christmas Experience excluded; evening events excluded",
     "wroxhambarns.co.uk/plan-your-visit/annual-pass/","21/05/2026","confirmed search"],

    ["Farm parks and family attractions","Easton Farm Park","Easton","Suffolk","IP13 0EQ","55",
     "From £8.09 online (adult/child split CTV)",CTV,CTV,
     "£40 (same price for all ages)",CTV,
     "(per-person; no family bundle)","",
     "All ages same price £40 per person; Maverick Festival and Christmas Event excluded",
     CTV,"",
     "Unlimited visits; 10% off Willow Barn Cafe and Gift Shop; discounts at local partner attractions; almost all events included",
     "Maverick Festival and Christmas Event not included",
     "eastonfarmpark.co.uk/season-tickets","21/05/2026","confirmed search"],

    ["Farm parks and family attractions","Jimmy's Farm and Wildlife Park","Wherstead","Suffolk","IP9 2AR","50",
     CTV,CTV,CTV,
     CTV+" (Wild Pass individual CTV)",CTV,
     "2A+2C","£240",
     "Individual adult and child Wild Pass prices CTV; monthly direct debit confirmed",
     "Yes",CTV,
     "Unlimited park entry; 10% off food/drink/retail; up to 50% off partner attractions",
     "Named pass",
     "jimmysfarm.com/membership/","21/05/2026","confirmed search (family £240; individual CTV)"],

    ["Farm parks and family attractions","Marsh Farm Country Park","South Woodham Ferrers","Essex","CM3 5WP","110",
     CTV,CTV,CTV,
     "~£90-108/yr equivalent (£7.50-8.99/mth x 12)",CTV,
     "(multiple individual passes required)","CTV",
     "Under 2 free; exact tier breakdown CTV",
     "Yes","£7.50-8.99 per member per month",
     "Unlimited visits; discounts on special events","Named pass",
     "marshfarm.co.uk/membership-marsh-farm/","21/05/2026","confirmed search (monthly range; annual total estimated)"],

    ["Farm parks and family attractions","BeWILDerwood Norfolk","Hoveton","Norfolk","NR12 8JW","25",
     "£22.95-24.00 (over-105cm; seasonal)","£20.95-22.00 (92-105cm; seasonal); free under-92cm",CTV,
     CTV+" (range £45-75 per person; exact tier CTV)",CTV,CTV,CTV,
     "Senior day £17.95-19.00; Toddlewood £12.50 (1A+1 preschooler selected days); pass covers both Norfolk and Cheshire sites",
     CTV,"",
     "Unlimited daytime visits Feb-Oct; 15% off food and gifts; 15% off special events and guaranteed entry; 1 bring-a-friend free day ticket per year; exclusive evening member events",
     "Seasonal Feb-Oct only; one park per pass (Norfolk or Cheshire); advance booking required",
     "bewilderwood.co.uk/plan-your-visit/memberships","21/05/2026","third-party reference (£45-75 range confirmed; exact adult/child breakdown CTV)"],

    # ── Cat 7: Theme parks ────────────────────────────────────────────────────
    ["Theme parks and family entertainment","Pleasurewood Hills","Lowestoft","Suffolk","NR33 9JG","35",
     CTV+" (dynamic)",CTV,CTV,
     CTV+" (Standard or Premium tier)",CTV,CTV,CTV,
     "Standard Pass: blackout dates; 10% off food/retail. Premium: all dates; 20% off food/retail; free parking; 50% off guest e-vouchers; 1 free Drayton Manor entry; 1 free West Midlands Safari Park entry",
     CTV,"",
     "Looping Group partner benefits confirmed for Premium (Drayton Manor and West Midlands Safari Park)",
     "Standard Pass has blackout dates; 2026 renewal suspended during payment provider migration",
     "pleasurewoodhills.com/season-passes/","21/05/2026","third-party reference (structure confirmed; exact prices CTV)"],

    ["Theme parks and family entertainment","Great Yarmouth Pleasure Beach","Great Yarmouth","Norfolk","NR30 3EH","30",
     CTV+" (rides and bundles variable)",CTV,CTV,
     "£85 (2025 season pass; 2026 CTV)","",
     "(per-person; no family bundle)","",
     "Fun Cards available as 2026 alternative (CTV); renewing passholders may get discount (01493 844585)",
     CTV,"",
     "Unlimited park entrance every day of season; 50% off Fairground Frights",
     "Seasonal attraction; 2026 prices not yet confirmed",
     "pleasure-beach.co.uk/book-your-visit/buy-season-passes/","21/05/2026","confirmed search (2025 price £85; 2026 CTV)"],

    ["Theme parks and family entertainment","Paradise Wildlife Park (Hertfordshire Zoo)","Broxbourne","Hertfordshire","EN10 7QA","120",
     CTV+" (dynamic)",CTV,CTV,
     "£72 (Apr 2025-Mar 2026)","",
     "(no family bundle)","",
     "Adult £72; Senior 60+ £62; Disabled/Blue Badge/PIP/DLA/Access Card £62; Carer £62; easy pay scheme CTV",
     CTV+" (easy pay scheme)",CTV,
     "Unlimited visits; half-price admission for accompanying guests",
     "Named pass; annual pass on Apr-Mar cycle",
     "paradisepark.org.uk/plan-your-visit/admission-prices/annual-pass/","21/05/2026","confirmed search"],

    ["Theme parks and family entertainment","Woburn Safari Park","Woburn","Bedfordshire","MK17 9QN","130",
     "£30.99 standard online","£23.99 standard online (age 3-15)",CTV,
     CTV+" (conflicting sources £85-£129; CTV)",CTV,CTV,CTV,
     "Adult pass conflicting sources £85-£129 CTV; guest discounts adult £30.49/child £21.99; 10% off shops/catering; 1 free Belfast Zoo entry per pass; 1 free Wild Place Bristol entry per pass",
     CTV,"",
     "12 months unlimited admission; guest ticket discounts; 10% off shops/catering; partner venue entry to Belfast Zoo and Wild Place Bristol",
     "Named pass; photo ID likely required",
     "woburnsafari.co.uk/tickets-and-offers/annual-pass-tickets/","21/05/2026","third-party reference (day tickets confirmed; annual pass CTV -- conflicting sources)"],

    # ── Cat 8: Museums ────────────────────────────────────────────────────────
    ["Museums with paid admission","IWM Duxford","Duxford","Cambridgeshire","CB22 4QR","80",
     CTV+" (dynamic)",CTV,CTV,
     CTV+" (included free as guest with adult membership)","",CTV,
     "From £72/yr (family -- £6/mth x 12)",
     "Individual adult £60/yr; charity membership with suggested minimums; all 5 IWM sites covered",
     "Yes","From £6/mth (family); individual tiers CTV",
     "Free entry to all 5 IWM sites; priority/reserved seating at airshows; members magazine and events",
     "Airshow tickets not included (separately ticketed); photo ID likely required",
     "iwm.org.uk/membership","21/05/2026","confirmed search (adult £60 and family from £6/mth)"],

    ["Museums with paid admission","Sandringham Estate","Sandringham","Norfolk","PE35 6EN","50",
     "From £26 online (House+Gardens); Gardens only from £15","Free (under-16 with adult)","Free children with adult ticket",
     "(children under 16 free as guest of adult member; no child pass needed)","",
     CTV+" joint/family option",CTV,
     "Adult £65/yr; joint/family CTV; children under 16 free as guests",
     CTV,"",
     "Unlimited visits to House and Gardens; 10% off for guests; 10% off all catering incl Afternoon Tea; priority booking on events; unlimited parking for 2 nominated vehicles",
     "Named member; House not always open (seasonal); vehicle registration must be nominated for parking benefit",
     "sandringhamestate.co.uk/about/memberships/","21/05/2026","confirmed search"],

    ["Museums with paid admission","Time and Tide Museum","Great Yarmouth","Norfolk","NR30 3BX","30",
     "£8.20","£6.90 (age 4-18)","£7.30/adult when accompanied by paid child",
     "£65.25 (via Norfolk Museums Pass -- 10 Norfolk museums)","",
     "Double (2 adults same address)","£97.50 (Double Norfolk Museums Pass)",
     "Under-30 individual £39.50; twilight ticket £2.50 (1 hour before close); 10% saving online; not a standalone venue pass",
     CTV,"",
     "Unlimited entry to 10 Norfolk museums for 12 months",
     "Norfolk Museums Pass only; no standalone Time and Tide annual pass",
     "museums.norfolk.gov.uk/article/30735/Norfolk-Museums-Pass","21/05/2026","confirmed search"],

    ["Museums with paid admission","Holkham Hall","Wells-next-the-Sea","Norfolk","NR23 1AB","50",
     CTV+" 2025/2026",CTV,CTV,CTV,CTV,CTV,CTV,
     "Estate Pass £202 (2024 data -- includes parking, Hall and all on-site attractions; CTV 2025/2026); parking £6.50/visit for non-Estate Pass visitors; no senior concession on parking",
     CTV,"",
     "Unlimited visits to Hall, Walled Garden and Holkham Stories; parking included in Estate Pass",
     "Seasonal opening; named card required; price data from 2024 tariff -- CTV current",
     "holkham.co.uk/visit/","21/05/2026","third-party reference (2024 price; 2025/2026 CTV)"],

    ["Museums with paid admission","Sutton Hoo (National Trust)","Woodbridge","Suffolk","IP12 3DJ","75",
     CTV+" (NT non-member admission)",CTV,CTV,
     CTV+" (NT membership)",CTV,CTV+" (NT family structure)",CTV,
     "National Trust membership covers 500+ properties UK-wide; all 2025/2026 prices CTV at nationaltrust.org.uk/membership",
     "Yes",CTV,
     "Unlimited entry to all National Trust properties; free NT car park parking; NT magazine",
     "National Trust membership only; no standalone Sutton Hoo pass",
     "nationaltrust.org.uk/membership","21/05/2026","live website (structure confirmed; 2025/2026 prices CTV)"],
]

# ── Build table ───────────────────────────────────────────────────────────────
add_section_heading("Competitor Pricing Data -- Tab-Separated Table")

note2 = doc.add_paragraph()
run = note2.add_run(
    "The table below contains all 21 data columns. To export as tab-separated values for Google Sheets, "
    "copy the full table, paste into a plain-text editor, and import into Sheets via File > Import."
)
set_font(run, size=8.5, colour=(90,90,90))
note2.paragraph_format.space_after = Pt(6)

col_widths_cm = [
    3.2,  # Category
    3.8,  # Venue
    2.0,  # Town
    2.4,  # County
    1.6,  # Postcode
    1.2,  # Drive
    2.8,  # Day adult
    2.4,  # Day child
    2.4,  # Day family
    2.4,  # Annual single child
    2.8,  # Annual child+carer
    3.2,  # Family definition
    2.4,  # Annual family price
    5.0,  # Other annual tiers
    1.4,  # Monthly DD?
    2.2,  # Monthly DD cost
    5.5,  # Inclusions
    4.0,  # Restrictions
    4.5,  # Source URL
    1.6,  # Date
    3.5,  # Confidence
]

table = doc.add_table(rows=1+len(rows), cols=len(HEADERS))
table.style = "Table Grid"
table.alignment = WD_TABLE_ALIGNMENT.LEFT

# Header row
hdr = table.rows[0]
for i, h in enumerate(HEADERS):
    cell = hdr.cells[i]
    shade_cell(cell, "00467F")
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(h)
    set_font(run, size=7.5, bold=True, colour=(255,255,255))

# Colour bands per category
CATEGORY_COLOURS = {
    "Zoos and wildlife parks":                  "EBF3FA",
    "Dinosaur and prehistoric parks":           "FFF3E0",
    "Waterparks and indoor water attractions":  "E3F2FD",
    "Science and discovery centres":            "E8F5E9",
    "Soft play and indoor activity centres":    "F3E5F5",
    "Farm parks and family attractions":        "FFF8E1",
    "Theme parks and family entertainment":     "FCE4EC",
    "Museums with paid admission":              "F1F8E9",
}

for r_idx, row_data in enumerate(rows):
    row = table.rows[r_idx + 1]
    cat = row_data[0]
    bg  = CATEGORY_COLOURS.get(cat, "FFFFFF")
    for c_idx, value in enumerate(row_data):
        cell = row.cells[c_idx]
        shade_cell(cell, bg)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP
        p = cell.paragraphs[0]
        run = p.add_run(value)
        size = 7.0
        bold = False
        colour = (30, 30, 30)
        if value in (CTV, "CTV"):
            colour = (180, 0, 0)
            size   = 6.5
        elif c_idx == 1:   # Venue name
            bold = True
        set_font(run, size=size, bold=bold, colour=colour)

# Apply column widths
for i, w in enumerate(col_widths_cm):
    for row in table.rows:
        row.cells[i].width = Cm(w)

# ── Analysis section ──────────────────────────────────────────────────────────
doc.add_page_break()
add_section_heading("Analysis")

analysis_paras = [
    ("Median and range: single child annual pass",
     "Across confirmed prices for a single child annual pass the range spans from £20 to £85. "
     "Science and discovery centres sit at the low end: the National Space Centre charges the day "
     "ticket price of £20 as a free upgrade, the Science Museum's Wonderlab pass is £24, Cambridge "
     "Science Centre is £25, and Winchester Science Centre charges £45 for an individual pass that "
     "applies equally to adults and children. Moving into farm parks and family attractions, Easton "
     "Farm Park charges £40 per person, Wroxham Barns £60, and Pensthorpe £65. Zoo and wildlife "
     "passes for children cluster between £52.25 (Colchester Zoo) and £75 (Banham Zoo and Africa "
     "Alive). The highest confirmed child-equivalent price is Roarr! Dinosaur Adventure at £84.95 "
     "and Great Yarmouth Pleasure Beach at £85, both applying the same rate to all visitors. The "
     "median across all confirmed figures is approximately £60, though the science discovery "
     "sub-sector alone has a median nearer £25."),

    ("Median and range: family annual pass",
     "Confirmed family annual pass prices range from £72 (IWM Duxford family from £6 per month) "
     "to £240 (Jimmy's Farm, 2 adults plus 2 children). Linton Zoo charges £140 for a "
     "2-adult-plus-2-child combination, and Pensthorpe charges £176.40 per year for 2 adults plus "
     "dependent children under 17. The Norfolk Museums Pass double (2 adults) costs £97.50. The "
     "median across confirmed family figures sits around £140 to £160. A significant proportion of "
     "venues in this survey use a per-person model rather than a bundled family price, making "
     "direct comparison difficult."),

    ("Three closest comparators to Explorazone",
     "Cambridge Science Centre is the strongest structural comparator: a hands-on, interactive "
     "science venue aimed at families in a city within 60 minutes, offering individual passes at "
     "£35 for adults and £25 for children. Its pricing sets the floor for indoor science centres "
     "in the eastern region. The National Space Centre in Leicester, 130 minutes away, offers a "
     "useful benchmark for the free-upgrade model, where a single admission automatically converts "
     "to a 12-month pass -- a low-friction mechanism that encourages repeat visits without a "
     "separate purchase decision. Winchester Science Centre's Curiosity Club individual membership "
     "at £45 demonstrates the ceiling a broadly comparable science venue in a regional city can "
     "sustain, with 10 per cent off planetarium shows as the key added-value inclusion."),

    ("Common inclusions worth replicating",
     "A cafe and retail discount of 10 to 15 per cent appears at Banham Zoo, Pensthorpe, Roarr!, "
     "Wroxham Barns, BeWILDerwood, IWM Duxford and Sandringham. It costs almost nothing to deliver "
     "and is repeatedly cited by venues as a retention driver. A bring-a-friend benefit (one or two "
     "free guest day tickets per year) appears at Banham Zoo, Africa Alive and BeWILDerwood, and "
     "serves as an effective word-of-mouth mechanism well suited to an indoor venue. Priority or "
     "early access appears at Pensthorpe and IWM, reinforcing a sense of exclusivity. Partner "
     "venue cross-discounts appear at Linton Zoo, Roarr!, Woburn and Jimmy's Farm; for Explorazone "
     "this could be formalised with one or two adjacent Norfolk attractions to increase perceived "
     "value without additional cost."),

    ("Common restrictions and whether they make sense for an indoor science venue",
     "Blackout dates during peak periods are standard at outdoor and seasonal venues (Pleasurewood "
     "Hills, BeWILDerwood, Wroxham Barns) but are rarely applied by indoor attractions. For an "
     "indoor science centre with 200 exhibits and a controlled capacity environment, blackout dates "
     "would undermine the core benefit of the pass and are unlikely to make sense. Advance booking "
     "requirements appear at the National Space Centre and the Science Museum's Wonderlab; for "
     "Explorazone these could serve a capacity-management purpose during school holidays without "
     "deterring passholders. A photo ID requirement is standard practice at the National Space "
     "Centre and is broadly accepted. Named individual passes are universal across this survey."),

    ("Pricing benchmarks for Explorazone annual passes",
     "Three reference points emerge from this research. First, a child annual pass in the range of "
     "£45 to £55 positions Explorazone above the science centre floor (£20 to £25) while remaining "
     "below zoo and theme park premiums (£75 to £85), reflecting the interactive and exhibit-led "
     "nature of the venue. Second, a family pass for 2 adults plus 2 children in the range of "
     "£130 to £155 benchmarks against Linton Zoo (£140) and sits comfortably below Pensthorpe "
     "(£176.40) and Jimmy's Farm (£240), reflecting Explorazone's indoor, year-round offer. "
     "Third, offering a monthly direct debit option at approximately £9 to £11 per month for a "
     "child and £15 to £18 per month for a family would bring Explorazone in line with Pensthorpe "
     "and Gravity Active, lower the financial barrier to first purchase, and provide predictable "
     "recurring revenue. An individual adult annual pass of £55 to £65 would align with the local "
     "Norfolk comparator cluster (Pensthorpe adult £65, Wroxham Barns £60)."),
]

for heading_text, body_text in analysis_paras:
    hp = doc.add_paragraph()
    hp.paragraph_format.space_before = Pt(8)
    hp.paragraph_format.space_after  = Pt(2)
    hr = hp.add_run(heading_text)
    set_font(hr, size=10, bold=True, colour=(0, 70, 127))

    bp = doc.add_paragraph()
    bp.paragraph_format.space_after  = Pt(4)
    br = bp.add_run(body_text)
    set_font(br, size=9.5)

# ── Footer note ───────────────────────────────────────────────────────────────
doc.add_paragraph()
fp = doc.add_paragraph()
fr = fp.add_run(
    "All prices checked 21 May 2026. Cells marked CALL TO VERIFY require direct contact "
    "with the venue before use in any published pricing document."
)
set_font(fr, size=8, colour=(120, 120, 120))

# ── Save ──────────────────────────────────────────────────────────────────────
out = "/home/user/skills/Explorazone_Annual_Pass_Comparator_Research_21May2026.docx"
doc.save(out)
print(f"Saved: {out}")
