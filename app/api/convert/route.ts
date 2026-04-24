import fs from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { MAX_FILES, MAX_FILE_SIZE_BYTES, DOWNLOAD_TTL_MS } from '@/lib/config';
import { convertHeic } from '@/lib/convert';
import { FORMATS } from '@/lib/formats';
import { startCleanupJob } from '@/lib/cleanup';
import { createToken, registerArtifact, writeBufferToFile } from '@/lib/file-store';
import { convertedDir, uploadDir, zipDir } from '@/lib/paths';
import { createZipBuffer } from '@/lib/zip';
import { jsonError } from '@/lib/http';
import { applyRateLimit, getClientIp, startRateLimitCleanup } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function sanitizeBaseName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, '');
  return withoutExtension
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'converted';
}

export async function POST(request: Request) {
  startCleanupJob();
  startRateLimitCleanup();

  const clientIp = getClientIp(request);
  const rateLimit = applyRateLimit(`convert:${clientIp}`, 10, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
    );

    return NextResponse.json(
      {
        success: false,
        error: `Too many conversion requests from this IP. Please try again in about ${Math.ceil(
          retryAfterSeconds / 60
        )} minute(s).`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSeconds),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
        },
      }
    );
  }

  const formData = await request.formData();
  const rawFiles = formData.getAll('files');

  const formatId = (formData.get('format') as string) || 'jpg';
  const outputFormat = FORMATS[formatId];

  if (!outputFormat) {
    return jsonError('Unsupported output format.');
  }

  if (rawFiles.length === 0) {
    return jsonError('No files were uploaded.');
  }

  if (rawFiles.length > MAX_FILES) {
    return jsonError(`You can upload up to ${MAX_FILES} files per request.`);
  }

  const files = rawFiles.filter((value): value is File => value instanceof File);

  if (files.length !== rawFiles.length) {
    return jsonError('Invalid upload payload.');
  }

  const convertedForZip: Array<{ fileName: string; content: Buffer }> = [];
  const convertedResponseFiles: Array<{
    name: string;
    downloadUrl: string;
    sizeBytes: number;
  }> = [];

  for (const file of files) {
    const lowerName = file.name.toLowerCase();
    const validExtension = lowerName.endsWith('.heic') || lowerName.endsWith('.heif');

    if (!validExtension) {
      return jsonError(`Unsupported file type: ${file.name}`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return jsonError(`${file.name} exceeds the 20 MB limit.`);
    }

    const inputArrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(inputArrayBuffer);

    const inputToken = createToken();
    const inputName = `${inputToken}-${file.name}`;
    const inputPath = await writeBufferToFile(uploadDir, inputName, inputBuffer);

    const convertedBuffer = await convertHeic(inputBuffer, formatId);

    try {
      await fs.unlink(inputPath);
    } catch {
      // Input file may already be gone.
    }

    const baseName = sanitizeBaseName(file.name);
    const outputFileName = `${baseName}.${outputFormat.extension}`;

    const outputToken = createToken();
    const storedOutputName = `${outputToken}-${outputFileName}`;
    const outputPath = await writeBufferToFile(convertedDir, storedOutputName, convertedBuffer);

    registerArtifact({
      token: outputToken,
      absolutePath: outputPath,
      fileName: outputFileName,
      mimeType: outputFormat.mime,
      expiresAt: Date.now() + DOWNLOAD_TTL_MS,
    });

    convertedForZip.push({
      fileName: outputFileName,
      content: convertedBuffer,
    });

    convertedResponseFiles.push({
      name: outputFileName,
      downloadUrl: `/api/download/${outputToken}`,
      sizeBytes: convertedBuffer.byteLength,
    });
  }

  let zipUrl: string | null = null;

  if (convertedForZip.length > 1) {
    const zipBuffer = createZipBuffer(convertedForZip);
    const zipToken = createToken();
    const zipFileName = `heic-to-${formatId}-${zipToken.slice(0, 8)}.zip`;
    const zipPath = await writeBufferToFile(zipDir, zipFileName, zipBuffer);

    registerArtifact({
      token: zipToken,
      absolutePath: zipPath,
      fileName: zipFileName,
      mimeType: 'application/zip',
      expiresAt: Date.now() + DOWNLOAD_TTL_MS,
    });

    zipUrl = `/api/download-zip/${zipToken}`;
  }

  return NextResponse.json(
    {
      success: true,
      files: convertedResponseFiles,
      zipUrl,
    },
    {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
      },
    }
  );
}