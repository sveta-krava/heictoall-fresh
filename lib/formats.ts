export type FormatConfig = {
  id: string;
  label: string;
  mime: string;
  extension: string;
  heicConvertFormat?: 'JPEG' | 'PNG';
  quality?: number;
};

export const FORMATS: Record<string, FormatConfig> = {
  jpg: {
    id: 'jpg',
    label: 'JPG',
    mime: 'image/jpeg',
    extension: 'jpg',
    heicConvertFormat: 'JPEG',
    quality: 0.9,
  },
  png: {
    id: 'png',
    label: 'PNG',
    mime: 'image/png',
    extension: 'png',
    heicConvertFormat: 'PNG',
  },
  pdf: {
    id: 'pdf',
    label: 'PDF',
    mime: 'application/pdf',
    extension: 'pdf',
  },
};