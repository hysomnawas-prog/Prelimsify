# Prelimsify — Build & Development History

Prelimsify ("The Prelims sahchari") is a self-hosted UPSC-style test practice
app: static frontend on GitHub Pages, Supabase as the backend (auth,
database, and row-level security), installable as a PWA on phone and
desktop. This document explains how it's built, why it's structured the way
it is, and the full history of what was built, broken, and fixed along the
way.

---

## 1. What the app does

- **Take timed tests** from a loaded question set (JSON or `.hysom` text
  format), with a question palette, negative marking, pass percentage, and a
  results screen.
- **Save question sets** ("Saved Projects") so a test can be re-attempted or
  re-shared later without re-uploading the source file.
- **Score history / Score Board** — every completed test is logged, and a
  shared scoreboard shows everyone's results.
- **Accounts** — username-based sign up/login via Supabase Auth (email
  confirmation turned off, so it behaves like a plain username + password
  system).
- **Admin panel** (`admin.html`) — a separate page where an `admin`-role
  account can see every user, grant/revoke `can_use_app` permission, and
  (after the fixes below) manage every user's saved projects.
- **Installable app (PWA)** — the same site can be "installed" to a phone
  home screen or desktop, on top of remaining a normal website.

---

## 2. Architecture

```
Browser (GitHub Pages, static files only)
   ├─ index.html + js/app.js      → main app
   ├─ admin.html + js/admin.js    → admin console
   ├─ css/styles.css              → shared styling ("Liquid Glass" design system)
   ├─ js/no-inspect.js            → right-click / DevTools-shortcut deterrent
   ├─ manifest.json + sw.js       → PWA installability
   └─ Supabase JS client (CDN)    → all data calls
             │
             ▼
Supabase (hosted Postgres + Auth)
   ├─ auth.users                  → login/passwords (managed by Supabase)
   ├─ public.profiles             → username, role, can_use_app flag
   ├─ public.quiz_projects        → saved question sets
   ├─ public.test_history         → one row per completed test
   └─ public.scoreboard_entries   → a VIEW joining test_history + profiles,
                                     what the Score Board actually reads
```

There is **no custom backend server** — GitHub Pages only serves static
files. All business logic (who can see/edit what) lives in **Postgres Row
Level Security (RLS) policies** and a handful of `SECURITY DEFINER` SQL
functions, enforced directly by Supabase whenever the browser calls it.

---

## 3. Database design

### `profiles`
One row per user. Columns: `id` (matches `auth.users.id`), `username`,
`role` (`'user'` or `'admin'`), `can_use_app` (a manual on/off switch an
admin can flip so an account exists but can't use the app until approved).

A trigger (`on_auth_user_created`) auto-creates a `profiles` row whenever
someone signs up. `ensure_my_profile()` repairs the row on login if it's
ever missing.

### `quiz_projects`
Saved question sets. Columns: `id`, `user_id`, `project_number` (per-user
sequence number), `paper` (jsonb — the whole question set + settings),
`saved_at`.

- Regular users: RLS lets them `select`/`insert`/`update`/`delete` only rows
  where `user_id = auth.uid()`.
- Admins: an additional `using (public.is_admin())` policy per action lets
  an admin see/edit/delete **any** user's saved projects — used for cleanup.

### `test_history`
One row per completed test attempt: `user_id`, `title`, `marks`,
`max_marks`, `percentage`, `passed`, `correct`, `wrong`, `unanswered`,
`completed_at`. RLS restricts each user to their own rows.

### `scoreboard_entries` (view)
```sql
select h.id, p.username, h.title, h.marks, h.max_marks, h.percentage,
       h.passed, h.correct, h.wrong, h.unanswered, h.completed_at
from public.test_history h
join public.profiles p on p.id = h.user_id
where p.can_use_app = true;
```
This is what the Score Board on the homepage actually queries — it's a
join so the board can show everyone's results without giving every user
raw `select` access to `test_history` rows they don't own.

### Helper functions (`SECURITY DEFINER`)
- `is_admin()` — checks the caller's own `profiles.role` **without**
  triggering RLS recursion (see §5.3 below for why this matters).
- `can_use_app()` — checks the caller's `profiles.can_use_app` flag.
- `ensure_my_profile()` — self-heals a missing profile row.
- `admin_get_me`, `admin_list_users`, `admin_set_user_permission` — RPCs
  written for the admin panel, though the shipped `admin.js` currently
  queries `profiles` directly with RLS instead of calling these (both
  approaches work; the RPCs are there as a documented but unused
  alternative).

---

## 4. Frontend design decisions

- **Local-first saved projects.** `loadSavedProjects()` always renders
  whatever is in `localStorage` immediately, *then* fetches from Supabase
  and merges the two. This means the Saved Projects panel never looks
  empty just because the network is slow — it fills in once Supabase
  responds. The trade-off: local cache is **per device**, so a brand-new
  login on a new device/browser starts empty until Supabase sync completes
  (this is expected behaviour, not a bug — see §5.4 below).
- **Save-then-sync writes.** Saving a project writes to `localStorage`
  first (instant UI feedback), then pushes to Supabase in the background.
- **"Liquid Glass" design system** (see §9) — one `css/styles.css` file, no
  CSS framework, no build step.
- **No build step.** Plain HTML/CSS/JS, loaded via `<script>` tags — easy
  to deploy straight to GitHub Pages with no bundler/compiler.

---

## 5. Debugging history — issues found and fixed

The app went through an active debugging pass covering three reported
problems, each traced to a specific root cause in the code or database
rather than patched blindly. This section is kept as a record of what
actually broke and why, in case a similar symptom reappears.

### 5.1 Issue: deleted saved projects reappear after reload

**Symptom:** deleting a saved project appeared to work, but the project
was back after refreshing the page.

**Root cause (two separate bugs, both had to be fixed together):**
1. In `js/app.js`, `deleteSavedProject()` and `renameSavedProject()` filtered
   the Supabase request with `.eq('user_id', supabaseUser.id)`. That's
   correct for a user deleting their *own* project, but wrong for an
   **admin** deleting someone *else's* project — the query ended up asking
   "delete the row where `id = X` **and** `user_id = <the admin's own id>`,"
   which matched zero rows. Supabase doesn't error on a zero-row delete, so
   the code had no way to know it silently did nothing.
2. On the database side, `quiz_projects` only had an admin **select**
   policy (`quiz_projects_select_admin`) — the matching
   `quiz_projects_update_admin` / `quiz_projects_delete_admin` policies
   from `saved_projects_admin_patch.sql` had never actually been created
   (that script appears to have been interrupted partway through on a
   previous run). So even with bug #1 fixed, RLS itself would have blocked
   the delete.

**Fix:** removed the incorrect `user_id` filter from both functions (RLS
now decides who's allowed, not the client), and created the missing
`quiz_projects_update_admin` / `quiz_projects_delete_admin` policies.

### 5.2 Issue: completed test scores don't save/show

**Symptom:** finishing a test didn't seem to add anything to the Score
Board.

**Root cause:** `js/app.js` inserts every completed test into a table
called `test_history` — but that table **did not exist** on the live
Supabase project. Every insert was failing, silently caught by a
`try/catch` that only logs a console warning. (There was also a leftover,
unrelated `test_scores` table/view pair from an earlier, abandoned schema
attempt — that turned out to be a red herring, not what the live app
actually used.)

**Fix:** created `test_history` with the correct columns, indexes, and RLS
policies (own-row select/insert/update/delete), and (re)created the
`scoreboard_entries` view to read from it.

### 5.3 Issue: admin page shows "Access denied" for an actual admin account

**Symptom:** an account confirmed to have `role = 'admin'` in the database
still got "Access denied" on `admin.html`.

**Root cause:** `profiles` had **two generations of admin policies**
stacked on top of each other — old ones (`Admins can view all profiles`,
`Admins can update profiles`) left over from an earlier iteration of the
schema, alongside newer, safer ones (`profiles_select_admin`,
`profiles_update_admin`) that check admin status through the `is_admin()`
`SECURITY DEFINER` function. The **old** policies checked admin status by
querying `profiles` directly from *inside a policy defined on `profiles`
itself* — a self-referencing subquery. Postgres RLS re-evaluates policies
on every row access, so a policy that queries its own table triggers
**infinite recursion**, and Postgres refuses the whole query with
`infinite recursion detected in policy for relation "profiles"`. This
surfaced in `admin.js` as a Supabase error, which the page was originally
masking behind a generic "Access denied" message (see next point).

**Fix (two parts):**
1. Dropped the old, recursive policies — the new `is_admin()`-based ones
   already covered the same access, safely.
2. Patched `admin.js` to display the *actual* Supabase error message
   instead of collapsing every possible failure into a generic "Access
   denied" — this is what made the recursion error visible in the first
   place instead of requiring guesswork.

### 5.4 Non-issue: brand-new phone account has no saved projects/scores

Not a bug — saved projects and scores are tied to the specific
`user_id` that created them. A new account created on a phone is a
different user by design and starts empty. Signing into the *same*
account used on desktop restores everything via the Supabase sync
described in §4.

### 5.5 Repo hygiene note

The uploaded project contained a stale nested `Prelimsify/Prelimsify/`
folder holding an older copy of `index.html`/`app.js` (no admin link, old
scoreboard code). It isn't served by GitHub Pages as long as the site's
source is the repo root, but it's a trap for accidentally editing the
wrong copy — worth deleting.

### 5.6 Issue: Saved Projects / Score History / Question Palette blink or flicker on hover

**Symptom:** hovering (or tapping, on touch devices that fire a hover
event) over a row in the Saved Projects list, a row in Score History, or a
button in the Question Palette caused a thick horizontal scrollbar-like bar
to flash in and out rapidly — visually reads as blinking/glitching.

**Root cause:** the hover states on `.saved-item`, `.palette-btn`, and
`.question-control` apply a `transform: scale(...) translateY(...)` "lift"
effect (part of the §9 redesign's spring-physics hover language). Their
scroll containers — `.saved-list`, `.score-history-list`,
`.question-palette` — had `overflow: auto`, which applies to **both**
axes. On hover, the scaled-up element became a fraction of a pixel wider
than its container, which triggered a horizontal scrollbar. The
scrollbar's appearance nudged the available width, which un-hovered the
element, which removed the scrollbar, which re-hovered it — a fast
hover/scrollbar feedback loop that reads as flicker/blinking to the user.

**Fix:** changed all three containers from `overflow: auto` to
`overflow-y: auto; overflow-x: hidden;` — vertical scrolling still works
exactly as before, but horizontal overflow (and the scrollbar it would
have spawned) is now clipped instead of rendered. This is the general fix
for this failure mode: any scroll container whose children have a hover
`transform` should never leave `overflow-x` on `auto`.

---

## 6. Turning it into an installable app (PWA)

Added without changing how the site behaves as a normal website:

- **`manifest.json`** — app name, black/white theme colors matching the
  site, `display: standalone` (hides the browser chrome once installed).
- **`icons/`** — generated 192px/512px icons, a maskable 512px variant for
  Android's adaptive icon shapes, and a 180px Apple touch icon.
- **`sw.js`** (service worker) — deliberately **network-first** for every
  request, not cache-first. The site already ships `no-cache` headers on
  `index.html` because it's under active development; a cache-first
  service worker would have silently served old, buggy versions after
  every fix. It only falls back to the cache (or `offline.html`) when the
  network genuinely fails.
- **`offline.html`** — minimal fallback shown only with no connection at
  all. The app is inherently online-only (Supabase-backed), so this is
  just a friendlier dead-end rather than real offline functionality.
- Both `index.html` and `admin.html` got `<link rel="manifest">`, icon
  links, and (on `index.html`) the few lines that register the service
  worker.

**Install behaviour:** Android Chrome shows an automatic install
prompt; iPhone Safari requires the user to tap Share → *Add to Home
Screen* (Apple doesn't allow automatic install prompts for third-party
sites); desktop Chrome/Edge shows an install icon in the address bar.

---

## 7. File structure

```
index.html            Main app page/markup
admin.html             Admin console page/markup
manifest.json          PWA manifest
sw.js                   Service worker (network-first)
offline.html            PWA offline fallback page
icons/                   PWA icon set
css/styles.css           All page styling ("Liquid Glass" design system, §9)
js/app.js                Main app logic + Supabase calls
js/admin.js               Admin console logic
js/no-inspect.js          Right-click / DevTools-shortcut deterrent (§10)
assets/images/             Static images (pass/fail/scoreboard icons)
supabase_schema.sql         Base schema: profiles, quiz_projects, test_history,
                             scoreboard_entries view, RLS, helper functions
admin_rls_patch.sql          Admin RPC functions (admin_get_me, etc.)
saved_projects_admin_patch.sql   Admin RLS policies for quiz_projects
test_scores_setup.sql         Superseded/unused alternate scores schema —
                               kept for history, not used by the live app
SUPABASE_SETUP.md              Original setup notes (auth config, first-admin SQL)
```

---

## 8. Setting this up from scratch

1. Create a Supabase project.
2. Authentication → Providers → Email → turn **Confirm email OFF** (so
   sign-up behaves like plain username + password).
3. Run `supabase_schema.sql` in the SQL Editor, then
   `admin_rls_patch.sql` and `saved_projects_admin_patch.sql`, then apply
   the `test_history` creation block from this project's fix history
   (or re-run `supabase_schema.sql`, which already includes it going
   forward).
4. Promote the first admin:
   ```sql
   update public.profiles
   set role = 'admin', can_use_app = true
   where lower(username) = 'your_username_here';
   ```
5. Push all files (including `manifest.json`, `sw.js`, `offline.html`,
   `icons/`) to the GitHub repo backing GitHub Pages.
6. Visit the site — install prompts appear automatically where supported.

---

## 9. UI/UX refresh — "Liquid Glass" design system (2026)

The frontend was restyled to a premium, macOS/iOS-2026-inspired look —
bento-grid layouts, frosted glassmorphism, and spring-physics hover
motion — without touching any markup IDs/classes that `app.js`/`admin.js`
query, so the redesign is purely visual/CSS.

### 9.1 Design tokens (`css/styles.css` `:root`)
- **Glass surfaces:** `--glass-bg` / `--glass-bg-strong` / `--glass-bg-soft`
  (translucent whites at different opacities), `--glass-border` /
  `--glass-border-strong` (hairline borders), `--glass-blur` /
  `--glass-blur-lg` (`backdrop-filter: blur(20–28px) saturate(180–190%)`),
  `--glass-shadow` / `--glass-shadow-lg` (soft ambient drop shadows with a
  1px inset highlight to fake a glass edge).
- **Radii:** `--r-pill` (999px, buttons/dock/badges), `--r-sm` (12px,
  inputs/chips), `--r-md` (16px), `--r-lg` (24px, panels/cards), `--r-xl`
  (28px, hero/overlay cards).
- **Motion:** `--spring` = `cubic-bezier(0.25, 1, 0.5, 1)`, used for every
  hover/press transition (`--spring-fast` .32s, `--spring-slow` .5s).
- **Accents:** `--accent` (#0A84FF, Apple blue), `--accent-2` (#5E5CE6,
  indigo), `--accent-3` (#FF375F, pink) — used sparingly (progress bar
  fill, palette "not visited" state, focus outline).
- **Type:** `--sans` now uses the system font stack
  (`-apple-system, BlinkMacSystemFont, "SF Pro Display"/"SF Pro Text",
  Segoe UI, Roboto...`) instead of Arial/Helvetica; `--serif` is
  `"New York", "Iowan Old Style", Georgia, "Times New Roman", Times, serif`
  for the exam-paper question text. The homepage's **`prelimsify` wordmark
  is set explicitly in Times New Roman** (`font-family: "Times New Roman",
  Times, var(--serif)`), solid black on the light glass background, with a
  `prefers-color-scheme: dark` fallback to white if it's ever placed on a
  dark surface.

### 9.2 Backdrop
`body` has a fixed, non-scrolling mesh gradient (stacked `radial-gradient`
blooms in indigo/blue/pink/green over a soft base gradient,
`background-attachment: fixed`) instead of the old flat grey. This exists
specifically so the glass panels have something colorful behind them to
blur/refract — flat glass on a flat background doesn't read as "glass" at
all.

### 9.3 Bento grid layouts
- **Home screen (`.home-content`):** `display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));` — the
  hero, tagline, auth buttons, and (once logged in) the account chip /
  Start Test button / Score Board card arrange themselves into
  responsive dashboard tiles instead of one stacked column.
- **Logged-in home (`.logged-in-home`):** originally also a bento grid,
  but that put the account chip (`.account-panel`, historically
  `position: absolute` in the top-right corner) on a collision course
  with the Start Test button — see the alignment fix below. It's now a
  simple centered flex column: account chip (right-aligned, own row) →
  Start Test (centered CTA, fixed comfortable width, generous margin) →
  Score Board card (full width). This was a direct fix for a reported
  "Start Test button overlapping/crowded" issue.

### 9.4 Glass panels
Every card-like surface — `.masthead`, `.loader-panel`, `.container`
(the question area), `.question-palette`, `.score-board-card`,
`.saved-item`, `.result-card`, `.pause-card`, `.auth-card`,
`.score-history`, `.account-panel` — uses the same recipe:
`background: var(--glass-bg[-strong])`, `backdrop-filter: blur(20px)
saturate(180%))`, a 1px `rgba(255,255,255,…)` hairline border, and
`border-radius` from the token scale above, so the whole app reads as one
consistent material rather than a patchwork of differently-styled boxes.

### 9.5 The "Dock" — `.scorebar`
The in-test toolbar (timer, marks, Home/Pause/Exit/Reset, zoom controls)
was turned into a floating, centered, pill-shaped glass dock: `position:
sticky`, `border-radius: var(--r-pill)`, heavy blur, and every button
inside it scales up (`transform: scale(1.12) translateY(-2px)`) on
hover — the closest static-CSS equivalent of the macOS Dock's
magnification effect.

### 9.6 Spring hover physics
Interactive elements — `.opt` (answer options), `.score-board-card`,
`.saved-item`, `.palette-btn`, `.icon-btn`, `.btn`, history rows — lift
slightly on hover: `transform: scale(1.02–1.14) translateY(-2px to
-4px)` with the shared `--spring` cubic-bezier, plus a deepened
box-shadow. `.opt.locked` (an answer already submitted/locked) explicitly
suppresses the hover transform so reviewed questions don't visually
"jump."

**Caveat learned the hard way (see §5.6):** any element that scales up on
hover *inside a scrolling container* must live inside a container with
`overflow-x: hidden` (not `overflow: auto` on both axes), or the growth
can trigger a horizontal scrollbar that flickers in and out.

### 9.7 Scope note
Only the **active** app was restyled — the root `index.html`,
`admin.html`, `offline.html`, and `css/styles.css`. The stale duplicate
under the nested `Prelimsify/` folder (see §5.5) still has the old look;
per the repo-hygiene note it isn't served by GitHub Pages and is a
candidate for deletion rather than a second design pass.

---

## 10. Right-click / DevTools deterrence (`js/no-inspect.js`)

A small script, loaded first in `<head>` on every page
(`index.html`, `admin.html`, `offline.html`), that:
- Calls `e.preventDefault()` on the `contextmenu` event, so right-click
  doesn't show the browser's menu (which includes "Inspect").
- Calls `e.preventDefault()` on `keydown` for `F12`,
  `Ctrl/Cmd+Shift+I` (DevTools), `Ctrl/Cmd+Shift+J` (Console),
  `Ctrl/Cmd+Shift+C` (Inspect element), and `Ctrl/Cmd+U` (view source).

**Honest limitation, stated plainly because it matters for anyone relying
on this:** browsers do not expose any API that lets a website truly
disable DevTools. A user can still open it from the browser's own menu
(e.g. Chrome's ⋮ → *More tools* → *Developer tools*), so this only
removes the two most common casual entry points — it is a deterrent, not
a security boundary. Nothing in this app should depend on the client-side
JS/HTML actually being hidden from a determined user; the real security
boundary is (and must remain) Postgres RLS on the Supabase side (§3), not
this script.

---

## 11. Known trade-offs / things to keep in mind

- No build tooling means every fix has to be hand-edited directly into
  `js/app.js` / `js/admin.js` — fine at this size, but worth watching if
  the app grows much larger.
- The service worker's network-first strategy means it adds no real
  offline capability, only installability + a graceful "you're offline"
  screen — intentional, given how actively the backend/data changes.
- `admin.js` talks to `profiles`/`quiz_projects` directly under RLS rather
  than through the `admin_*` RPC functions in `admin_rls_patch.sql`; both
  approaches are valid, but keep this in mind if the RPCs are ever wired
  up later — don't assume they're already in use.
