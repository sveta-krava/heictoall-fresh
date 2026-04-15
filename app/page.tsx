import Hero from '@/components/Hero';

const faqs = [
  {
    question: 'How do I convert HEIC to JPG?',
    answer:
      'Upload one or more HEIC files, click convert, and download the JPG files individually or as a ZIP archive if you uploaded multiple files.',
  },
  {
    question: 'Are my files stored?',
    answer:
      'No. Files are stored only temporarily while the conversion is running and are deleted automatically after a short period.',
  },
  {
    question: 'Can I upload multiple HEIC files?',
    answer: 'Yes. This MVP supports up to 10 HEIC or HEIF files per upload.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {faqs.map((item) => (
            <article key={item.question} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-950">{item.question}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.answer}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Why use this HEIC to JPG converter?</h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-gray-600">
            <p>
              HEIC is commonly used by iPhones because it saves storage space while keeping image quality high. The downside is that many apps,
              websites, and older devices still prefer JPG.
            </p>
            <p>
              This converter focuses on one job only: turning HEIC and HEIF photos into JPG quickly, with a clean interface and no account creation.
              It is designed as a minimal, extendable foundation for a larger file conversion platform.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
