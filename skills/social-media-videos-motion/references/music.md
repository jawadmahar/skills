# Music

Every video gets its own licensed track, matched to its mood. Music is what makes a Reel feel finished, and a different track per video is part of what keeps a set diverse.

## Licence: what we may use

- **Default source: Mixkit** (mixkit.co/free-stock-music). The Mixkit Free Licence allows commercial use including social media marketing and paid online ads, with no attribution required. It does not cover broadcast TV or radio, and tracks may not be redistributed on their own (fine inside our videos, not as loose MP3s in a shared folder).
- Read the licence page again if anything looks different on the site; licences change. Note the date you checked in the campaign's credits file.
- Never use commercial chart music, TV themes or anything "found online" in paid ads. Instagram's in-app music library is for organic posts, not for ads we upload.
- A brand may have its own licensed library or sonic logo: brand guidelines win (`brand-discovery.md`).

## Choosing tracks

1. Decide each video's mood from the plan (playful, cosy, wonder, upbeat, nostalgic, festive).
2. Search Mixkit pages: `python3 scripts/mixkit.py search children happy upbeat` (categories), or `tag/ukulele`, `tag/piano`, `tag/christmas` for tags. It lists id, title, artist, length and tags.
3. Pick a different track for each video. Avoid repeating a track used in the brand's last campaign unless the director asks for it.
4. Match energy to the edit: fast cuts want 110 to 130 BPM with a clear beat; letters and nostalgia want lighter acoustic, piano or mallets; 3D reveals suit building electronic tracks.
5. Record title, artist, source and id in `music_credits.json` as you choose:

```json
{"2": {"title": "Comical", "author": "Ahjay Stelino", "source": "Mixkit", "licence": "Mixkit Free Licence"}}
```

## Processing

```bash
python3 scripts/mixkit.py fetch 2 480 729 --dir music      # downloads music/mk_<id>.mp3
python3 scripts/mixkit.py starts --dir music               # skips quiet intros, writes music/starts.json
python3 scripts/mux.py --silent out/silent --music music --map music_map.json --out out/final --prefix <brand-campaign>
```
`mux.py` trims each track to the video, fades in over 0.35 s and out over 1.3 s, normalises to -16 LUFS (true peak -1.5 dB) and encodes AAC 192 kbps at 48 kHz, copying the video untouched. `check_videos.py` confirms loudness within 2 LU of -16.

## Library: tracks already used

Use this to avoid repeats and to find a proven mood quickly. Add every new track here when a campaign is finished.

| Id | Title | Artist | Mood tags | Used in (Explorazone, half term Oct 2026) |
|---|---|---|---|---|
| 10 | Playful | Ahjay Stelino | Carefree, Fun, Double Bass, Drums | V01 The maths |
| 988 | Day Dreamin' with U | Michael Ramir C. | Downtempo, Uplifting, Hopeful, Drums | V02 Let it rain |
| 529 | Walking in the Park | Diego Nava | Folk Pop, Carefree, Relaxed, Acoustic Guitar | V03 Leaves outside. Lasers inside. |
| 1072 | Owies Ukulele | Michael Ramir C. | Folk Pop, Happy, Carefree, Acoustic Guitar | V04 Dear Nan & Grandad |
| 813 | Magical moment | Michael Ramir C. | Folk Pop, Happy, Carefree, Acoustic Guitar | V05 Three generations |
| 8 | Jumping Around | Ahjay Stelino | Folk Pop, Happy, Carefree, Acoustic Guitar | V06 Half-term planner |
| 82 | Keeping Fit | Ahjay Stelino | EDM, Quirky, Futuristic, Bass | V07 POV: half term |
| 849 | Light it Up Boy | Michael Ramir C. | Jazz Funk, Lively, Positive, Bass | V08 £12 each |
| 682 | Classical vibes 2 | Grigoriy Nuzhny | Film Score, Uplifting, Hopeful, Piano | V09 An old-fashioned day out |
| 1029 | Funky Martian | Michael Ramir C. | Jazz Funk, Motivating, Lively, Bass | V10 Ticket trio |
| 2 | Comical | Ahjay Stelino | Humorous, Playful, Drums, Mallets | V11 Raindrop race |
| 480 | Curiosity | Diego Nava | Corporate Music, Relaxed, Positive, Bass | V12 Half-term forecast |
| 729 | Pop Track 03 | Lily J | Corporate Music, Playful, Positive, Bass | V13 The group chat |
| 1037 | My Little Star | Michael Ramir C. | Uplifting, Hopeful, Keyboard, Mallets | V14 Leave the umbrella |
| 175 | Digital Clouds | Alejandro Magaña (A. M.) | Electronic, Positive, Futuristic, Bass | V15 Puddle season |
| 9 | Kidding Around | Ahjay Stelino | Humorous, Silly, Double Bass, Mallets | V16 Dear Mum & Dad |
| 12 | Playground Fun | Ahjay Stelino | Contemporary Folk, Happy, Relaxed, Double Bass | V17 Grandad’s reply |
| 670 | Uplifting | Francisco Alvear | Carefree, Humorous, Bass, Clarinet | V18 Half-term homework |
| 1076 | Smile | Michael Ramir C. | Folk Pop, Happy, Fun, Acoustic Guitar | V19 Dear Diary |
| 1057 | Cupcakes | Michael Ramir C. | Folk Pop, Happy, Carefree, Acoustic Guitar | V20 The fridge plan |

Mood shortcuts from this set: playful and silly (2, 9, 10, 670), happy acoustic (8, 12, 1057, 1072, 1076, 813), dreamy or hopeful (988, 1037, 682), funky and bold (849, 1029), electronic (82, 175), light corporate (480, 729), folk walking pace (529).

### Added in the Explorazone winter set (Oct 2026)

The director asked to reuse the best half-term tracks where the mood fits, so 19 half-term tracks were reused (one per video) and 31 were new. Festive tracks were used only in the Christmas run-up videos (W19 to W34).

| Id | Title | Artist | Used in (Explorazone, winter 2026-27) |
|---|---|---|---|
| 504 | Cold Day | Diego Nava | W01 |
| 7 | Fun Times | Ahjay Stelino | W04 |
| 1073 | Our Journey | Michael Ramir C. | W05 |
| 587 | Discover | Eugenio Mininni | W10 |
| 644 | Upbeat Jazz | Francisco Alvear | W11 |
| 474 | What About Action? | Diego Nava | W14 |
| 621 | BRIDGE N° 98 | Eugenio Mininni | W18 |
| 862 | Christmas Gifts | Michael Ramir C. | W19 |
| 867 | December Treats | Michael Ramir C. | W20 |
| 916 | See You Next Christmas | Michael Ramir C. | W21 |
| 896 | A Christmas Carol | Michael Ramir C. | W22 |
| 503 | Christmas Jazz | Diego Nava | W23 |
| 691 | Holidays 2 | Grigoriy Nuzhny | W24 |
| 981 | A Rockin' Holiday! | Michael Ramir C. | W25 |
| 866 | Christmas Stars | Michael Ramir C. | W26 |
| 1021 | Christmas Jokes | Michael Ramir C. | W27 |
| 911 | Let's All Dance This Christmas | Michael Ramir C. | W28 |
| 984 | Christmas Laughs | Michael Ramir C. | W29 |
| 510 | Holiday / Seasonal 3 | Diego Nava | W30 |
| 1015 | A Christmas Hero | Michael Ramir C. | W31 |
| 93 | Tinsel and Mistletoe | Ahjay Stelino | W32 |
| 944 | Christmas Is For Kids! | Michael Ramir C. | W34 |
| 1183 | Karma | Michael Ramir C. | W37 |
| 786 | Kids | Michael Ramir C. | W39 |
| 1069 | My Pride and Joy | Michael Ramir C. | W40 |
| 514 | Happy and All That | Diego Nava | W44 |
| 532 | A Happy Child | Diego Nava | W46 |
| 801 | Happy Home | Michael Ramir C. | W47 |
| 15 | Keep Smiling | Ahjay Stelino | W48 |
| 834 | It's Love | Michael Ramir C. | W49 |
| 688 | Classical vibes 5 | Grigoriy Nuzhny | W50 |

Reused from half term: 10 (W42), 1029 (W45), 1037 (W33), 1057 (W07), 1072 (W06), 1076 (W36), 12 (W41), 175 (W17), 2 (W38), 480 (W03), 670 (W16), 682 (W08), 729 (W09), 8 (W43), 813 (W35), 82 (W13), 849 (W12), 9 (W15), 988 (W02).

Mood shortcuts added: festive and bright (862, 867, 911, 981, 984, 1021), festive and gentle (93, 691, 896, 916, 866), winter but not festive (504, 532, 1073, 587, 621), jazzy (503, 644), pop and dance (474, 834, 1183, 688).
