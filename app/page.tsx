import UploadBox from '@/components/UploadBox';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <section className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
            Convert HEIC to JPG online for free.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Fast, simple, and private HEIC to JPG conversion. No signup required.
          </p>

          <div className="mt-10 w-full max-w-2xl">
            <UploadBox />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold tracking-[0.2em] text-gray-900 uppercase">
            <span>Free</span>
            <span>Fast</span>
            <span>Secure</span>
          </div>
        </section>

        <section className="mt-16 space-y-10">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">Why use this converter?</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Convert iPhone HEIC and HEIF photos to JPG in seconds. Your files are processed temporarily and cleaned
              up automatically after conversion.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">How it works</h2>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-gray-600">
              <li>1. Upload your HEIC or HEIF files.</li>
              <li>2. Click Convert to JPG.</li>
              <li>3. Download your converted JPG files individually or as a ZIP.</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">Privacy</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Files are stored only temporarily for processing and download, then deleted automatically.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}