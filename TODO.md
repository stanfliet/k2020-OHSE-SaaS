# TODO.md (BlackboxAI)

## Step 1: Frontend compile fixes
- [ ] Fix duplicate `checkAPIHealth` export in `frontend/src/lib/api.ts`.
- [ ] Repair corrupted/duplicated `frontend/src/App.tsx` to a single coherent `AppContent` + `App`.

## Step 2: Backend entrypoint alignment (keep JavaScript)
- [ ] Verify backend uses `backend/index.js` (per `backend/package.json`).
- [ ] Ensure `backend/server.ts` does not break build/publish (likely leave as-is but not referenced).

## Step 3: Repo cleanliness for GitHub push
- [ ] Confirm `.gitignore` covers `node_modules`, `dist`, `.env*`, and backend `uploads/`.

## Step 4: Local verification
- [ ] Run `npm --prefix frontend run build`.
- [ ] Run `npm --prefix backend run start` (smoke test).
- [ ] Run root `npm run build`.

## Step 5: GitHub push unblock
- [ ] Provide exact git commands for initializing remote and pushing.

