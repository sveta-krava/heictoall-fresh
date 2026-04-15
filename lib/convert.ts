import heicConvert from 'heic-convert';

export async function convertHeicBufferToJpeg(inputBuffer: Buffer, quality = 0.92): Promise<Buffer> {
  const output = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality,
  });

  return Buffer.from(output);
}
