import UploadBox from '@/components/UploadBox';

const benefits = [
  'Free forever',
  'Batch conversion up to 10 files',
  'Files deleted automatically',
  'No signup required',
];

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
      <div className="flex flex-col justify-center">
        <span className="mb-4 inline-flex w-fit rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
          Simple, private, and fast
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-gray-950 md:text-6xl">
          Convert HEIC to JPG online for free.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Upload HEIC or HEIF images from your iPhone or camera, convert them to high-quality JPG files,
          and download them in seconds. We only keep files temporarily to process the conversion.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm">
              {benefit}
            </div>
          ))}
        </div>
      </div>
      <UploadBox />
    </section>
  );
}
