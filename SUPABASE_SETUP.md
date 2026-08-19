# Prelimsify — Supabase setup

This project includes `supabase_schema.sql`, which creates the database tables and Row Level Security (RLS) needed to keep each student's data private.

## 1. Run the SQL

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Create a new query.
4. Paste the complete contents of `supabase_schema.sql`.
5. Click **Run**.

The script is written to be safe to run again: policies/triggers are recreated with `drop ... if exists` and tables use `if not exists`.

## 2. Google Authentication

In **Authentication → Providers → Google**, enable Google and enter the Google OAuth Client ID and Client Secret.

Google's authorized redirect URI should be:

```text
https://fzwsmvwvraruktyyiscr.supabase.co/auth/v1/callback
```

In **Authentication → URL Configuration**, set your production website as the Site URL and add your development/production callback URLs under Redirect URLs.

## 3. Tables created

- `profiles` — one profile per authenticated student.
- `quiz_projects` — saved question sets, owned by a student.
- `test_history` — completed-test grade history, owned by a student.
- `active_tests` — one resumable unfinished test per student.

## 4. Privacy

RLS is enabled on all four tables. Every policy uses `auth.uid()` so a signed-in student can only read or modify rows belonging to their own account.

The public/publishable Supabase key may remain in the frontend. **Never put the Supabase service-role/secret key in `js/app.js` or any browser-delivered file.**

## Important note about the current frontend

The SQL/RLS setup is the database security layer. Browser `localStorage`/`sessionStorage` data already used by the current app is still browser-local; RLS cannot secure browser storage. To make saved papers, grade history, and unfinished tests cloud-synced across devices, the frontend must call the four tables above using the authenticated Supabase client. The schema is prepared for that integration.
