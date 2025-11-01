import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const BUCKET = process.env.PRESCRIPTIONS_BUCKET || "prescriptions";
const OBJECT_KEY = process.env.PRESCRIPTIONS_PATH || "prescriptions.json";
const LOCAL_FILE = path.resolve(__dirname, "../data/prescriptions.json");

if (!S3_ENDPOINT || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
	console.error("Missing S3 credentials env variables.");
	process.exit(1);
}

if (!fs.existsSync(LOCAL_FILE)) {
	console.error(`Local file not found: ${LOCAL_FILE}`);
	process.exit(1);
}

const json = JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
if (!Array.isArray(json)) {
	console.error("Local prescriptions file must be a JSON array");
	process.exit(1);
}

// Drop id fields if present
const sanitized = json.map((o) => {
	const { id: _omit, ...rest } = o || {};
	return rest;
});

const s3Client = new S3Client({
	region: S3_REGION,
	endpoint: S3_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
	},
});

const body = JSON.stringify(sanitized, null, 2);

const command = new PutObjectCommand({
	Bucket: BUCKET,
	Key: OBJECT_KEY,
	Body: body,
	ContentType: "application/json",
});

try {
	await s3Client.send(command);
	console.log(`Uploaded ${sanitized.length} prescriptions to bucket='${BUCKET}' key='${OBJECT_KEY}'`);
} catch (error) {
	console.error("Upload failed:", error.message);
	process.exit(1);
}
