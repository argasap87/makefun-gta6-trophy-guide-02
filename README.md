# TROPHY RADIO — GTA VI trophy guide & tracker (55 trophies)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-02.svg)](https://make.fun/bounty/gta6-trophy-guide-02)
[![make.fun rank](https://make.fun/badge/gta6-trophy-guide-02/argasap87/makefun-gta6-trophy-guide-02/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-02)
[![make.fun reward](https://make.fun/badge/gta6-trophy-guide-02/argasap87/makefun-gta6-trophy-guide-02/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-02)

**Tune your hunt — every trophy a track on the board, with a skyline of all 55 lighting up as you earn them.**

An offline guide and tracker for the **55 PlayStation 5 trophies of Grand Theft Auto VI** (1 platinum, 2 gold, 6 silver, 46 bronze — 28 of them hidden on PlayStation until earned), built for the [make.fun gta6-trophy-guide-02 bounty](https://make.fun/bounty/gta6-trophy-guide-02) ($250, 50 places).

## What it is

- **Tracklist table** — all 55 trophies with their official name, description and grade, a checkbox per trophy, kind tag (story / collectibles / activities) and a red **!** badge on missables. Click any row to open its guide.
- **Station dial** — a progress meter (X/55 toward platinum) at the top of every screen.
- **SKYLINE strip** — 55 tier-coloured cells, one per trophy, filled in as you earn them: the whole hunt at a glance.
- **Guide pane** — the official name, description and grade, a guide in my own words, the PSN-tracked target where one exists, the missable rule where one applies, and the **sources cited beside every guide** (Exophase for the official name/description/grade, PSNProfiles for the PSN count/target).
- **Roadmap to Platinum** — five stages in order, built only from the official descriptions: story chapters and missions, strangers and contacts, collectibles with counts, activities and money, then 100% and the platinum.
- **Missables view** — the 19 flagged trophies, each with the rule that flagged it.
- **Tracker** — progress saved in localStorage, **Export** to a file and **Import** back; filters by kind, grade, earned state and search; a **spoiler setting** that hides story trophies' names and descriptions until they are earned.
- **Honest where the game is not yet checkable** — anything the official description does not pin down (a place, a step, a count) is labelled *"not yet checked in-game"* in the guide. Nothing is guessed, and no text is copied from another guide.

## How to run it (offline)

No build step, no network requests at runtime, no external fonts, images or scripts. Every file the app loads lives under `app/`.

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or open `app/index.html` from any static file server with `app/` at its root. It works with the network off.

Hand-in program (Node 22, stdlib only):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Screenshots

Real renders of this app in a browser (1280×800), seeded with 13 of 55 earned so the tracker shows progress:

1. `screenshots/1-cover.jpg` — checklist with a guide pane open and progress visible (cover)
2. `screenshots/2-roadmap.jpg` — Roadmap to Platinum
3. `screenshots/3-missables.jpg` — Missables view
4. `screenshots/4-guide.jpg` — guide detail with sources

## Sources

- Trophy names, descriptions and grades: PlayStation's official list, as listed by **Exophase** and **PSNProfiles** (the two agree on every name, description and grade).
- PSN-tracked counts/targets (250 stunts, 42 Shooting Range challenges, 14 drone race locations, 100 WAiNK It locations, 52 areas of Leonida, and the rest): **PSNProfiles**.
- Every guide is written in my own words for this entry and cites its sources beside it. No Rockstar logo, official artwork, box art or game screenshot anywhere in this repo.

## License

MIT — see [LICENSE](LICENSE).
