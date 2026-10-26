/**
 * A screen recording that costs nothing until someone wants it. The page holds a
 * frame of the video's real shape (so nothing jumps when it appears) with its
 * still in it; no video bytes are fetched until play is pressed (`preload="none"`),
 * it never starts by itself, and it has no sound to surprise anyone with. Plain
 * markup — there is no script to run for it.
 */
export function DemoVideo({
  src,
  poster,
  caption,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  caption: string;
  width: number;
  height: number;
  /** What the recording is of, for anyone who can't see it. */
  label: string;
}) {
  return (
    <figure>
      <div
        className="border-line bg-raise relative w-full overflow-hidden border"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <video
          controls
          playsInline
          preload="none"
          poster={poster}
          width={width}
          height={height}
          aria-label={label}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={src} type="video/mp4" />
          Your browser can’t play this video. The same walkthrough is on the live site.
        </video>
      </div>
      <figcaption className="text-muted mt-3 max-w-[64ch] text-[0.9rem] leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
