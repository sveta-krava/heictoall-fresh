export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Privacy Policy</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-gray-600">
          <p>
            This website processes uploaded HEIC and HEIF files only for the purpose of converting them to JPG. Files are stored temporarily while the
            conversion runs and while download links remain valid.
          </p>
          <p>
            Converted files, original uploads, and ZIP archives are deleted automatically by a cleanup routine after a short retention period. No user
            account is required and no permanent conversion history is stored.
          </p>
          <p>
            Basic server logs may exist for operational and security purposes. Do not upload sensitive, regulated, or confidential material unless you
            are comfortable with temporary server-side processing.
          </p>
        </div>
      </div>
    </section>
  );
}
