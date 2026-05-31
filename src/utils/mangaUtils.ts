export function getNextChapterUrl(
  old_chapters: Record<string, { latest_link: string }>,
  chapterNum: number,
  link: string,
  latest: string,
): string {
  const target = chapterNum + 1;
  if (old_chapters && Object.keys(old_chapters).length > 0) {
    const availableChapters = Object.keys(old_chapters)
      .map(Number)
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b)
      .map(String);
    if (availableChapters.length > 0) {
      const closest =
        availableChapters.find((ch) => +ch >= target) ||
        availableChapters[availableChapters.length - 1];
      return old_chapters[String(closest)].latest_link;
    }
  }
  return link.replace(latest, String(target));
}
