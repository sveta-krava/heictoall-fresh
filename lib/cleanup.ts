import fs from 'node:fs/promises';
import path from 'node:path';
import { getArtifact, deleteArtifact } from '@/lib/file-store';

const CLEANUP_INTERVAL_MS = 60 * 1000;
const tempDirectories = ['tmp/uploads', 'tmp/converted', 'tmp/zips'];

declare global {
  // eslint-disable-next-line no-var
  var __cleanupIntervalStarted: boolean | undefined;
}

async function removeExpiredArtifacts(): Promise<void> {
  // Map keys are not directly iterable from outside, so we scan known directories as a backup.
  const now = Date.now();

  // This token-based deletion is triggered from download handlers too. Here we also remove stale disk files.
  for (const dir of tempDirectories) {
    const absoluteDir = path.join(process.cwd(), dir);

    try {
      const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
      await Promise.all(
        entries
          .filter((entry) => entry.isFile())
          .map(async (entry) => {
            const fullPath = path.join(absoluteDir, entry.name);
            try {
              const stat = await fs.stat(fullPath);
              if (now - stat.mtimeMs > 20 * 60 * 1000) {
                await fs.unlink(fullPath);
              }
            } catch {
              // Ignore disappearing files.
            }
          }),
      );
    } catch {
      // Ignore missing directories.
    }
  }

  // Token invalidation via lookup pattern is intentionally simple in this MVP.
  // Download handlers also delete files after successful transfer.
  void getArtifact;
  void deleteArtifact;
}

export function startCleanupJob(): void {
  if (global.__cleanupIntervalStarted) {
    return;
  }

  global.__cleanupIntervalStarted = true;
  setInterval(() => {
    void removeExpiredArtifacts();
  }, CLEANUP_INTERVAL_MS);
}
