export type ConvertedFile = {
  name: string;
  downloadUrl: string;
  sizeBytes: number;
};

type FileListProps = {
  files: ConvertedFile[];
  zipUrl?: string | null;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({ files, zipUrl }: FileListProps) {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Converted files</h3>
        {zipUrl ? (
          <a
            href={zipUrl}
            className="rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            Download all as ZIP
          </a>
        ) : null}
      </div>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.downloadUrl}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.sizeBytes)}</p>
            </div>
            <a
              href={file.downloadUrl}
              className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Download JPG
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
