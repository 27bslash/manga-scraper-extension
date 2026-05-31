interface Manga {
  title: string;
  chapter: string;
  latest: string;
  link: string;
  domain: string;
  scansite: string;
  read: boolean;
  current_source: string;
  sources: {
    [key: string]: {
      url: string;
      latest: string;
      chapter: string;
      latest_link: string;
      time_updated: number;
      old_chapters: {
        [key: string]: {
          latest: string;
          latest_link: string;
          scansite: string;
        };
      };
    };
  };
}
export type AllManga = {
  _id: string;
  domain: string;
  latest: string;
  latest_link: string;
  latest_sort: number;
  scansite: string;
  sources: Manga["sources"];
  time_updated: number;
  title: string;
  type: string;
};
export default Manga;
