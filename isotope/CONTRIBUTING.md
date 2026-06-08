# Contributing to IsotopeAI

Thank you for taking the time to contribute! This guide covers everything you need to make a great pull request.

---

## 🚀 Getting Started

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/isotope-code.git
cd isotope-code

# 2. Set up the app
bash setup.sh

# 3. Create a feature/fix branch
git checkout -b fix/your-description   # for bug fixes
git checkout -b feat/your-feature      # for new features
git checkout -b docs/update-readme     # for documentation
```

---

## 🧭 Rules (Non-Negotiable)

1. **Never commit `.env`** or any secret — API keys, service-role keys, tokens, passwords
2. **Never weaken RLS policies** to make UI pass — fix the query or the policy logic instead
3. **Never fake sync success** — "Synced ✓" means the Supabase row actually changed
4. **Update `isotope-complete.sql`** if you add/change any DB table, column, index, RLS, trigger, or function
5. **Test sync end-to-end**: browser action → Supabase row/storage → clear browser cache → login again → data restores

---

## 📁 Where Things Live

| File/Dir | What it is |
|---|---|
| `server.mjs` | Main Node.js server — all routes and Supabase proxying |
| `isotope-complete.sql` | Authoritative DB schema — idempotent, run on fresh Supabase |
| `public/assets/` | Compiled React frontend — do not edit these files directly |
| `public/sw.js` | Service worker — PWA caching |
| `public/update-checker.js` | In-app update banner |
| `bin/isotope` | Linux/macOS/Termux CLI |
| `bin/isotope.bat` | Windows CLI |
| `CHANGELOG.md` | All notable changes — update this with your PR |

---

## 🗄️ DB / Schema Changes

If your change touches the database:

1. Write the change in `isotope-complete.sql` using `CREATE OR REPLACE` / `IF NOT EXISTS` guards
2. Also update any relevant `DROP POLICY IF EXISTS` / `CREATE POLICY` blocks
3. Test it by running `isotope-complete.sql` on a clean Supabase project
4. Mention the schema change in your PR description

---

## ✅ Sync Proof Checklist

Before marking your PR ready, verify:

```text
□ browser action
□ → Supabase row/storage actually changed (check Supabase Table Editor)
□ → clear localStorage + IndexedDB (DevTools → Application → Storage → Clear)
□ → log in again
□ → data restored correctly from Supabase
```

---

## 📝 Pull Request Template

When you open a PR, the template auto-fills. Fill every section — incomplete PRs may be closed.

---

## 🐛 Reporting Bugs

Use the **[Bug Report template](https://github.com/Suydev/isotope-code/issues/new?template=bug_report.md)**.

Include:
- OS + Node.js version
- Steps to reproduce (exact commands)
- Expected vs actual behaviour
- Relevant server logs (`isotope logs`)
- Whether `isotope doctor` passes

---

## 💡 Requesting Features

Use the **[Feature Request template](https://github.com/Suydev/isotope-code/issues/new?template=feature_request.md)**.

---

## 🤝 Code Style

- Use `const` / `let`, never `var`
- No `console.log` in server code — use `req.log` in routes
- Keep route handlers under 60 lines; extract helpers
- SQL: uppercase keywords, snake_case identifiers, `SECURITY DEFINER` on all functions

---

## ❤️ Thank You

Every bug fix, feature, and doc improvement helps thousands of students study better.

If you found IsotopeAI useful, please ⭐ the repo and share it!
