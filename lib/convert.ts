import convert from 'heic-convert';
import { FORMATS } from '@/lib/formats';

export async function convertHeic(buffer: Buffer, formatId: string): Promise<Buffer> {
  const format = FORMATS[formatId];

  if (!format || !format.heicConvertFormat) {
    throw new Error(`Unsupported output format: ${formatId}`);
  }

  const outputBuffer = await convert({
    buffer,
    format: format.heicConvertFormat,
    quality: format.quality,
  });

  return Buffer.from(outputBuffer);
}