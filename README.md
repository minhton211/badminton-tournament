# Friendly Badminton Tournament

A small, mobile-friendly tournament site for running a badminton day with friends. It is intended as a fun example project: public visitors can follow the draw and live results, while an organizer signs in to run the event.

## What it does

- Run a Singles tournament with four round-robin groups, standings, semifinals, a bronze match, and a final.
- Track wins, losses, point difference, and a player Elo rating that starts at 1000.
- Run Singles and manually formed Doubles teams in configurable round-robin groups, with slot-based draws and optional playoffs.
- Let organizers enter match scores manually and automatically keep standings, Elo, brackets, and court assignments up to date.
- Assign the next eligible match to an available court as results are submitted, while still allowing an organizer to move or hold matches.

## Run it locally

1. In Vercel, create and connect a private Blob store from the project's Storage tab. Vercel supplies either its automatic OIDC credentials or `BLOB_READ_WRITE_TOKEN` to the deployment.
2. Copy .env.example to .env.local, then add the Blob token plus your organizer password and session secret.
3. Install dependencies with `npm install`, then run `npm run dev`.
4. Open `http://localhost:3000`; open `/organizer` to sign in.

After connecting a store or changing environment variables, redeploy so the new deployment receives them. Run `npm test` for the domain-rule tests and `npm run typecheck` before deploying.

## Blob storage and organizer writes

Tournament data is kept in one private Vercel Blob JSON document. The app uses an unconditional overwrite for each organizer action, rather than an ETag-conditional overwrite: Vercel Blob's overwrite cache can otherwise make a current action fail with an ETag mismatch even when there is only one organizer.

This is appropriate only when organizers take turns making changes. Keep one organizer tab/device active while editing; an overlapping save can overwrite another organizer's unsaved change. Vercel Blob is object storage, not a transactional database.

For simultaneous organizers, do not re-enable ETag retries on this document. Migrate the write model to immutable action blobs (one uniquely named action per change) and rebuild the tournament state from those actions, with per-division and per-match conflict checks. That design avoids overwriting the shared document and can explicitly ask an organizer to refresh when two people change the same item.

## How to use the web app

1. Open the public tournament link to see live courts, upcoming matches, standings, brackets, and player ratings.
2. An organizer signs in with the event password. The app remembers a secure signed session for 30 days; it never stores the password in the browser.
3. Add or paste the roster, then use the registration matrix to select each player for Singles and/or Doubles divisions.
4. Configure group and pair slots; round-robin placeholder fixtures are created automatically and become playable as slots are filled.
5. Enter results as each match finishes. The site updates the table, Elo, next matches, and court queue.
6. For Doubles, assign two registered players to each pair slot, then run the group stage and optional playoffs.

Scores are entered by organizers only. Public visitors never need an account.

## Elo experiments, kept offline

The website uses a configurable Elo formula, but formula tuning belongs outside the live app. [`notebooks/elo_monte_carlo.ipynb`](notebooks/elo_monte_carlo.ipynb) runs Monte Carlo simulations offline, plots possible player-rating ranges after different numbers of matches, and compares settings such as K-factor and score-difference weighting. This keeps the website focused on running the tournament while making the assumptions easy to explore and reproduce offline.

For the notebook, create an isolated Python environment and install the declared tools:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -e .
jupyter lab notebooks/elo_monte_carlo.ipynb
```

Run `python -m unittest discover python_tests` to verify the simulation's numerical core.

## Project status

The stack is Next.js, TypeScript, CSS, Vercel, and private Vercel Blob storage. The app is intentionally a small, approachable reference project rather than a full tournament-management product.
