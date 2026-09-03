# Prelimsify — username accounts, shared scoreboard and admin permissions

## 1. Run the database setup

Open **Supabase → SQL Editor**, paste the complete contents of `supabase_schema.sql`, and run it.

The schema adds:
- username/password accounts backed by Supabase Auth (the password is never stored in this app's database tables)
- `profiles.username`, `profiles.role`, and `profiles.can_use_app`
- a shared `scoreboard_entries` view so every permitted user sees the same scoreboard
- RLS rules so revoked users cannot use saved papers, test history, or active tests

## 2. Username/password authentication

The frontend maps a username to an internal Supabase Auth email such as `alice@users.prelimsify.local`. Users only type their username and password; no real email address is requested.

In **Supabase → Authentication → Providers → Email**, turn **Confirm email** OFF for this username-only flow. This is required because the app uses an internal generated address (`username@users.prelimsify.local`) and the user does not have a mailbox for it. **This setting cannot be fixed by a SQL policy alone**; it is an Auth provider setting.

If an account was created before the latest SQL trigger was installed, re-run the complete `supabase_schema.sql`. It now includes a safe profile backfill for Auth users that do not yet have a `profiles` row.

## 3. Create the first administrator

1. Open the site and create the account you want to use as administrator.
2. In Supabase SQL Editor run:

```sql
UPDATE public.profiles
SET role='admin', can_use_app=true
WHERE username='your_admin_username';
```

3. Open `admin.html` while logged into that account.

The Admin branch can list usernames and **grant/revoke app permission**. Passwords are shown only as masked placeholders because Supabase Auth never exposes plaintext passwords to the administrator.

## 4. Scoreboard behaviour

Completed tests are saved in `test_history` with the exact saved-project title. The Score Board reads the shared `scoreboard_entries` view and displays the username beside each score, so different users' results remain in one continuous scoreboard.

When a saved project is loaded, its saved `paper.title` becomes the active test title. Renaming the current user changes the username shown on future scoreboard entries.

## 5. Security

Never put a Supabase service-role/secret key in browser JavaScript. The publishable key in `index.html`/`js/app.js` is expected for a browser app.
