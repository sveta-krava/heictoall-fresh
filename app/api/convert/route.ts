import fs from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { MAX_FILES, MAX_FILE_SIZE_BYTES, DOWNLOAD_TTL_MS } from '@/lib/config';
import { convertHeicBufferToJpeg } from '@/lib/convert';
import { startCleanupJob } from '@/lib/cleanup';
import { createToken, registerArtifact, writeBufferToFile } from '@/lib/file-store';
import { convertedDir, uploadDir, zipDir } from '@/lib/paths';
import { createZipBuffer } from '@/lib/zip';
import { jsonError } from '@/lib/http';

export const runtime = 'nodejs';

function sanitizeBaseName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, '');
  return withoutExtension.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'converted';
}

export async function POST(request: Request) {
  startCleanupJob();

  const formData = await request.formData();
  const rawFiles = formData.getAll('files');

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
  const convertedResponseFiles: Array<{ name: string; downloadUrl: string; sizeBytes: number }> = [];

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

    const jpgBuffer = await convertHeicBufferToJpeg(inputBuffer);

    try {
      await fs.unlink(inputPath);
    } catch {
      // Input file may already be gone.
    }

    const baseName = sanitizeBaseName(file.name);
    const outputFileName = `${baseName}.jpg`;

    const outputToken = createToken();
    const storedOutputName = `${outputToken}-${outputFileName}`;
    const outputPath = await writeBufferToFile(convertedDir, storedOutputName, jpgBuffer);

    registerArtifact({
      token: outputToken,
      absolutePath: outputPath,
      fileName: outputFileName,
      mimeType: 'image/jpeg',
      expiresAt: Date.now() + DOWNLOAD_TTL_MS,
    });

    convertedForZip.push({ fileName: outputFileName, content: jpgBuffer });
    convertedResponseFiles.push({
      name: outputFileName,
      downloadUrl: `/api/download/${outputToken}`,
      sizeBytes: jpgBuffer.byteLength,
    });
  }

  let zipUrl: string | null = null;

  if (convertedForZip.length > 1) {
    const zipBuffer = createZipBuffer(convertedForZip);
    const zipToken = createToken();
    const zipFileName = `heic-to-jpg-${zipToken.slice(0, 8)}.zip`;
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

  return NextResponse.json({
    success: true,
    files: convertedResponseFiles,
    zipUrl,
  });
}