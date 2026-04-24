import { FORMATS } from "@/lib/formats";
import { convertHeic } from "@/lib/convert";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const formatId = (formData.get("format") as string) || "jpg";

  const format = FORMATS[formatId];

  if (!format) {
    return new Response("Invalid format", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const output = await convertHeic(buffer, formatId);

  return new Response(output, {
    headers: {
      "Content-Type": format.mime,
      "Content-Disposition": `attachment; filename="converted.${format.extension}"`,
    },
  });
}
