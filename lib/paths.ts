import path from 'node:path';

export const uploadDir = path.join(process.cwd(), 'tmp/uploads');
export const convertedDir = path.join(process.cwd(), 'tmp/converted');
export const zipDir = path.join(process.cwd(), 'tmp/zips');
