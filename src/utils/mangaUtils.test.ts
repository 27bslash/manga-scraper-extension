import { getNextChapterUrl } from './mangaUtils';

describe('getNextChapterUrl', () => {
  it('should return the exact next chapter if available in old_chapters', () => {
    const old_chapters = {
      '1': { latest_link: 'link1' },
      '2': { latest_link: 'link2' },
      '3': { latest_link: 'link3' },
    };
    const result = getNextChapterUrl(old_chapters, 1, 'base-link', 'latest');
    expect(result).toBe('link2');
  });

  it('should return the closest higher chapter if exact next is not available', () => {
    const old_chapters = {
      '1': { latest_link: 'link1' },
      '3': { latest_link: 'link3' },
      '5': { latest_link: 'link5' },
    };
    const result = getNextChapterUrl(old_chapters, 1, 'base-link', 'latest');
    expect(result).toBe('link3'); // next is 2, closest >=2 is 3
  });

  it('should return the last chapter if no higher chapters are available', () => {
    const old_chapters = {
      '1': { latest_link: 'link1' },
      '2': { latest_link: 'link2' },
    };
    const result = getNextChapterUrl(old_chapters, 2, 'base-link', 'latest');
    expect(result).toBe('link2'); // next is 3, no >=3, so last is 2
  });

  it('should use the replaced link if no old_chapters', () => {
    const old_chapters = {};
    const result = getNextChapterUrl(old_chapters, 1, 'base-link-latest', 'latest');
    expect(result).toBe('base-link-2');
  });

  it('should handle empty old_chapters object', () => {
    const old_chapters = {};
    const result = getNextChapterUrl(old_chapters, 1, 'base-link-latest', 'latest');
    expect(result).toBe('base-link-2');
  });

  it('should handle old_chapters with non-numeric keys by falling back to replace', () => {
    const old_chapters = {
      'a': { latest_link: 'linka' },
    };
    const result = getNextChapterUrl(old_chapters, 1, 'base-link-latest', 'latest');
    expect(result).toBe('base-link-2');
  });
});