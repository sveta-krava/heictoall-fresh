import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export type StoredArtifact = {
  token: string;
  absolutePath: string;
  fileName: string;
  mimeType: string;
  expiresAt: number;
};

const artifactStore = new Map<string, StoredArtifact>();

export function createToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function registerArtifact(artifact: StoredArtifact): void {
  artifactStore.set(artifact.token, artifact);
}

export function getArtifact(token: string): StoredArtifact | undefined {
  return artifactStore.get(token);
}

export async function deleteArtifact(token: string): Promise<void> {
  const artifact = artifactStore.get(token);
  if (!artifact) return;

  artifactStore.delete(token);

  try {
    await fs.unlink(artifact.absolutePath);
  } catch {
    // File may already be gone.
  }
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeBufferToFile(dirPath: string, fileName: string, buffer: Buffer): Promise<string> {
  await ensureDirectory(dirPath);
  const absolutePath = path.join(dirPath, fileName);
  await fs.writeFile(absolutePath, buffer);
  return absolutePath;
}
