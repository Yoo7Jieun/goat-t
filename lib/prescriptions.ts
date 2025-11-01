"use server";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export type Prescription = {
	code: string;
	name?: string;
	dear?: string;
	letter?: string;
	concept?: string;
	movie?: string;
	challengeConcept?: string;
	challengeKeyword?: string;
	challengeActivity?: string;
	maintainConcept?: string;
	maintainKeyword?: string;
	maintainActivity?: string;
	reconcileConcept?: string;
	reconcileKeyword?: string;
	reconcileActivity?: string;
};

type PrescriptionsJSON = Prescription[];

const BUCKET = process.env.STORAGE_BUCKET || "goat_data";
const OBJECT_KEY = "prescriptions.json";

// Simple in-memory cache for server runtime
let cache: { data: PrescriptionsJSON; fetchedAt: number; checksum?: string } | null = null;
const TTL_MS = Number(process.env.STORAGE_CACHE_TTL_MS || 5 * 60 * 1000);

// S3 client for Supabase Storage (server-only)
let s3Client: S3Client | null = null;
function getS3Client() {
	if (!s3Client) {
		const endpoint = process.env.S3_ENDPOINT;
		const region = process.env.S3_REGION;
		const accessKeyId = process.env.S3_ACCESS_KEY_ID;
		const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

		if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
			throw new Error("S3 credentials missing. Set S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY in your environment.");
		}

		s3Client = new S3Client({
			region,
			endpoint,
			forcePathStyle: true, // Required for Supabase S3 compatibility
			credentials: { accessKeyId, secretAccessKey },
		});
	}
	return s3Client;
}

export async function fetchPrescriptions(): Promise<PrescriptionsJSON> {
	// Return cached if fresh
	if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache.data;

	const s3 = getS3Client();
	const command = new GetObjectCommand({ Bucket: BUCKET, Key: OBJECT_KEY });
	const response = await s3.send(command);

	if (!response.Body) {
		throw new Error("Failed to download prescriptions from S3 storage");
	}

	// Convert stream to string
	const text = await response.Body.transformToString("utf-8");
	const parsed = JSON.parse(text) as unknown;

	// minimal runtime validation
	if (!Array.isArray(parsed)) {
		throw new Error("prescriptions.json is not a JSON array");
	}
	const normalized: PrescriptionsJSON = parsed.map((item) => {
		const o = item as Record<string, unknown>;
		// Drop accidental id from CSV if present
		const { id: _omit, code, name, dear, letter, concept, movie, challengeConcept, challengeKeyword, challengeActivity, maintainConcept, maintainKeyword, maintainActivity, reconcileConcept, reconcileKeyword, reconcileActivity } = o as any;
		if (typeof code !== "string") {
			throw new Error("Each prescription must have a string 'code'");
		}
		return {
			code,
			name: name as string | undefined,
			dear: dear as string | undefined,
			letter: letter as string | undefined,
			concept: concept as string | undefined,
			movie: movie as string | undefined,
			challengeConcept: challengeConcept as string | undefined,
			challengeKeyword: challengeKeyword as string | undefined,
			challengeActivity: challengeActivity as string | undefined,
			maintainConcept: maintainConcept as string | undefined,
			maintainKeyword: maintainKeyword as string | undefined,
			maintainActivity: maintainActivity as string | undefined,
			reconcileConcept: reconcileConcept as string | undefined,
			reconcileKeyword: reconcileKeyword as string | undefined,
			reconcileActivity: reconcileActivity as string | undefined,
		} satisfies Prescription;
	});

	cache = { data: normalized, fetchedAt: Date.now() };
	return normalized;
}

export async function getPrescriptionByCode(code: string) {
	const list = await fetchPrescriptions();
	return list.find((p) => p.code === code) || null;
}
