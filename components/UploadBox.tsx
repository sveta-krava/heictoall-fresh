'use client';

import { useMemo, useState } from 'react';
import FileList, { ConvertedFile } from '@/components/FileList';

type ConvertResponse = {
  success: boolean;
  files: ConvertedFile[];
  zipUrl?: string | null;
  error?: string;
};

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 20;

const OUTPUT_FORMATS = [
  { id: 'jpg', label: 'JPG' },
  { id: 'png', label: 'PNG' },
  { id: 'pdf', label: 'PDF' },
];

export default function UploadBox() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResponse | null>(null);

  const selectedFileNames = useMemo(() => selectedFiles.map((file) => file.name), [selectedFiles]);

  const selectedFormatLabel =
    OUTPUT_FORMATS.find((format) => format.id === outputFormat)?.label ?? outputFormat.toUpperCase();

  function validateFiles(files: File[]): string | null {
    if (files.length === 0) {
      return 'Please choose at least one HEIC or HEIF file.';
    }

    if (files.length > MAX_FILES) {
      return `You can upload up to ${MAX_FILES} files at a time.`;
    }

    for (const file of files) {
      const lowerName = file.name.toLowerCase();
      const isValidExtension = lowerName.endsWith('.heic') || lowerName.endsWith('.heif');
      if (!isValidExtension) {
        return `Unsupported file type: ${file.name}. Please upload only .heic or .heif files.`;
      }

      const sizeInMb = file.size / (1024 * 1024);
      if (sizeInMb > MAX_FILE_SIZE_MB) {
        return `${file.name} exceeds the ${MAX_FILE_SIZE_MB} MB limit.`;
      }
    }

    return null;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setError(null);
    setResult(null);

    const validationError = validateFiles(files);
    if (validationError) {
      setSelectedFiles([]);
      setError(validationError);
      return;
    }

    setSelectedFiles(files);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));
    formData.append('format', outputFormat);

    setIsConverting(true);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as ConvertResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Conversion failed. Please try again.');
      }

      setResult(data);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Conversion failed. Please try again.';
      setError(message);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-950">Upload HEIC files</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Upload up to 10 files, 20 MB each. Supported formats: <strong>.heic</strong> and <strong>.heif</strong>.
          </p>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-gray-500 hover:bg-gray-100">
          <span className="text-base font-medium text-gray-900">Drag files here or click to browse</span>
          <span className="mt-2 text-sm text-gray-500">HEIC and HEIF only</span>
          <input
            type="file"
            accept=".heic,.heif,image/heic,image/heif"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <div>
          <label htmlFor="output-format" className="mb-2 block text-sm font-medium text-gray-900">
            Convert to
          </label>

          <select
            id="output-format"
            value={outputFormat}
            onChange={(event) => {
              setOutputFormat(event.target.value);
              setResult(null);
              setError(null);
            }}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-gray-900"
          >
            {OUTPUT_FORMATS.map((format) => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        {selectedFileNames.length > 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p className="mb-2 font-medium text-gray-900">Ready to convert</p>
            <ul className="space-y-1">
              {selectedFileNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <button
          type="submit"
          disabled={isConverting || selectedFiles.length === 0}
          className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isConverting ? 'Converting…' : `Convert to ${selectedFormatLabel}`}
        </button>
      </form>

      {isConverting ? (
        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Your files are being converted. Please keep this tab open.
        </div>
      ) : null}

      {result?.success ? <FileList files={result.files} zipUrl={result.zipUrl} /> : null}
    </div>
  );
}