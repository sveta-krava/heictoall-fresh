import convert from 'heic-convert';
import { PDFDocument } from 'pdf-lib';
import { FORMATS } from '@/lib/formats';

async function convertHeicToPdf(buffer: Buffer): Promise<Buffer> {
  const jpgBuffer = await convert({
    buffer,
    format: 'JPEG',
    quality: 0.92,
  });

  const pdfDoc = await PDFDocument.create();
  const image = await pdfDoc.embedJpg(Buffer.from(jpgBuffer));

  const page = pdfDoc.addPage([image.width, image.height]);

  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}

export async function convertHeic(buffer: Buffer, formatId: string): Promise<Buffer> {
  const format = FORMATS[formatId];

  if (!format) {
    throw new Error(`Unsupported output format: ${formatId}`);
  }

  if (formatId === 'pdf') {
    return convertHeicToPdf(buffer);
  }

  if (!format.heicConvertFormat) {
    throw new Error(`Unsupported image output format: ${formatId}`);
  }

  const outputBuffer = await convert({
    buffer,
    format: format.heicConvertFormat,
    quality: format.quality,
  });

  return Buffer.from(outputBuffer);
}