"use server";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { PesmaQuestion } from "./types";

const BUCKET = process.env.STORAGE_BUCKET || "goat_data";
const PESMA_KEY = "pesma.json";

// Simple in-memory cache
let cache: { data: PesmaQuestion[]; fetchedAt: number } | null = null;
const TTL_MS = Number(process.env.STORAGE_CACHE_TTL_MS || 5 * 60 * 1000);

// S3 client (prescriptions.ts와 동일한 방식)
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
			forcePathStyle: true,
			credentials: { accessKeyId, secretAccessKey },
		});
	}
	return s3Client;
}

/**
 * S3에서 pesma.json을 읽어서 질문 배열 반환
 */
export async function fetchPesmaQuestions(): Promise<PesmaQuestion[]> {
	// Return cached if fresh
	if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
		return cache.data;
	}

	const s3 = getS3Client();
	const command = new GetObjectCommand({ Bucket: BUCKET, Key: PESMA_KEY });
	const response = await s3.send(command);

	if (!response.Body) {
		throw new Error("Failed to download pesma.json from S3 storage");
	}

	// Convert stream to string
	const text = await response.Body.transformToString("utf-8");
	const parsed = JSON.parse(text) as unknown;

	// Runtime validation
	if (typeof parsed !== "object" || parsed === null || !("pesma" in parsed)) {
		throw new Error("pesma.json must have a 'pesma' property");
	}

	const questionsArray = (parsed as { pesma: unknown }).pesma;
	if (!Array.isArray(questionsArray)) {
		throw new Error("pesma.json 'pesma' must be an array");
	}

	const isReverseId = (id: string) => /_r$/i.test(id);

	const questions: PesmaQuestion[] = questionsArray.map((item) => {
		const obj = item as Record<string, unknown>;
		if (typeof obj.id !== "string" || typeof obj.text !== "string") {
			throw new Error("Each question must have id (string) and text (string)");
		}
		// reverse_score가 없으면 id 접미사로 판단 (예: "s5_r")
		const reverseScore = typeof obj.reverse_score === "boolean" ? (obj.reverse_score as boolean) : isReverseId(obj.id as string);
		return {
			id: obj.id,
			text: obj.text,
			reverse_score: reverseScore,
		};
	});

	cache = { data: questions, fetchedAt: Date.now() };
	return questions;
}
