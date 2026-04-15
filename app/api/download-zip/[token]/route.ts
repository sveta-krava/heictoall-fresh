import fs from 'node:fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { deleteArtifact, getArtifact } from '@/lib/file-store';

export const runtime = 'nodejs';

export async function GET(_: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const artifact = getArtifact(token);

  if (!artifact) {
    return NextResponse.json({ success: false, error: 'ZIP download not found or expired.' }, { status: 404 });
  }

  if (artifact.expiresAt < Date.now()) {
    await deleteArtifact(token);
    return NextResponse.json({ success: false, error: 'ZIP download has expired.' }, { status: 410 });
  }

  const fileBuffer = await fs.readFile(artifact.absolutePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': artifact.mimeType,
      'Content-Disposition': `attachment; filename="${artifact.fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
}
