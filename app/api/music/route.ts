import { promises as fs } from "fs";
import path from "path";
import { parseBuffer } from "music-metadata";

export type TrackInfo = {
  id?: number;
  file: string;
  title: string;
  artists: string[];
  duration: number | null;
  image: string | null;
};

export async function GET() {
  try {
    const audioDir = path.join(process.cwd(), "public", "music");
    const files = await fs.readdir(audioDir);

    const mp3Files = files.filter((file) => file.endsWith(".mp3"));
    const trackList: TrackInfo[] = [];

    for (const file of mp3Files) {
      const filePath = path.join(audioDir, file);
      const buffer = await fs.readFile(filePath);
      const metadata = await parseBuffer(buffer, "audio/mpeg");

      // Extract minimal metadata
      const duration = metadata.format.duration || null;
      const artists =
        metadata.common.artists! || [metadata.common.artist] || [];
      const title = metadata.common.title || path.parse(file).name;

      // Extract and save album art
      let imageFileName = null;
      const picture = metadata.common.picture?.[0];
      if (picture) {
        const ext = picture.format.includes("png") ? "png" : "jpg";
        imageFileName = file.replace(/\.mp3$/, `.${ext}`);
        const imagePath = path.join(audioDir, imageFileName);

        // Optional: Skip if already exists
        try {
          await fs.access(imagePath);
        } catch {
          await fs.writeFile(imagePath, picture.data);
        }
      }

      trackList.push({
        file: file,
        title,
        artists,
        duration,
        image: imageFileName,
      });
    }

    return Response.json(trackList);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
