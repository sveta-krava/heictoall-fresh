export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Terms of Use</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-gray-600">
          <p>
            This service is provided on an as-is basis without warranties of any kind. You are responsible for ensuring that you have the right to upload
            and convert any file submitted through the website.
          </p>
          <p>
            You must not use the service to upload malicious files, abuse server resources, attempt unauthorized access, or violate applicable laws.
            Files exceeding supported limits may be rejected automatically.
          </p>
          <p>
            The operator may modify, suspend, or discontinue the service at any time. These terms should be reviewed and expanded before a public
            commercial launch.
          </p>
        </div>
      </div>
    </section>
  );
}
