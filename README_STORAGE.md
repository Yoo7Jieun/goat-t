# Prescriptions data via Supabase Storage (S3 API)

This app loads read-only `prescriptions.json` from a private Supabase Storage bucket at runtime (server-only) using the S3-compatible API.

## Setup

1. In Supabase Dashboard → Storage, create a bucket (e.g. `prescriptions`) and upload your `prescriptions.json`.
   - Keep the bucket private.
2. In Supabase Dashboard → Storage → Settings → S3 Access Keys, create a new access key.
3. Add the following environment variables (do NOT use `NEXT_PUBLIC_`):
   - `S3_ENDPOINT` (e.g. `https://YOUR_PROJECT_REF.supabase.co/storage/v1/s3`)
   - `S3_REGION` (e.g. `ap-northeast-2`)
   - `S3_ACCESS_KEY_ID` (from the S3 access key you created)
   - `S3_SECRET_ACCESS_KEY` (from the S3 access key you created)
   - `PRESCRIPTIONS_BUCKET` (default: `prescriptions`)
   - `PRESCRIPTIONS_PATH` (default: `prescriptions.json`)
4. In production (e.g. Vercel), add the same env vars in the project settings.

## Usage

- Import and call the server helper:

  ```ts
  import { fetchPrescriptions, getPrescriptionByCode } from "@/lib/prescriptions";

  const all = await fetchPrescriptions();
  const one = await getPrescriptionByCode("PESMA");
  ```

The helper uses the S3 API credentials and must be invoked on the server only.

## Notes

- If `data/prescriptions.json` exists locally, it should not be committed to public repos. Add it to `.gitignore`.
- For performance, the helper keeps a small in-memory cache on the server. Tune via `PRESCRIPTIONS_CACHE_TTL_MS`.
