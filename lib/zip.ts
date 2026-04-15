import AdmZip from 'adm-zip';

export function createZipBuffer(files: Array<{ fileName: string; content: Buffer }>): Buffer {
  const zip = new AdmZip();

  files.forEach((file) => {
    zip.addFile(file.fileName, file.content);
  });

  return zip.toBuffer();
}
