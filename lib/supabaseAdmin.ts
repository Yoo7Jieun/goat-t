"use server";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	// Intentionally do not throw at import time in Next to avoid build breaks;
	// runtime calls will fail with a clearer error message.
}

export const supabaseAdmin =
	SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
		? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
				auth: { persistSession: false },
		  })
		: null;

export function assertSupabaseConfigured() {
	if (!supabaseAdmin) {
		throw new Error("Supabase admin client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.");
	}
}
