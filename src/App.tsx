import React from "react";
import "./App.css";
import Popup from "./components/popup/popup";
import { useEffect, useState } from "react";
import Manga, { AllManga } from "./types/manga";
function PopupFromExtension() {
  const [allManga, setAllManga] = useState<AllManga[]>([]);

  useEffect(() => {
    const runtime = globalThis?.chrome?.runtime;
    if (!runtime?.sendMessage) {
      return;
    }

    runtime.sendMessage({ type: "popupOpened" }, () => {
      const runtimeError = runtime.lastError;
      if (runtimeError) {
        console.error("Failed to notify popup open:", runtimeError.message);
      }
    });

    runtime.sendMessage({ type: "getAllManga" }, (response) => {
      const runtimeError = runtime.lastError;
      if (runtimeError) {
        console.error("Failed to load all manga:", runtimeError.message);
        return;
      }

      const data: AllManga[] = response?.getAllManga;
      if (Array.isArray(data)) {
        setAllManga(data);
      }
    });
  }, []);

  return <Popup allManga={allManga} />;
}

function App() {
  const mode = process.env.REACT_APP_POPUP_MODE || "standard";
  const demoMangaList:any = [
    {
      best_score: 100,
      chapter: "87",
      closest_title: "albus-changes-the-world",
      current_source: "any",
      domain: "https://www.reddit.com",
      latest: "87",
      read: true,
      scansite: "reddit",
      sources: {
        any: {
          chapter: "87",
          latest: "87",
          latest_link:
            "https://www.viz.com/vizmanga/albus-changes-the-world-chapter-87/chapter/49842",
          old_chapters: {},
          time_updated: 1777422628,
          url: "https://www.viz.com/vizmanga/albus-changes-the-world-chapter-86/chapter/49816",
        },
        reddit: {
          latest: "85",
          latest_link: "https://www.reddit.com/gallery/1splktt",
          old_chapters: {},
          time_updated: 1776581452,
        },
        viz: {
          latest: "87",
          latest_link:
            "https://www.viz.com/vizmanga/albus-changes-the-world-chapter-87/chapter/49842",
          old_chapters: {},
          time_updated: 1777422628,
        },
      },
      title: "albus-changes-the-world",
    },
    {
      best_score: 100,
      chapter: "309",
      closest_title: "omniscient-reader's-viewpoint",
      current_source: "any",
      domain: "",
      latest: "309",
      link: "https://asuracomic.net/series/omniscient-readers-viewpoint-3bde9879/chapter/281",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "309",
          latest: "309",
          latest_link: "https://cubari.moe/read/imgchest/na7kqwl3q78/1/1/",
          old_chapters: {},
          time_updated: 1777470495,
          url: "https://asurascans.com/comics/omniscient-readers-viewpoint-0984835a/chapter/309",
        },
        asurascans: {
          chapter: "306",
          latest: "307",
          latest_link:
            "https://asurascans.com/comics/omniscient-readers-viewpoint-963c76c5/chapter/307",
          old_chapters: {
            "306": {
              latest_link:
                "https://asurascans.com/comics/omniscient-readers-viewpoint-963c76c5/chapter/306",
              scansite: "asurascans",
            },
            "307": {
              latest_link:
                "https://asurascans.com/comics/omniscient-readers-viewpoint-963c76c5/chapter/307",
              scansite: "asurascans",
            },
          },
          time_updated: 1776340830.4779236,
          url: "https://asuracomic.net/series/omniscient-readers-viewpoint-e9bd0077/chapter/304",
        },
        cubari: {
          latest: "309",
          latest_link: "https://cubari.moe/read/imgchest/na7kqwl3q78/1/1/",
          old_chapters: {},
          time_updated: 1777470495,
        },
        flamecomics: {
          latest: "294",
          latest_link:
            "https://flamecomics.com/omniscient-readers-viewpoint-chapter-294",
          old_chapters: {},
          time_updated: 1767810237,
        },
      },
      title: "omniscient-reader's-viewpoint",
    },
    {
      best_score: 100,
      chapter: "121",
      closest_title: "star-embracing-swordmaster",
      current_source: "asuracomic",
      domain: "",
      latest: "121",
      link: "https://asuratoon.com/1908287720-star-embracing-swordmaster-chapter-46/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "121",
          latest: "121",
          latest_link: "https://cubari.moe/read/imgchest/ljyqe2vwky2/1/1/",
          old_chapters: {},
          time_updated: 1778021039,
          url: "https://cubari.moe/read/imgchest/ljyqe2vwky2/1/1/",
        },
        asuracomic: {
          latest: "112",
          latest_link: "https://cubari.moe/read/imgchest/md7ovedjlyp/1/1/",
          old_chapters: {},
          time_updated: 1772599620,
        },
        asurascans: {
          latest: "121",
          latest_link: "https://cubari.moe/read/imgchest/ljyqe2vwky2/1/1/",
          old_chapters: {},
          time_updated: 1778021039,
          url: "https://asuratoon.com/1908287720-star-embracing-swordmaster-chapter-46/",
        },
        cubari: {
          latest: "98",
          latest_link: "https://cubari.moe/read/imgchest/6eyrn5eqx7p/1/1/",
          old_chapters: {},
          time_updated: 1766540186,
        },
        manhuafast: {
          latest: "120",
          latest_link:
            "https://manhuafast.net/manga/star-embracing-swordmaster/chapter-120/",
          old_chapters: {
            "119": {
              latest_link:
                "https://manhuafast.net/manga/star-embracing-swordmaster/chapter-119/",
              scansite: "manhuafast",
            },
            "120": {
              latest_link:
                "https://manhuafast.net/manga/star-embracing-swordmaster/chapter-120/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777424299.3030171,
        },
      },
      title: "star-embracing-swordmaster",
    },
    {
      best_score: 100,
      chapter: "161",
      closest_title: "return-of-the-mount-hua-sect",
      current_source: "asurascans",
      domain: "",
      latest: "161",
      link: "https://asuratoon.com/8612194254-return-of-the-mount-hua-sect-chapter-82/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "161",
          latest: "161",
          latest_link:
            "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/161",
          old_chapters: {
            "159": {
              latest_link:
                "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/159",
              scansite: "asurascans",
            },
            "160": {
              latest_link:
                "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/160",
              scansite: "asurascans",
            },
            "161": {
              latest_link:
                "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/161",
              scansite: "asurascans",
            },
          },
          time_updated: 1778000423.9474363,
          url: "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/161",
        },
        asuracomic: {
          latest: "151",
          latest_link:
            "https://asuracomic.netreturn-of-the-mount-hua-sect-chapter-151/",
          old_chapters: {},
          time_updated: 1732816298,
        },
        asuracomics: {
          latest: "110",
          latest_link:
            "https://asuracomics.com/return-of-the-mount-hua-sect-chapter-110/",
          old_chapters: {},
          time_updated: 1707364862,
        },
        asurascans: {
          latest: "161",
          latest_link:
            "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/161",
          old_chapters: {
            "159": {
              latest_link:
                "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/159",
              scansite: "asurascans",
            },
            "160": {
              latest_link:
                "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/160",
              scansite: "asurascans",
            },
            "161": {
              latest_link:
                "https://asurascans.com/comics/return-of-the-mount-hua-sect-b6e039fe/chapter/161",
              scansite: "asurascans",
            },
          },
          time_updated: 1778000423.9474363,
          url: "https://asuratoon.com/8612194254-return-of-the-mount-hua-sect-chapter-82/",
        },
        asuratoon: {
          latest: "133",
          latest_link:
            "https://asuratoon.com/return-of-the-mount-hua-sect-chapter-133/",
          old_chapters: {},
          time_updated: 1721771951,
        },
        flixscans: {
          latest: "126",
          latest_link:
            "https://flixscans.org/read/webtoon/41641-4488-chapter-126",
          old_chapters: {
            "126": {
              latest_link:
                "https://flixscans.org/read/webtoon/41641-4488-chapter-126",
              scansite: "flixscans",
            },
          },
          time_updated: 1717606838.5933774,
        },
        kaiscans: {
          latest: "84",
          latest_link:
            "https://kaiscans.com/manga/return-of-the-mount-hua-sect/84/",
          old_chapters: {},
          time_updated: 1691590485,
        },
        webtoons: {
          latest: "154",
          latest_link:
            "https://www.webtoons.com/en/action/return-of-the-blossoming-blade/episode-spin-off-1-/viewer?title_no=2849&episode_no=154",
          old_chapters: {},
          time_updated: 1741978714,
        },
      },
      title: "return-of-the-mount-hua-sect",
    },
    {
      best_score: 100,
      chapter: "152",
      closest_title: "surviving-the-game-as-a-barbarian",
      current_source: "asurascans",
      domain: "",
      latest: "152",
      link: "https://asuracomic.net/series/surviving-the-game-as-a-barbarian-ffa1cc42/chapter/122",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "122",
          latest: "152",
          latest_link:
            "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/152",
          old_chapters: {
            "150": {
              latest_link:
                "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/150",
              scansite: "asurascans",
            },
            "151": {
              latest_link:
                "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/151",
              scansite: "asurascans",
            },
            "152": {
              latest_link:
                "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/152",
              scansite: "asurascans",
            },
          },
          time_updated: 1777391891.812279,
          url: "https://asuracomic.net/series/surviving-the-game-as-a-barbarian-ffa1cc42/chapter/122",
        },
        asurascans: {
          chapter: "152",
          latest: "152",
          latest_link:
            "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/152",
          old_chapters: {
            "150": {
              latest_link:
                "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/150",
              scansite: "asurascans",
            },
            "151": {
              latest_link:
                "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/151",
              scansite: "asurascans",
            },
            "152": {
              latest_link:
                "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/152",
              scansite: "asurascans",
            },
          },
          time_updated: 1777391891.812279,
          url: "https://asurascans.com/comics/surviving-the-game-as-a-barbarian-0984835a/chapter/152",
        },
        manhuafast: {
          latest: "152",
          latest_link:
            "https://manhuafast.net/manga/surviving-the-game-as-a-barbarian/chapter-152/",
          old_chapters: {
            "151": {
              latest_link:
                "https://manhuafast.net/manga/surviving-the-game-as-a-barbarian/chapter-151/",
              scansite: "manhuafast",
            },
            "152": {
              latest_link:
                "https://manhuafast.net/manga/surviving-the-game-as-a-barbarian/chapter-152/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777424299.3015137,
        },
      },
      title: "surviving-the-game-as-a-barbarian",
    },
    {
      best_score: 100,
      chapter: "132",
      closest_title: "the-indomitable-martial-king",
      current_source: "asurascans",
      domain: "",
      latest: "132",
      link: "https://asuratoon.com/1908287720-the-indomitable-martial-king-chapter-35/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "99",
          latest: "132",
          latest_link:
            "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/132",
          old_chapters: {
            "130": {
              latest_link:
                "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/130",
              scansite: "asurascans",
            },
            "131": {
              latest_link:
                "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/131",
              scansite: "asurascans",
            },
            "132": {
              latest_link:
                "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/132",
              scansite: "asurascans",
            },
          },
          time_updated: 1777915821.083039,
          url: "https://asuracomic.net/series/the-indomitable-martial-king-b44844b2/chapter/99",
        },
        asurascans: {
          chapter: "132",
          latest: "132",
          latest_link:
            "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/132",
          old_chapters: {
            "130": {
              latest_link:
                "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/130",
              scansite: "asurascans",
            },
            "131": {
              latest_link:
                "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/131",
              scansite: "asurascans",
            },
            "132": {
              latest_link:
                "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/132",
              scansite: "asurascans",
            },
          },
          time_updated: 1777915821.083039,
          url: "https://asurascans.com/comics/the-indomitable-martial-king-b6e039fe/chapter/132",
        },
        manhuafast: {
          latest: "132",
          latest_link:
            "https://manhuafast.net/manga/the-indomitable-martial-king/chapter-132/",
          old_chapters: {
            "131": {
              latest_link:
                "https://manhuafast.net/manga/the-indomitable-martial-king/chapter-131/",
              scansite: "manhuafast",
            },
            "132": {
              latest_link:
                "https://manhuafast.net/manga/the-indomitable-martial-king/chapter-132/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777936532.9986591,
        },
      },
      title: "the-indomitable-martial-king",
    },
    {
      best_score: 100,
      chapter: "162",
      closest_title: "the-s-classes-that-i-raised",
      current_source: "any",
      domain: "https://www.asurascans.com/",
      latest: "162",
      link: "https://asuratoon.com/4371207539-the-s-classes-that-i-raised-chapter-107/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "162",
          latest: "162",
          latest_link:
            "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/162",
          old_chapters: {
            "160": {
              latest_link:
                "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/160",
              scansite: "asurascans",
            },
            "161": {
              latest_link:
                "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/161",
              scansite: "asurascans",
            },
            "162": {
              latest_link:
                "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/162",
              scansite: "asurascans",
            },
          },
          time_updated: 1777798510.2023783,
          url: "https://asurascans.com/comics/the-s-classes-that-i-raised-0984835a/chapter/162",
        },
        asura: {
          latest: "60",
          latest_link:
            "https://asurascans.com/the-s-classes-that-i-raised-ch-chapter-60/",
          old_chapters: {},
          time_updated: 1667834750,
        },
        asurascans: {
          latest: "162",
          latest_link:
            "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/162",
          old_chapters: {
            "160": {
              latest_link:
                "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/160",
              scansite: "asurascans",
            },
            "161": {
              latest_link:
                "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/161",
              scansite: "asurascans",
            },
            "162": {
              latest_link:
                "https://asurascans.com/comics/the-s-classes-that-i-raised-b6e039fe/chapter/162",
              scansite: "asurascans",
            },
          },
          time_updated: 1777798510.2023783,
          url: "https://asuratoon.com/4371207539-the-s-classes-that-i-raised-chapter-107/",
        },
      },
      title: "the-s-classes-that-i-raised",
    },
    {
      best_score: 100,
      chapter: "124",
      closest_title: "mr-devourer-please-act-like-a-final-boss",
      current_source: "any",
      domain: "",
      latest: "124",
      link: "https://asuracomic.net/series/mr-devourer-please-act-like-a-final-boss-f793d1d7/chapter/73",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "124",
          latest: "124",
          latest_link:
            "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/124",
          old_chapters: {
            "122": {
              latest_link:
                "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/122",
              scansite: "asurascans",
            },
            "123": {
              latest_link:
                "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/123",
              scansite: "asurascans",
            },
            "124": {
              latest_link:
                "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/124",
              scansite: "asurascans",
            },
          },
          time_updated: 1777798510.2033806,
          url: "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-0984835a/chapter/124",
        },
        asurascans: {
          latest: "124",
          latest_link:
            "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/124",
          old_chapters: {
            "122": {
              latest_link:
                "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/122",
              scansite: "asurascans",
            },
            "123": {
              latest_link:
                "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/123",
              scansite: "asurascans",
            },
            "124": {
              latest_link:
                "https://asurascans.com/comics/mr-devourer-please-act-like-a-final-boss-b6e039fe/chapter/124",
              scansite: "asurascans",
            },
          },
          time_updated: 1777798510.2033806,
          url: "https://asuracomic.net/series/mr-devourer-please-act-like-a-final-boss-f793d1d7/chapter/73",
        },
      },
      title: "mr-devourer,-please-act-like-a-final-boss",
    },
    {
      best_score: 100,
      chapter: "168",
      closest_title: "chronicles-of-the-demon-faction",
      current_source: "any",
      domain: "https://manhuafast.net/",
      latest: "168",
      read: true,
      scansite: "manhuafast",
      sources: {
        any: {
          chapter: "168",
          latest: "168",
          latest_link:
            "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/168",
          old_chapters: {
            "166": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/166",
              scansite: "asurascans",
            },
            "167": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/167",
              scansite: "asurascans",
            },
            "168": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/168",
              scansite: "asurascans",
            },
          },
          time_updated: 1777798510.2023783,
          url: "https://asurascans.com/comics/chronicles-of-the-demon-faction-0984835a/chapter/168",
        },
        asurascans: {
          latest: "168",
          latest_link:
            "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/168",
          old_chapters: {
            "166": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/166",
              scansite: "asurascans",
            },
            "167": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/167",
              scansite: "asurascans",
            },
            "168": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-demon-faction-b6e039fe/chapter/168",
              scansite: "asurascans",
            },
          },
          time_updated: 1777798510.2023783,
        },
        manhuafast: {
          latest: "168",
          latest_link:
            "https://manhuafast.net/manga/chronicles-of-the-demon-faction/chapter-168/",
          old_chapters: {
            "167": {
              latest_link:
                "https://manhuafast.net/manga/chronicles-of-the-demon-faction/chapter-167/",
              scansite: "manhuafast",
            },
            "168": {
              latest_link:
                "https://manhuafast.net/manga/chronicles-of-the-demon-faction/chapter-168/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777807829.8624651,
        },
      },
      title: "chronicles-of-the-demon-faction",
    },
    {
      best_score: 100,
      chapter: "255",
      closest_title: "the-great-mage-returns-after-4000-years",
      current_source: "asurascans",
      domain: "",
      latest: "255",
      link: "https://asuracomic.net/series/the-great-mage-returns-after-4000-years-582e82e6/chapter/204",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "223",
          latest: "255",
          latest_link:
            "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/255",
          old_chapters: {
            "253": {
              latest_link:
                "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/253",
              scansite: "asurascans",
            },
            "254": {
              latest_link:
                "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/254",
              scansite: "asurascans",
            },
            "255": {
              latest_link:
                "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/255",
              scansite: "asurascans",
            },
          },
          time_updated: 1777876221.0845523,
          url: "https://asuracomic.net/series/the-great-mage-returns-after-4000-years-4bc88b9e/chapter/223",
        },
        asurascans: {
          chapter: "255",
          latest: "255",
          latest_link:
            "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/255",
          old_chapters: {
            "253": {
              latest_link:
                "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/253",
              scansite: "asurascans",
            },
            "254": {
              latest_link:
                "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/254",
              scansite: "asurascans",
            },
            "255": {
              latest_link:
                "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-b6e039fe/chapter/255",
              scansite: "asurascans",
            },
          },
          time_updated: 1777876221.0845523,
          url: "https://asurascans.com/comics/the-great-mage-returns-after-4000-years-0984835a/chapter/254",
        },
      },
      title: "the-great-mage-returns-after-4000-years",
    },
    {
      best_score: 100,
      chapter: "126",
      closest_title: "the-nebulas-civilization",
      current_source: "any",
      domain: "",
      latest: "126",
      link: "https://asuracomic.net/series/the-nebulas-civilization-7fca7be2/chapter/119",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "126",
          latest: "126",
          latest_link:
            "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/126",
          old_chapters: {
            "124": {
              latest_link:
                "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/124",
              scansite: "asurascans",
            },
            "125": {
              latest_link:
                "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/125",
              scansite: "asurascans",
            },
            "126": {
              latest_link:
                "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/126",
              scansite: "asurascans",
            },
          },
          time_updated: 1777277409.9109702,
          url: "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/126",
        },
        asurascans: {
          chapter: "119",
          latest: "126",
          latest_link:
            "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/126",
          old_chapters: {
            "124": {
              latest_link:
                "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/124",
              scansite: "asurascans",
            },
            "125": {
              latest_link:
                "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/125",
              scansite: "asurascans",
            },
            "126": {
              latest_link:
                "https://asurascans.com/comics/the-nebulas-civilization-0984835a/chapter/126",
              scansite: "asurascans",
            },
          },
          time_updated: 1777277409.9109702,
          url: "https://asuracomic.net/series/the-nebulas-civilization-7fca7be2/chapter/119",
        },
      },
      title: "the-nebula's-civilization",
    },
    {
      best_score: 100,
      chapter: "108",
      closest_title: "eternally-regressing-knight",
      current_source: "any",
      domain: "",
      latest: "108",
      link: "https://asuracomic.net/series/eternally-regressing-knight-36846e1a/chapter/76",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "108",
          latest: "108",
          latest_link:
            "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/108",
          old_chapters: {
            "106": {
              latest_link:
                "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/106",
              scansite: "asurascans",
            },
            "107": {
              latest_link:
                "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/107",
              scansite: "asurascans",
            },
            "108": {
              latest_link:
                "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/108",
              scansite: "asurascans",
            },
          },
          time_updated: 1777876221.083039,
          url: "https://asurascans.com/comics/eternally-regressing-knight-963c76c5/chapter/107",
        },
        asurascans: {
          chapter: "108",
          latest: "108",
          latest_link:
            "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/108",
          old_chapters: {
            "106": {
              latest_link:
                "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/106",
              scansite: "asurascans",
            },
            "107": {
              latest_link:
                "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/107",
              scansite: "asurascans",
            },
            "108": {
              latest_link:
                "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/108",
              scansite: "asurascans",
            },
          },
          time_updated: 1777876221.083039,
          url: "https://asurascans.com/comics/eternally-regressing-knight-b6e039fe/chapter/108",
        },
        manhuafast: {
          latest: "108",
          latest_link:
            "https://manhuafast.net/manga/eternally-regressing-knight/chapter-108/",
          old_chapters: {
            "107": {
              latest_link:
                "https://manhuafast.net/manga/eternally-regressing-knight/chapter-107/",
              scansite: "manhuafast",
            },
            "108": {
              latest_link:
                "https://manhuafast.net/manga/eternally-regressing-knight/chapter-108/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777897832.9986591,
        },
      },
      title: "eternally-regressing-knight",
    },
    {
      best_score: 100,
      chapter: "120",
      closest_title: "kagurabachi",
      current_source: "any",
      domain: "",
      latest: "120",
      link: "https://mangaplus.shueisha.co.jp/viewer/1028408",
      read: true,
      scansite: "mangaplus",
      sources: {
        any: {
          chapter: "120",
          latest: "120",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028803",
          old_chapters: {},
          time_updated: 1777215663,
          url: "https://mangaplus.shueisha.co.jp/viewer/1028803",
        },
        mangaplus: {
          chapter: "113",
          latest: "120",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028803",
          old_chapters: {},
          time_updated: 1777215663,
          url: "https://mangaplus.shueisha.co.jp/viewer/1028408",
        },
      },
      title: "kagurabachi",
    },
    {
      best_score: 100,
      chapter: "257",
      closest_title: "sakamoto-days",
      current_source: "any",
      domain: "mangaplus.shueisha.co.jp",
      latest: "257",
      link: "https://mangaplus.shueisha.co.jp/viewer/1013331",
      read: true,
      scansite: "mangaplus",
      sources: {
        any: {
          chapter: "257",
          latest: "257",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028762",
          old_chapters: {},
          time_updated: 1777215624,
          url: "https://mangaplus.shueisha.co.jp/viewer/1028762",
        },
        mangaplus: {
          latest: "257",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028762",
          old_chapters: {},
          time_updated: 1777215624,
        },
      },
      title: "sakamoto-days",
    },
    {
      best_score: 100,
      chapter: "133",
      closest_title: "spy-x-family",
      current_source: "any",
      domain: "mangaplus.shueisha.co.jp",
      latest: "133",
      link: "https://mangaplus.shueisha.co.jp/viewer/1013509",
      read: true,
      scansite: "mangaplus",
      sources: {
        any: {
          chapter: "133",
          latest: "133",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028764",
          old_chapters: {},
          time_updated: 1777215611,
          url: "https://mangaplus.shueisha.co.jp/viewer/1028764",
        },
        mangaplus: {
          latest: "133",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028764",
          old_chapters: {},
          time_updated: 1777215611,
        },
        tcbscans: {
          latest: "78",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7336/spy-x-family-chapter-78-review-1687770183",
          old_chapters: {},
          time_updated: 1681219639,
        },
      },
      title: "spy-x-family",
    },
    {
      best_score: 100,
      chapter: "287",
      closest_title: "survival-story-of-a-sword-king-in-a-fantasy-world",
      current_source: "any",
      domain: "https://lscomic.com/",
      latest: "287",
      read: true,
      scansite: "leviatanscans",
      sources: {
        any: {
          chapter: "287",
          latest: "287",
          latest_link: "https://cubari.moe/read/imgchest/ej7mrwmdq4d/1/1/",
          old_chapters: {},
          time_updated: 1777806425,
          url: "https://cubari.moe/read/imgchest/ej7mrwmdq4d/1/1/",
        },
        cubari: {
          latest: "287",
          latest_link: "https://cubari.moe/read/imgchest/ej7mrwmdq4d/1/1/",
          old_chapters: {},
          time_updated: 1777806425,
        },
        rizzfables: {
          latest: "255",
          latest_link:
            "https://rizzfables.com/chapter/r2311170-survival-story-of-a-sword-king-in-a-fantasy-world-chapter-255",
          old_chapters: {
            "251": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-survival-story-of-a-sword-king-in-a-fantasy-world-chapter-251",
              scansite: "rizzfables",
            },
            "252": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-survival-story-of-a-sword-king-in-a-fantasy-world-chapter-252",
              scansite: "rizzfables",
            },
            "253": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-survival-story-of-a-sword-king-in-a-fantasy-world-chapter-253",
              scansite: "rizzfables",
            },
            "254": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-survival-story-of-a-sword-king-in-a-fantasy-world-chapter-254",
              scansite: "rizzfables",
            },
            "255": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-survival-story-of-a-sword-king-in-a-fantasy-world-chapter-255",
              scansite: "rizzfables",
            },
          },
          time_updated: 1754404268,
        },
      },
      title: "survival-story-of-a-sword-king-in-a-fantasy-world",
    },
    {
      best_score: 100,
      chapter: "245",
      closest_title: "infinite-level-up-in-murim",
      current_source: "any",
      domain: "",
      latest: "258",
      link: "https://realmscans.com/m050523/infinite-level-up-in-murim-chapter-154/",
      read: false,
      scansite: "realmscans",
      sources: {
        any: {
          latest: "258",
          latest_link: "https://cubari.moe/read/imgchest/dl7pwd8xjyo/1/1/",
          old_chapters: {},
          time_updated: 1777936106,
          url: "https://rizzfables.com/chapter/r2311170-infinite-level-up-in-murim-chapter-245",
        },
        cubari: {
          latest: "258",
          latest_link: "https://cubari.moe/read/imgchest/dl7pwd8xjyo/1/1/",
          old_chapters: {},
          time_updated: 1777936106,
        },
        rizzfables: {
          latest: "245",
          latest_link:
            "https://rizzfables.com/chapter/r2311170-infinite-level-up-in-murim-chapter-245",
          old_chapters: {
            "241": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-infinite-level-up-in-murim-chapter-241",
              scansite: "rizzfables",
            },
            "242": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-infinite-level-up-in-murim-chapter-242",
              scansite: "rizzfables",
            },
            "243": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-infinite-level-up-in-murim-chapter-243",
              scansite: "rizzfables",
            },
            "244": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-infinite-level-up-in-murim-chapter-244",
              scansite: "rizzfables",
            },
            "245": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-infinite-level-up-in-murim-chapter-245",
              scansite: "rizzfables",
            },
          },
          time_updated: 1754582672,
        },
      },
      title: "infinite-level-up-in-murim",
    },
    {
      best_score: 100,
      chapter: "99",
      closest_title: "absolute-regression",
      current_source: "any",
      domain: "",
      latest: "99",
      link: "https://asuracomic.net/series/absolute-regression-19f3a7a2/chapter/85",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "99",
          latest: "99",
          latest_link:
            "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/99",
          old_chapters: {
            "97": {
              latest_link:
                "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/97",
              scansite: "asurascans",
            },
            "98": {
              latest_link:
                "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/98",
              scansite: "asurascans",
            },
            "99": {
              latest_link:
                "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/99",
              scansite: "asurascans",
            },
          },
          time_updated: 1777833026.1842515,
          url: "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/99",
        },
        asurascans: {
          chapter: "85",
          latest: "99",
          latest_link:
            "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/99",
          old_chapters: {
            "97": {
              latest_link:
                "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/97",
              scansite: "asurascans",
            },
            "98": {
              latest_link:
                "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/98",
              scansite: "asurascans",
            },
            "99": {
              latest_link:
                "https://asurascans.com/comics/absolute-regression-b6e039fe/chapter/99",
              scansite: "asurascans",
            },
          },
          time_updated: 1777833026.1842515,
          url: "https://asuracomic.net/series/absolute-regression-19f3a7a2/chapter/85",
        },
        manhuafast: {
          latest: "99",
          latest_link:
            "https://manhuafast.net/manga/absolute-regression/chapter-99/",
          old_chapters: {
            "98": {
              latest_link:
                "https://manhuafast.net/manga/absolute-regression/chapter-98/",
              scansite: "manhuafast",
            },
            "99": {
              latest_link:
                "https://manhuafast.net/manga/absolute-regression/chapter-99/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777858238.1461706,
        },
      },
      title: "absolute-regression",
    },
    {
      best_score: 100,
      chapter: "158",
      closest_title: "chronicles-of-the-martial-gods-return",
      current_source: "any",
      domain: "",
      latest: "158",
      link: "https://asuratoon.com/1908287720-chronicles-of-the-martial-gods-return-chapter-88/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "158",
          latest: "158",
          latest_link:
            "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/158",
          old_chapters: {
            "156": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/156",
              scansite: "asurascans",
            },
            "157": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/157",
              scansite: "asurascans",
            },
            "158": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/158",
              scansite: "asurascans",
            },
          },
          time_updated: 1777712110.2043781,
          url: "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-0984835a/chapter/158",
        },
        asurascans: {
          latest: "158",
          latest_link:
            "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/158",
          old_chapters: {
            "156": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/156",
              scansite: "asurascans",
            },
            "157": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/157",
              scansite: "asurascans",
            },
            "158": {
              latest_link:
                "https://asurascans.com/comics/chronicles-of-the-martial-gods-return-b6e039fe/chapter/158",
              scansite: "asurascans",
            },
          },
          time_updated: 1777712110.2043781,
          url: "https://asuratoon.com/1908287720-chronicles-of-the-martial-gods-return-chapter-88/",
        },
      },
      title: "chronicles-of-the-martial-god’s-return",
    },
    {
      best_score: 100,
      chapter: "119",
      closest_title: "reborn-as-the-heavenly-demon",
      current_source: "any",
      domain: "",
      latest: "119",
      link: "https://asuracomic.net/series/reborn-as-the-heavenly-demon-1ce6f320/chapter/97",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "119",
          latest: "119",
          latest_link:
            "https://manhuafast.net/manga/reincarnation-of-the-heavenly-demon/chapter-119/",
          old_chapters: {
            "118": {
              latest_link:
                "https://manhuafast.net/manga/reincarnation-of-the-heavenly-demon/chapter-118/",
              scansite: "manhuafast",
            },
            "119": {
              latest_link:
                "https://manhuafast.net/manga/reincarnation-of-the-heavenly-demon/chapter-119/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777858238.1461706,
          url: "https://asurascans.com/comics/reborn-as-the-heavenly-demon-b6e039fe/chapter/119",
        },
        asurascans: {
          chapter: "97",
          latest: "119",
          latest_link:
            "https://asurascans.com/comics/reborn-as-the-heavenly-demon-b6e039fe/chapter/119",
          old_chapters: {
            "117": {
              latest_link:
                "https://asurascans.com/comics/reborn-as-the-heavenly-demon-b6e039fe/chapter/117",
              scansite: "asurascans",
            },
            "118": {
              latest_link:
                "https://asurascans.com/comics/reborn-as-the-heavenly-demon-b6e039fe/chapter/118",
              scansite: "asurascans",
            },
            "119": {
              latest_link:
                "https://asurascans.com/comics/reborn-as-the-heavenly-demon-b6e039fe/chapter/119",
              scansite: "asurascans",
            },
          },
          time_updated: 1777885549.600388,
          url: "https://asuracomic.net/series/reborn-as-the-heavenly-demon-1ce6f320/chapter/97",
        },
        manhuafast: {
          latest: "119",
          latest_link:
            "https://manhuafast.net/manga/reincarnation-of-the-heavenly-demon/chapter-119/",
          old_chapters: {
            "118": {
              latest_link:
                "https://manhuafast.net/manga/reincarnation-of-the-heavenly-demon/chapter-118/",
              scansite: "manhuafast",
            },
            "119": {
              latest_link:
                "https://manhuafast.net/manga/reincarnation-of-the-heavenly-demon/chapter-119/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1777858238.1461706,
        },
        rizzfables: {
          latest: "82",
          latest_link:
            "https://rizzfables.com/chapter/r2311170-reborn-as-the-heavenly-demon-chapter-82",
          old_chapters: {
            "78": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-reborn-as-the-heavenly-demon-chapter-78",
              scansite: "rizzfables",
            },
            "79": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-reborn-as-the-heavenly-demon-chapter-79",
              scansite: "rizzfables",
            },
            "80": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-reborn-as-the-heavenly-demon-chapter-80",
              scansite: "rizzfables",
            },
            "81": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-reborn-as-the-heavenly-demon-chapter-81",
              scansite: "rizzfables",
            },
            "82": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-reborn-as-the-heavenly-demon-chapter-82",
              scansite: "rizzfables",
            },
          },
          time_updated: 1754978797,
        },
      },
      title: "reborn-as-the-heavenly-demon",
    },
    {
      best_score: 100,
      chapter: "1181",
      closest_title: "one-piece",
      current_source: "any",
      domain: "",
      latest: "1181",
      link: "https://onepiecechapters.com/chapters/7364/one-piece-chapter-1083?&date=10-5-2023-13",
      read: true,
      scansite: "tcbscans",
      sources: {
        any: {
          chapter: "1181",
          latest: "1181",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7978/one-piece-chapter-1181",
          old_chapters: {},
          time_updated: 1776970800,
          url: "https://tcbonepiecechapters.com/chapters/7978/one-piece-chapter-1181",
        },
        mangaplus: {
          latest: "1179",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028757",
          old_chapters: {},
          time_updated: 1775401203,
        },
        tcbscans: {
          latest: "1181",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7978/one-piece-chapter-1181",
          old_chapters: {},
          time_updated: 1776970800,
        },
      },
      title: "one-piece",
    },
    {
      best_score: 100,
      chapter: "267",
      closest_title: "the-tutorial-is-too-hard",
      current_source: "any",
      domain: "",
      latest: "267",
      link: "https://asuracomic.net/series/the-tutorial-is-too-hard-ade7a4ed/chapter/201",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "267",
          latest: "267",
          latest_link:
            "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/267",
          old_chapters: {
            "265": {
              latest_link:
                "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/265",
              scansite: "asurascans",
            },
            "266": {
              latest_link:
                "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/266",
              scansite: "asurascans",
            },
            "267": {
              latest_link:
                "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/267",
              scansite: "asurascans",
            },
          },
          time_updated: 1777713275.281242,
          url: "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/267",
        },
        asurascans: {
          latest: "267",
          latest_link:
            "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/267",
          old_chapters: {
            "265": {
              latest_link:
                "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/265",
              scansite: "asurascans",
            },
            "266": {
              latest_link:
                "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/266",
              scansite: "asurascans",
            },
            "267": {
              latest_link:
                "https://asurascans.com/comics/the-tutorial-is-too-hard-0984835a/chapter/267",
              scansite: "asurascans",
            },
          },
          time_updated: 1777713275.281242,
          url: "https://asuracomic.net/series/the-tutorial-is-too-hard-ade7a4ed/chapter/201",
        },
      },
      title: "the-tutorial-is-too-hard",
    },
    {
      best_score: 100,
      chapter: "198",
      closest_title: "the-heavenly-demon-cant-live-a-normal-life",
      current_source: "any",
      domain: "",
      latest: "198",
      link: "https://asuratoon.com/4622438374-the-heavenly-demon-cant-live-a-normal-life-chapter-105/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "198",
          latest: "198",
          latest_link:
            "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/198",
          old_chapters: {
            "196": {
              latest_link:
                "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/196",
              scansite: "asurascans",
            },
            "197": {
              latest_link:
                "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/197",
              scansite: "asurascans",
            },
            "198": {
              latest_link:
                "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/198",
              scansite: "asurascans",
            },
          },
          time_updated: 1777713275.281242,
          url: "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/198",
        },
        asurascans: {
          latest: "198",
          latest_link:
            "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/198",
          old_chapters: {
            "196": {
              latest_link:
                "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/196",
              scansite: "asurascans",
            },
            "197": {
              latest_link:
                "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/197",
              scansite: "asurascans",
            },
            "198": {
              latest_link:
                "https://asurascans.com/comics/the-heavenly-demon-cant-live-a-normal-life-0984835a/chapter/198",
              scansite: "asurascans",
            },
          },
          time_updated: 1777713275.281242,
          url: "https://asuratoon.com/4622438374-the-heavenly-demon-cant-live-a-normal-life-chapter-105/",
        },
      },
      title: "the-heavenly-demon-can't-live-a-normal-life",
    },
    {
      best_score: 100,
      chapter: "441",
      closest_title: "mairimashita!-iruma-kun",
      current_source: "any",
      domain: "reddit.com",
      latest: "441",
      read: true,
      scansite: "reddit",
      sources: {
        any: {
          chapter: "441",
          latest: "441",
          latest_link:
            "https://mangadex.org/chapter/8cd128d4-b288-4ecb-9f13-b9de163b9a3d",
          old_chapters: {},
          time_updated: 1776894976,
          url: "https://mangadex.org/chapter/8cd128d4-b288-4ecb-9f13-b9de163b9a3d",
        },
        cubari: {
          latest: "430",
          latest_link: "https://cubari.moe/read/catbox/yh9ehe/1/1/",
          old_chapters: {},
          time_updated: 1770261998,
        },
        mangadex: {
          latest: "441",
          latest_link:
            "https://mangadex.org/chapter/8cd128d4-b288-4ecb-9f13-b9de163b9a3d",
          old_chapters: {},
          time_updated: 1776894976,
        },
        reddit: {
          latest: "438",
          latest_link: "https://cubari.moe/read/catbox/apx1mk/1/1/",
          old_chapters: {},
          time_updated: 1775076601,
        },
      },
      title: "mairimashita!-iruma-kun",
    },
    {
      best_score: 100,
      chapter: "229",
      closest_title: "one-punch-man",
      current_source: "any",
      domain: "https://cubari.moe/",
      latest: "229",
      link: "https://cubari.moe/read/gist/OPM/167-5/1/",
      read: true,
      scansite: "cubari",
      sources: {
        any: {
          chapter: "229",
          latest: "229",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L0tva2lLb2kvS29pUG9uZE1hbmdhL3JlZnMvaGVhZHMvbWFpbi9PbmVQdW5jaE1hbi1NYW5nYS5qc29u/229/1/",
          old_chapters: {},
          time_updated: 1776876599,
          url: "https://cubari.moe/read/gist/cmF3L0tva2lLb2kvS29pUG9uZE1hbmdhL3JlZnMvaGVhZHMvbWFpbi9PbmVQdW5jaE1hbi1NYW5nYS5qc29u/229/1/",
        },
        cubari: {
          latest: "229",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L0tva2lLb2kvS29pUG9uZE1hbmdhL3JlZnMvaGVhZHMvbWFpbi9PbmVQdW5jaE1hbi1NYW5nYS5qc29u/229/1/",
          old_chapters: {},
          time_updated: 1776876599,
          url: "https://cubari.moe/read/gist/OPM/167-5/1/",
        },
        weebdex: {
          latest: "188.5",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L0tva2lLb2kvS29pUG9uZE1hbmdhL3JlZnMvaGVhZHMvbWFpbi9PbmVQdW5jaE1hbi1NYW5nYS5qc29u/188-5/1/",
          old_chapters: {},
          time_updated: 1775352096,
        },
      },
      title: "one-punch-man",
    },
    {
      best_score: 100,
      chapter: "133.5",
      closest_title: "the-dark-massacre-of-the-vengeful-hero",
      current_source: "any",
      domain: "mangadex.org",
      latest: "125.6",
      link: "https://reader.kireicake.com/read/the_dark_massacre_of_the_vengeful_hero/en/0/55/",
      read: false,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "133.5",
          latest: "125.6",
          latest_link:
            "https://mangadex.org/chapter/3067a77b-0baa-4ea8-a11c-434a35dd5763",
          old_chapters: {},
          time_updated: 1776771521,
          url: "https://mangadex.org/chapter/1d4db287-a325-45f6-81bb-fc469a3601cd",
        },
        mangadex: {
          latest: "125.6",
          latest_link:
            "https://mangadex.org/chapter/3067a77b-0baa-4ea8-a11c-434a35dd5763",
          old_chapters: {},
          time_updated: 1776771521,
        },
      },
      title: "the-dark-massacre-of-the-vengeful-hero",
    },
    {
      best_score: 100,
      chapter: "135",
      closest_title: "reaper-of-the-drifting-moon",
      current_source: "any",
      domain: "",
      latest: "135",
      link: "https://asuratoon.com/1908287720-reaper-of-the-drifting-moon-chapter-91/#/next/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "135",
          latest: "135",
          latest_link:
            "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/135",
          old_chapters: {
            "133": {
              latest_link:
                "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/133",
              scansite: "asurascans",
            },
            "134": {
              latest_link:
                "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/134",
              scansite: "asurascans",
            },
            "135": {
              latest_link:
                "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/135",
              scansite: "asurascans",
            },
          },
          time_updated: 1776673926.0922627,
          url: "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/135",
        },
        asurascans: {
          latest: "135",
          latest_link:
            "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/135",
          old_chapters: {
            "133": {
              latest_link:
                "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/133",
              scansite: "asurascans",
            },
            "134": {
              latest_link:
                "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/134",
              scansite: "asurascans",
            },
            "135": {
              latest_link:
                "https://asurascans.com/comics/reaper-of-the-drifting-moon-963c76c5/chapter/135",
              scansite: "asurascans",
            },
          },
          time_updated: 1776673926.0922627,
          url: "https://asuratoon.com/1908287720-reaper-of-the-drifting-moon-chapter-91/#/next/",
        },
      },
      title: "reaper-of-the-drifting-moon",
    },
    {
      best_score: 100,
      chapter: "160",
      closest_title: "the-knight-king-who-returned-with-a-god",
      current_source: "asurascans",
      domain: "",
      latest: "160",
      link: "https://asuracomic.net/series/the-knight-king-who-returned-with-a-god-0facd5d3/chapter/154",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "154",
          latest: "160",
          latest_link:
            "https://manhuafast.net/manga/the-knight-king-who-returned-with-a-god/chapter-160/",
          old_chapters: {
            "159": {
              latest_link:
                "https://manhuafast.net/manga/the-knight-king-who-returned-with-a-god/chapter-159/",
              scansite: "manhuafast",
            },
            "160": {
              latest_link:
                "https://manhuafast.net/manga/the-knight-king-who-returned-with-a-god/chapter-160/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1776605430.3221364,
          url: "https://asuracomic.net/series/the-knight-king-who-returned-with-a-god-0facd5d3/chapter/154",
        },
        asurascans: {
          chapter: "160",
          latest: "160",
          latest_link:
            "https://asurascans.com/comics/the-knight-king-who-returned-with-a-god-963c76c5/chapter/160",
          old_chapters: {
            "158": {
              latest_link:
                "https://asurascans.com/comics/the-knight-king-who-returned-with-a-god-963c76c5/chapter/158",
              scansite: "asurascans",
            },
            "159": {
              latest_link:
                "https://asurascans.com/comics/the-knight-king-who-returned-with-a-god-963c76c5/chapter/159",
              scansite: "asurascans",
            },
            "160": {
              latest_link:
                "https://asurascans.com/comics/the-knight-king-who-returned-with-a-god-963c76c5/chapter/160",
              scansite: "asurascans",
            },
          },
          time_updated: 1776673926.0922627,
          url: "https://asurascans.com/comics/the-knight-king-who-returned-with-a-god-5abb513e/chapter/160",
        },
        manhuafast: {
          latest: "160",
          latest_link:
            "https://manhuafast.net/manga/the-knight-king-who-returned-with-a-god/chapter-160/",
          old_chapters: {
            "159": {
              latest_link:
                "https://manhuafast.net/manga/the-knight-king-who-returned-with-a-god/chapter-159/",
              scansite: "manhuafast",
            },
            "160": {
              latest_link:
                "https://manhuafast.net/manga/the-knight-king-who-returned-with-a-god/chapter-160/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1776605430.3221364,
        },
      },
      title: "the-knight-king-who-returned-with-a-god",
    },
    {
      best_score: 100,
      chapter: "70.5",
      closest_title: "mieruko-chan",
      current_source: "any",
      domain: "",
      latest: "70.5",
      link: "https://mangadex.org/chapter/d27c3866-8daa-4117-a86b-1c8982f00c5a",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "70.5",
          latest: "70.5",
          latest_link: "https://www.reddit.com/gallery/1shsp3g",
          old_chapters: {},
          time_updated: 1775841007,
          url: "https://www.reddit.com/gallery/1shsp3g",
        },
        disc: {
          latest: "69",
          latest_link: "https://imgur.com/gallery/ghost-manga-pacHN9O",
          old_chapters: {},
          time_updated: 1772262438,
        },
        mangadex: {
          latest: "70.2",
          latest_link:
            "https://mangadex.org/chapter/3cdbfd5e-a083-41a1-bb78-43d89675caf5",
          old_chapters: {},
          time_updated: 1775344462,
          url: "https://mangadex.org/chapter/d27c3866-8daa-4117-a86b-1c8982f00c5a",
        },
        reddit: {
          latest: "70.5",
          latest_link: "https://www.reddit.com/gallery/1shsp3g",
          old_chapters: {},
          time_updated: 1775841007,
        },
      },
      title: "mieruko-chan",
    },
    {
      best_score: 100,
      chapter: "159",
      closest_title: "one-punch-man-webcomic",
      current_source: "any",
      domain: "galaxyheavyblow.web.fc2.com",
      latest: "159",
      read: true,
      scansite: "galaxyheavyblow",
      sources: {
        any: {
          chapter: "159",
          latest: "159",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L0tva2lLb2kvS29pUG9uZE1hbmdhL3JlZnMvaGVhZHMvbWFpbi9PbmVQdW5jaE1hbi1XZWJDb21pYy5qc29u/159/1/",
          old_chapters: {},
          time_updated: 1775437496,
          url: "https://cubari.moe/read/gist/cmF3L0tva2lLb2kvS29pUG9uZE1hbmdhL3JlZnMvaGVhZHMvbWFpbi9PbmVQdW5jaE1hbi1XZWJDb21pYy5qc29u/159/1/",
        },
        mangadex: {
          latest: "159",
          latest_link:
            "https://mangadex.org/chapter/91f8712f-4249-4850-ab63-375da492b6d7",
          old_chapters: {},
          time_updated: 1776026934,
        },
        weebdex: {
          latest: "159",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L0tva2lLb2kvS29pUG9uZE1hbmdhL3JlZnMvaGVhZHMvbWFpbi9PbmVQdW5jaE1hbi1XZWJDb21pYy5qc29u/159/1/",
          old_chapters: {},
          time_updated: 1775437496,
        },
      },
      title: "--one-punch-man-webcomic",
    },
    {
      chapter: "80",
      current_source: "any",
      domain: "",
      latest: "80",
      link: "https://mangadex.org/chapter/1977ec96-5332-4319-9405-c12075886c1d",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "80",
          latest: "80",
          latest_link:
            "https://mangadex.org/chapter/7c003170-9273-4b27-8b9d-fd62f70dcadf",
          old_chapters: {},
          time_updated: 1775041027,
          url: "https://mangadex.org/chapter/7c003170-9273-4b27-8b9d-fd62f70dcadf",
        },
        mangadex: {
          latest: "80",
          latest_link:
            "https://mangadex.org/chapter/7c003170-9273-4b27-8b9d-fd62f70dcadf",
          old_chapters: {},
          time_updated: 1775041027,
          url: "https://mangadex.org/chapter/1977ec96-5332-4319-9405-c12075886c1d",
        },
        reddit: {
          latest: "79.2",
          latest_link: "https://www.reddit.com/gallery/1s4zd6y",
          old_chapters: {},
          time_updated: 1774604069,
        },
      },
      title: "kage-no-jitsuryokusha-ni-naritakute",
    },
    {
      best_score: 100,
      chapter: "232",
      closest_title: "chainsaw-man",
      current_source: "any",
      domain: "",
      latest: "232",
      link: "https://mangaplus.shueisha.co.jp/viewer/1016602",
      read: true,
      scansite: "mangaplus",
      sources: {
        any: {
          chapter: "232",
          latest: "232",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028085",
          old_chapters: {},
          time_updated: 1774364405,
          url: "https://mangaplus.shueisha.co.jp/viewer/1028085",
        },
        mangaplus: {
          latest: "232",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1028085",
          old_chapters: {},
          time_updated: 1774364405,
          url: "https://mangaplus.shueisha.co.jp/viewer/1016602",
        },
        tcbscans: {
          latest: "179",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7810/chainsaw-man-chapter-179",
          old_chapters: {},
          time_updated: 1727872550,
          url: "https://onepiecechapters.com/chapters/7363/chainsaw-man-chapter-129?&date=10-5-2023-0",
        },
      },
      title: "chainsaw-man",
    },
    {
      chapter: "92",
      current_source: "any",
      domain: "",
      latest: "92",
      link: "https://mangadex.org/chapter/8feeb876-bfd5-4cf9-9046-013d7b57b91a/1",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "92",
          latest: "92",
          latest_link: "https://cubari.moe/read/imgchest/ljyq6wqgx42/1/1/",
          old_chapters: {},
          time_updated: 1774309949,
          url: "https://cubari.moe/read/imgchest/ljyq6wqgx42/1/1/",
        },
        asurascans: {
          latest: "55",
          latest_link: "https://asurascans.com/ragna-crimson-chapter-55/",
          old_chapters: {},
          time_updated: 1655832686,
        },
        cubari: {
          latest: "92",
          latest_link: "https://cubari.moe/read/imgchest/ljyq6wqgx42/1/1/",
          old_chapters: {},
          time_updated: 1774309949,
        },
        mangadex: {
          latest: "83",
          latest_link:
            "https://mangadex.org/chapter/37957f69-eea2-4ee9-b061-cc9a0894eaf1",
          old_chapters: {},
          time_updated: 1745379903,
          url: "https://mangadex.org/chapter/8feeb876-bfd5-4cf9-9046-013d7b57b91a/1",
        },
      },
      title: "ragna-crimson",
    },
    {
      best_score: 100,
      chapter: "223",
      closest_title: "the-greatest-estate-developer",
      current_source: "asurascans",
      domain: "",
      latest: "224",
      link: "https://asuracomic.net/series/the-greatest-estate-developer-cb91f76a/chapter/203",
      read: false,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "209",
          latest: "224",
          latest_link:
            "https://www.webtoons.com/en/fantasy/the-greatest-estate-developer/episode-222-spin-off-8-2-series-finale/viewer?title_no=3596&episode_no=224",
          old_chapters: {},
          time_updated: 1775709659,
          url: "https://asuracomic.net/series/the-greatest-estate-developer-10375520/chapter/209",
        },
        asurascans: {
          chapter: "223",
          latest: "223",
          latest_link:
            "https://asuracomic.net/series/the-greatest-estate-developer-479c9a91/chapter/223",
          old_chapters: {
            "221": {
              latest_link:
                "https://asuracomic.net/series/the-greatest-estate-developer-479c9a91/chapter/221",
              scansite: "asurascans",
            },
            "222": {
              latest_link:
                "https://asuracomic.net/series/the-greatest-estate-developer-479c9a91/chapter/222",
              scansite: "asurascans",
            },
            "223": {
              latest_link:
                "https://asuracomic.net/series/the-greatest-estate-developer-479c9a91/chapter/223",
              scansite: "asurascans",
            },
          },
          time_updated: 1773882017.0962925,
          url: "https://asuracomic.net/series/the-greatest-estate-developer-479c9a91/chapter/223",
        },
        webtoons: {
          latest: "224",
          latest_link:
            "https://www.webtoons.com/en/fantasy/the-greatest-estate-developer/episode-222-spin-off-8-2-series-finale/viewer?title_no=3596&episode_no=224",
          old_chapters: {},
          time_updated: 1775709659,
        },
      },
      title: "the-greatest-estate-developer",
    },
    {
      chapter: "109",
      current_source: "any",
      domain: "",
      latest: "109",
      link: "https://asuracomic.net/series/myst-might-mayhem-9dbef7bc/chapter/66",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "109",
          latest: "109",
          latest_link:
            "https://manhuafast.net/manga/myst-might-mayhem/chapter-109/",
          old_chapters: {
            "108": {
              latest_link:
                "https://manhuafast.net/manga/myst-might-mayhem/chapter-108/",
              scansite: "manhuafast",
            },
            "109": {
              latest_link:
                "https://manhuafast.net/manga/myst-might-mayhem/chapter-109/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1773185450.0415146,
          url: "https://manhuafast.net/manga/myst-might-mayhem/chapter-109/",
        },
        asurascans: {
          latest: "109",
          latest_link:
            "https://asuracomic.net/series/myst-might-mayhem-eb8285bd/chapter/109",
          old_chapters: {
            "107": {
              latest_link:
                "https://asuracomic.net/series/myst-might-mayhem-eb8285bd/chapter/107",
              scansite: "asurascans",
            },
            "108": {
              latest_link:
                "https://asuracomic.net/series/myst-might-mayhem-eb8285bd/chapter/108",
              scansite: "asurascans",
            },
            "109": {
              latest_link:
                "https://asuracomic.net/series/myst-might-mayhem-eb8285bd/chapter/109",
              scansite: "asurascans",
            },
          },
          time_updated: 1773224384.2275522,
          url: "https://asuracomic.net/series/myst-might-mayhem-9dbef7bc/chapter/66",
        },
        danke: {
          latest: "62",
          latest_link:
            "https://danke.moe/read/manga/the-tsuntsuntsuntsuntsuntsuntsuntsuntsuntsuntsundere-girl",
          old_chapters: {},
          time_updated: 1667319484,
        },
        flixscans: {
          latest: "23",
          latest_link:
            "https://flixscans.org/read/webtoon/87320-4064-chapter-23",
          old_chapters: {
            "23": {
              latest_link:
                "https://flixscans.org/read/webtoon/87320-4064-chapter-23",
              scansite: "flixscans",
            },
          },
          time_updated: 1717606838.5933774,
        },
        manhuafast: {
          latest: "109",
          latest_link:
            "https://manhuafast.net/manga/myst-might-mayhem/chapter-109/",
          old_chapters: {
            "108": {
              latest_link:
                "https://manhuafast.net/manga/myst-might-mayhem/chapter-108/",
              scansite: "manhuafast",
            },
            "109": {
              latest_link:
                "https://manhuafast.net/manga/myst-might-mayhem/chapter-109/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1773185450.0415146,
        },
      },
      title: "myst,-might,-mayhem",
    },
    {
      chapter: "192",
      current_source: "any",
      domain: "",
      latest: "192",
      link: "https://asuracomic.net/series/the-return-of-the-crazy-demon-8e0fbccb/chapter/170",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "192",
          latest: "192",
          latest_link:
            "https://asuracomic.net/series/the-return-of-the-crazy-demon-7df05b65/chapter/192.5",
          old_chapters: {
            "191": {
              latest_link:
                "https://asuracomic.net/series/the-return-of-the-crazy-demon-7df05b65/chapter/191",
              scansite: "asurascans",
            },
            "192": {
              latest_link:
                "https://asuracomic.net/series/the-return-of-the-crazy-demon-7df05b65/chapter/192.5",
              scansite: "asurascans",
            },
          },
          time_updated: 1772448540.9871957,
          url: "https://asuracomic.net/series/the-return-of-the-crazy-demon-1723052c/chapter/192",
        },
        asuracomic: {
          latest: "125",
          latest_link:
            "https://asuracomic.netthe-return-of-the-crazy-demon-chapter-125/",
          old_chapters: {},
          time_updated: 1730582490,
        },
        asuracomics: {
          latest: "107",
          latest_link:
            "https://asuracomics.com/the-return-of-the-crazy-demon-chapter-107/",
          old_chapters: {},
          time_updated: 1707179373,
        },
        asurascans: {
          chapter: "170",
          latest: "192",
          latest_link:
            "https://asuracomic.net/series/the-return-of-the-crazy-demon-7df05b65/chapter/192.5",
          old_chapters: {
            "191": {
              latest_link:
                "https://asuracomic.net/series/the-return-of-the-crazy-demon-7df05b65/chapter/191",
              scansite: "asurascans",
            },
            "192": {
              latest_link:
                "https://asuracomic.net/series/the-return-of-the-crazy-demon-7df05b65/chapter/192.5",
              scansite: "asurascans",
            },
          },
          time_updated: 1772448540.9871957,
          url: "https://asuracomic.net/series/the-return-of-the-crazy-demon-8e0fbccb/chapter/170",
        },
        cubari: {
          latest: "63",
          latest_link: "https://cubari.moe/read/imgur/H1wQ5vz/1/1/",
          old_chapters: {},
          time_updated: 1667054093,
          url: "https://cubari.moe/read/imgur/H1wQ5vz/1/1/",
        },
      },
      title: "the-return-of-the-crazy-demon",
    },
    {
      chapter: "250",
      current_source: "any",
      domain: "",
      latest: "250",
      link: "https://asuracomic.net/series/murim-login-ed19e4a5/chapter/188",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "250",
          latest: "250",
          latest_link:
            "https://asuracomic.net/series/murim-login-a8085b10/chapter/250",
          old_chapters: {
            "248": {
              latest_link:
                "https://asuracomic.net/series/murim-login-a8085b10/chapter/248",
              scansite: "asurascans",
            },
            "249": {
              latest_link:
                "https://asuracomic.net/series/murim-login-a8085b10/chapter/249",
              scansite: "asurascans",
            },
            "250": {
              latest_link:
                "https://asuracomic.net/series/murim-login-a8085b10/chapter/250",
              scansite: "asurascans",
            },
          },
          time_updated: 1770718860.6212254,
          url: "https://asuracomic.net/series/murim-login-ee9fdad9/chapter/250",
        },
        asura: {
          latest: "136",
          latest_link: "https://asura.gg/murim-login-chapter-136/",
          old_chapters: {},
          time_updated: 1671741606,
        },
        asuracomic: {
          latest: "203",
          latest_link: "https://asuracomic.netmurim-login-chapter-203/",
          old_chapters: {},
          time_updated: 1731721787,
        },
        asuracomics: {
          latest: "186",
          latest_link: "https://cubari.moe/read/imgur/aWm4OaL/1/1/",
          old_chapters: {},
          time_updated: 1722036151,
        },
        asurascans: {
          chapter: "249",
          latest: "250",
          latest_link:
            "https://asuracomic.net/series/murim-login-a8085b10/chapter/250",
          old_chapters: {
            "248": {
              latest_link:
                "https://asuracomic.net/series/murim-login-a8085b10/chapter/248",
              scansite: "asurascans",
            },
            "249": {
              latest_link:
                "https://asuracomic.net/series/murim-login-a8085b10/chapter/249",
              scansite: "asurascans",
            },
            "250": {
              latest_link:
                "https://asuracomic.net/series/murim-login-a8085b10/chapter/250",
              scansite: "asurascans",
            },
          },
          time_updated: 1770718860.6212254,
          url: "https://asuracomic.net/series/murim-login-93cc3248/chapter/249",
        },
        demoncomics: {
          latest: "185",
          latest_link:
            "https://demoncomics.org/manga/Murim-Login/chapter/185.1-VA48",
          old_chapters: {},
          time_updated: 1706905371,
        },
        mangadex: {
          latest: "201",
          latest_link:
            "https://mangadex.org/chapter/fecb72ef-24d0-4509-8931-cf07fda438ff",
          old_chapters: {},
          time_updated: 1730503221,
        },
        s2startasurascans: {
          latest: "118",
          latest_link: "https://asurascans.com/murim-login-chapter-118/",
          old_chapters: {},
          time_updated: 1660353092,
        },
      },
      title: "murim-login",
    },
    {
      best_score: 100,
      chapter: "392",
      closest_title: "black-clover",
      current_source: "any",
      domain: "https://onepiecechapters.com/",
      latest: "392",
      link: "https://mangaplus.shueisha.co.jp/viewer/1027801",
      read: true,
      scansite: "mangaplus",
      sources: {
        any: {
          chapter: "392",
          latest: "392",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1027803",
          old_chapters: {},
          time_updated: 1777561344,
          url: "https://mangaplus.shueisha.co.jp/viewer/1027801",
        },
        mangaplus: {
          chapter: "390",
          latest: "392",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1027803",
          old_chapters: {},
          time_updated: 1777561344,
          url: "https://mangaplus.shueisha.co.jp/viewer/1027801",
        },
        tcbscans: {
          latest: "376",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7830/black-clover-chapter-376",
          old_chapters: {},
          time_updated: 1731845491,
        },
      },
      title: "black-clover",
    },
    {
      chapter: "106",
      current_source: "any",
      domain: "",
      latest: "106",
      link: "https://asuracomic.net/series/worthless-regression-315ff184/chapter/99",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "106",
          latest: "106",
          latest_link:
            "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/106",
          old_chapters: {
            "104": {
              latest_link:
                "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/104",
              scansite: "asurascans",
            },
            "105": {
              latest_link:
                "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/105",
              scansite: "asurascans",
            },
            "106": {
              latest_link:
                "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/106",
              scansite: "asurascans",
            },
          },
          time_updated: 1764931566.465537,
          url: "https://asuracomic.net/series/worthless-regression-8b538120/chapter/106",
        },
        asura: {
          latest: "51",
          latest_link: "https://asura.gg/worthless-regression-chapter-51/",
          old_chapters: {},
          time_updated: 1671920792,
        },
        asurascans: {
          chapter: "99",
          latest: "106",
          latest_link:
            "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/106",
          old_chapters: {
            "104": {
              latest_link:
                "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/104",
              scansite: "asurascans",
            },
            "105": {
              latest_link:
                "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/105",
              scansite: "asurascans",
            },
            "106": {
              latest_link:
                "https://asuracomic.net/series/worthless-regression-f8651b14/chapter/106",
              scansite: "asurascans",
            },
          },
          time_updated: 1764931566.465537,
          url: "https://asuracomic.net/series/worthless-regression-315ff184/chapter/99",
        },
      },
      title: "worthless-regression",
    },
    {
      chapter: "172",
      current_source: "any",
      domain: "",
      latest: "172",
      link: "https://asuracomic.net/series/trash-of-the-counts-family-706eb3e9/chapter/137",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "172",
          latest: "172",
          latest_link:
            "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/172",
          old_chapters: {
            "170": {
              latest_link:
                "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/170",
              scansite: "asurascans",
            },
            "171": {
              latest_link:
                "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/171",
              scansite: "asurascans",
            },
            "172": {
              latest_link:
                "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/172",
              scansite: "asurascans",
            },
          },
          time_updated: 1763833166.0134726,
          url: "https://asuracomic.net/series/trash-of-the-counts-family-8697f369/chapter/172",
        },
        asurascans: {
          latest: "172",
          latest_link:
            "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/172",
          old_chapters: {
            "170": {
              latest_link:
                "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/170",
              scansite: "asurascans",
            },
            "171": {
              latest_link:
                "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/171",
              scansite: "asurascans",
            },
            "172": {
              latest_link:
                "https://asuracomic.net/series/trash-of-the-counts-family-3a9d676b/chapter/172",
              scansite: "asurascans",
            },
          },
          time_updated: 1763833166.0134726,
          url: "https://asuracomic.net/series/trash-of-the-counts-family-706eb3e9/chapter/137",
        },
        leviatanscans: {
          latest: "90",
          latest_link:
            "https://leviatanscans.com/hy/manga/trash-of-the-counts-family/chapter-90/",
          old_chapters: {},
          time_updated: 1658401562.0412645,
        },
      },
      title: "trash-of-the-count's-family",
    },
    {
      chapter: "145",
      current_source: "any",
      domain: "",
      latest: "145",
      link: "https://asuracomic.net/series/star-instructor-master-baek-9b0ce5c9/chapter/135",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "145",
          latest: "145",
          latest_link:
            "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/145",
          old_chapters: {
            "143": {
              latest_link:
                "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/143",
              scansite: "asurascans",
            },
            "144": {
              latest_link:
                "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/144",
              scansite: "asurascans",
            },
            "145": {
              latest_link:
                "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/145",
              scansite: "asurascans",
            },
          },
          time_updated: 1763632690.0453236,
          url: "https://asuracomic.net/series/star-instructor-master-baek-a9a6acc5/chapter/145",
        },
        asurascans: {
          latest: "145",
          latest_link:
            "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/145",
          old_chapters: {
            "143": {
              latest_link:
                "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/143",
              scansite: "asurascans",
            },
            "144": {
              latest_link:
                "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/144",
              scansite: "asurascans",
            },
            "145": {
              latest_link:
                "https://asuracomic.net/series/star-instructor-master-baek-92690efd/chapter/145",
              scansite: "asurascans",
            },
          },
          time_updated: 1763632690.0453236,
          url: "https://asuracomic.net/series/star-instructor-master-baek-9b0ce5c9/chapter/135",
        },
      },
      title: "star-instructor-master-baek",
    },
    {
      chapter: "43",
      current_source: "any",
      domain: "",
      latest: "40",
      link: "https://mangadex.org/chapter/2995cf26-0e5b-42f3-a3d6-54b0faf71903/1",
      read: false,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "43",
          latest: "43",
          latest_link:
            "https://mangadex.org/chapter/2995cf26-0e5b-42f3-a3d6-54b0faf71903/1",
          old_chapters: {},
          time_updated: 1761865913.574884,
          url: "https://mangadex.org/chapter/2995cf26-0e5b-42f3-a3d6-54b0faf71903/1",
        },
        mangadex: {
          chapter: "43",
          latest: "43",
          latest_link:
            "https://mangadex.org/chapter/2995cf26-0e5b-42f3-a3d6-54b0faf71903/1",
          old_chapters: {},
          time_updated: 1761865913.574884,
          url: "https://mangadex.org/chapter/2995cf26-0e5b-42f3-a3d6-54b0faf71903/1",
        },
      },
      title: "kaiten-no-albus",
    },
    {
      chapter: "25",
      current_source: "asurascans",
      domain: "",
      latest: "348",
      link: "https://asuracomic.net/series/a-regressors-tale-of-cultivation-5158c520/chapter/22",
      read: false,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "22",
          latest: "348",
          latest_link:
            "https://nitroscans.online/manga/immortal-swordsman-in-the-reverse-world/",
          old_chapters: {},
          time_updated: 1669215107,
          url: "https://asuracomic.net/series/a-regressors-tale-of-cultivation-5158c520/chapter/22",
        },
        asurascans: {
          chapter: "25",
          latest: "25",
          latest_link:
            "https://asuracomic.net/series/a-regressors-tale-of-cultivation-bdb3cd52/chapter/25",
          old_chapters: {
            "23": {
              latest_link:
                "https://asuracomic.net/series/a-regressors-tale-of-cultivation-bdb3cd52/chapter/23",
              scansite: "asurascans",
            },
            "24": {
              latest_link:
                "https://asuracomic.net/series/a-regressors-tale-of-cultivation-bdb3cd52/chapter/24",
              scansite: "asurascans",
            },
            "25": {
              latest_link:
                "https://asuracomic.net/series/a-regressors-tale-of-cultivation-bdb3cd52/chapter/25",
              scansite: "asurascans",
            },
          },
          time_updated: 1761347573.3648715,
          url: "https://asuracomic.net/series/a-regressors-tale-of-cultivation-2965b6fb/chapter/25",
        },
        manhuafast: {
          latest: "19",
          latest_link:
            "https://manhuafast.net/manga/a-regressors-tale-of-cultivation/chapter-19/",
          old_chapters: {
            "18": {
              latest_link:
                "https://manhuafast.net/manga/a-regressors-tale-of-cultivation/chapter-18/",
              scansite: "manhuafast",
            },
            "19": {
              latest_link:
                "https://manhuafast.net/manga/a-regressors-tale-of-cultivation/chapter-19/",
              scansite: "manhuafast",
            },
          },
          time_updated: 1757642425.7950306,
        },
        nitroscans: {
          latest: "348",
          latest_link:
            "https://nitroscans.online/manga/immortal-swordsman-in-the-reverse-world/",
          old_chapters: {},
          time_updated: 1669215107,
        },
        rizzfables: {
          latest: "44",
          latest_link:
            "https://rizzfables.com/chapter/r2311170-snake-immortal-the-tale-of-a-snakes-cultivation-to-immortality-chapter-44",
          old_chapters: {
            "40": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-snake-immortal-the-tale-of-a-snakes-cultivation-to-immortality-chapter-40",
              scansite: "rizzfables",
            },
            "41": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-snake-immortal-the-tale-of-a-snakes-cultivation-to-immortality-chapter-41",
              scansite: "rizzfables",
            },
            "42": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-snake-immortal-the-tale-of-a-snakes-cultivation-to-immortality-chapter-42",
              scansite: "rizzfables",
            },
            "43": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-snake-immortal-the-tale-of-a-snakes-cultivation-to-immortality-chapter-43",
              scansite: "rizzfables",
            },
            "44": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-snake-immortal-the-tale-of-a-snakes-cultivation-to-immortality-chapter-44",
              scansite: "rizzfables",
            },
          },
          time_updated: 1749901126,
        },
      },
      title: "a-regressor's-tale-of-cultivation",
    },
    {
      chapter: "88",
      current_source: "mangadex",
      domain: "",
      latest: "110",
      link: "https://mangadex.org/chapter/0f07209c-afb3-4cf5-a029-7af76ef70d4b",
      read: false,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "99",
          latest: "110",
          latest_link:
            "https://mangadex.org/chapter/10b416e3-a60c-4ba7-aad3-db9a59621ae8",
          old_chapters: {},
          time_updated: 1761257154,
          url: "https://mangadex.org/chapter/0f07209c-afb3-4cf5-a029-7af76ef70d4b",
        },
        mangadex: {
          chapter: "99",
          latest: "110",
          latest_link:
            "https://mangadex.org/chapter/10b416e3-a60c-4ba7-aad3-db9a59621ae8",
          old_chapters: {},
          time_updated: 1761257154,
          url: "https://mangadex.org/chapter/0f07209c-afb3-4cf5-a029-7af76ef70d4b",
        },
      },
      title: "shuumatsu-no-valkyrie",
    },
    {
      chapter: "147",
      current_source: "any",
      domain: "mangadex.org",
      latest: "147",
      link: "https://reader.kireicake.com/read/frieren_at_the_funeral/en/0/94/",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "147",
          latest: "147",
          latest_link: "https://cubari.moe/read/imgchest/bp45m29nxy5/1/1/",
          old_chapters: {},
          time_updated: 1760479344,
          url: "https://cubari.moe/read/imgchest/bp45m29nxy5/1/1/",
        },
        imgur: {
          latest: "147",
          latest_link: "https://cubari.moe/read/imgchest/bp45m29nxy5/1/1/",
          old_chapters: {},
          time_updated: 1760479344,
        },
        kireicake: {
          latest: "103",
          latest_link:
            "https://reader.kireicake.com/read/frieren_at_the_funeral/en/0/103/",
          old_chapters: {},
          time_updated: 1666727042,
        },
        mangadex: {
          latest: "140",
          latest_link:
            "https://mangadex.org/chapter/d08901e2-9d12-4d0f-9b97-4820ed94da9f",
          old_chapters: {},
          time_updated: 1735082282,
        },
        po2scans: {
          latest: "108",
          latest_link: "https://po2scans.com/reader/64171ef14bd64",
          old_chapters: {},
          time_updated: 1679252627,
        },
        viz: {
          latest: "139",
          latest_link:
            "https://www.viz.com/vizmanga/frieren-the-journeys-end-chapter-139/chapter/44946?action=read",
          old_chapters: {},
          time_updated: 1733874637,
        },
      },
      title: "frieren-at-the-funeral",
    },
    {
      chapter: "79.1",
      current_source: "any",
      domain: "https://www.reddit.com",
      latest: "76.1",
      read: false,
      scansite: "reddit",
      sources: {
        any: {
          chapter: "79.1",
          latest: "76.1",
          latest_link: "https://cubari.moe/read/imgchest/m9yx9v6vqyq/1/1/",
          old_chapters: {},
          time_updated: 1759859680,
          url: "https://mangadex.org/chapter/60588930-7fda-4ad7-a2b4-01bf04f74c29",
        },
        mangadex: {
          latest: "69.5",
          latest_link:
            "https://mangadex.org/chapter/5dc377e6-f49e-4646-8100-80cfcdf47e05",
          old_chapters: {},
          time_updated: 1772902110,
        },
        reddit: {
          latest: "76.1",
          latest_link: "https://cubari.moe/read/imgchest/m9yx9v6vqyq/1/1/",
          old_chapters: {},
          time_updated: 1759859680,
        },
      },
      title: "the-eminence-in-shadow",
    },
    {
      chapter: "383",
      current_source: "any",
      domain: "",
      latest: "383",
      link: "https://cubari.moe/read/mangasee/Berserk/385/1/",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          latest: "383",
          latest_link:
            "https://mangadex.org/chapter/8ceadc31-e41e-4038-8aef-d002aab344a5",
          old_chapters: {},
          time_updated: 1757603755,
          url: "https://mangadex.org/chapter/8ceadc31-e41e-4038-8aef-d002aab344a5",
        },
        cubari: {
          latest: "371",
          latest_link: "https://cubari.moe/read/mangasee/Berserk/388/1/",
          old_chapters: {},
          time_updated: 1670449482,
        },
        mangadex: {
          latest: "383",
          latest_link:
            "https://mangadex.org/chapter/8ceadc31-e41e-4038-8aef-d002aab344a5",
          old_chapters: {},
          time_updated: 1757603755,
        },
      },
      title: "berserk",
    },
    {
      chapter: "151",
      current_source: "any",
      domain: "",
      latest: "151",
      link: "https://reaperscans.com/series/sss-class-suicide-hunter/chapter-120",
      read: true,
      scansite: "reaperscans",
      sources: {
        any: {
          latest: "151",
          latest_link:
            "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/151",
          old_chapters: {
            "149": {
              latest_link:
                "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/149",
              scansite: "asurascans",
            },
            "150": {
              latest_link:
                "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/150",
              scansite: "asurascans",
            },
            "151": {
              latest_link:
                "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/151",
              scansite: "asurascans",
            },
          },
          time_updated: 1757059966.1781347,
          url: "https://asuracomic.net/series/sss-class-suicide-hunter-e707e459/chapter/151",
        },
        asura: {
          latest: "57",
          latest_link: "https://asura.gg/sss-class-gacha-hunter-chapter-57/",
          old_chapters: {},
          time_updated: 1670720756,
        },
        asurascans: {
          latest: "151",
          latest_link:
            "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/151",
          old_chapters: {
            "149": {
              latest_link:
                "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/149",
              scansite: "asurascans",
            },
            "150": {
              latest_link:
                "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/150",
              scansite: "asurascans",
            },
            "151": {
              latest_link:
                "https://asuracomic.net/series/sss-class-suicide-hunter-16c531ee/chapter/151",
              scansite: "asurascans",
            },
          },
          time_updated: 1757059966.1781347,
          url: "https://asuracomic.net/series/sss-class-suicide-hunter-6f42d568/chapter/118",
        },
        cosmicscans: {
          latest: "76",
          latest_link:
            "https://cosmicscans.com/sss-class-gacha-hunter-chapter-76/",
          old_chapters: {},
          time_updated: 1686398417.8080728,
        },
        reaperscans: {
          latest: "134",
          latest_link:
            "https://reapercomics.com/series/sss-class-suicide-hunter/chapter-134/",
          old_chapters: {},
          time_updated: 1744918474,
          url: "https://reaperscans.com/series/sss-class-suicide-hunter/chapter-120",
        },
      },
      title: "sss-class-suicide-hunter",
    },
    {
      chapter: "195",
      current_source: "any",
      domain: "immortalupdates.com",
      latest: "202",
      link: "https://immortalupdates.com/manga/the-era-of-superhuman/chapter-127/",
      read: false,
      scansite: "immortalupdates",
      sources: {
        any: {
          latest: "202",
          latest_link:
            "https://hivetoons.org/series/superhuman-era/chapter-202",
          old_chapters: {},
          time_updated: 1757007023.8355267,
          url: "https://rizzfables.com/chapter/r2311170-the-superhuman-era-chapter-189",
        },
        hivescans: {
          latest: "202",
          latest_link:
            "https://hivetoons.org/series/superhuman-era/chapter-202",
          old_chapters: {},
          time_updated: 1757007023.8355267,
        },
        immortalupdates: {
          latest: "155",
          latest_link:
            "https://immortalupdates.com/manga/the-era-of-superhuman-manhwa/chapter-155/",
          old_chapters: {},
          time_updated: 1699799561,
        },
        rizzfables: {
          latest: "198",
          latest_link:
            "https://rizzfables.com/chapter/r2311170-the-superhuman-era-chapter-198",
          old_chapters: {
            "194": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-the-superhuman-era-chapter-194",
              scansite: "rizzfables",
            },
            "195": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-the-superhuman-era-chapter-195",
              scansite: "rizzfables",
            },
            "196": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-the-superhuman-era-chapter-196",
              scansite: "rizzfables",
            },
            "197": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-the-superhuman-era-chapter-197",
              scansite: "rizzfables",
            },
            "198": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-the-superhuman-era-chapter-198",
              scansite: "rizzfables",
            },
          },
          time_updated: 1754252398,
        },
      },
      title: "superhuman-era",
    },
    {
      chapter: "67",
      current_source: "any",
      domain: "",
      latest: "67",
      link: "https://mangaplus.shueisha.co.jp/viewer/1020746",
      read: true,
      scansite: "mangaplus",
      sources: {
        any: {
          latest: "67",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1026527",
          old_chapters: {},
          time_updated: 1756393204,
          url: "https://mangaplus.shueisha.co.jp/viewer/1026527",
        },
        mangaplus: {
          latest: "67",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1026527",
          old_chapters: {},
          time_updated: 1756393204,
          url: "https://mangaplus.shueisha.co.jp/viewer/1020746",
        },
      },
      title: "rugby-rumble",
    },
    {
      chapter: "220",
      current_source: "any",
      domain: "mangadex.org",
      latest: "220",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          latest: "220",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L3JpbGxhbnQvcHJvamVjdHZpbmxhbmQvbWFpbi9WaW5sYW5kJTIwU2FnYSUyMChQcm9qZWN0JTIwVmlubGFuZCkuanNvbg/220/2/",
          old_chapters: {},
          time_updated: 1753430003,
          url: "https://cubari.moe/read/gist/cmF3L3JpbGxhbnQvcHJvamVjdHZpbmxhbmQvbWFpbi9WaW5sYW5kJTIwU2FnYSUyMChQcm9qZWN0JTIwVmlubGFuZCkuanNvbg/220/2/",
        },
        mangadex: {
          latest: "220",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L3JpbGxhbnQvcHJvamVjdHZpbmxhbmQvbWFpbi9WaW5sYW5kJTIwU2FnYSUyMChQcm9qZWN0JTIwVmlubGFuZCkuanNvbg/220/2/",
          old_chapters: {},
          time_updated: 1753430003,
        },
      },
      title: "vinland-saga",
    },
    {
      chapter: "844",
      current_source: "any",
      domain: "mangadex.org",
      latest: "844",
      link: "https://mangadex.org/chapter/bfc97e78-11ee-4e18-bbd6-7b94fc3b9954",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "844",
          latest: "844",
          latest_link: "https://cubari.moe/read/imgchest/na7kvjel348/1/1/",
          old_chapters: {},
          time_updated: 1753316897,
          url: "https://cubari.moe/read/imgchest/na7kvjel348/1/1/",
        },
        cubari: {
          latest: "844",
          latest_link: "https://cubari.moe/read/imgchest/na7kvjel348/1/1/",
          old_chapters: {},
          time_updated: 1753316897,
        },
        leviatanscans: {
          latest: "67",
          latest_link:
            "https://leviatanscans.com/hy/manga/eternal-kingdom-2022/chapter-67/",
          old_chapters: {},
          time_updated: 1660988204.4435298,
        },
        mangadex: {
          latest: "831",
          latest_link: "https://cubari.moe/read/imgur/Ta4siQv/1/1/",
          old_chapters: {},
          time_updated: 1748389700,
          url: "https://mangadex.org/chapter/bfc97e78-11ee-4e18-bbd6-7b94fc3b9954",
        },
      },
      title: "kingdom",
    },
    {
      chapter: "410",
      current_source: "any",
      domain: "mangadex.org",
      latest: "410",
      link: "https://mangadex.org/chapter/d2a20653-74f8-4314-904e-7073394413a1",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          latest: "410",
          latest_link: "https://cubari.moe/read/imgur/r6eMHBH/1/1/",
          old_chapters: {},
          time_updated: 1750605829,
          url: "https://cubari.moe/read/imgur/r6eMHBH/1/1/",
        },
        mangadex: {
          latest: "410",
          latest_link: "https://cubari.moe/read/imgur/r6eMHBH/1/1/",
          old_chapters: {},
          time_updated: 1750605829,
          url: "https://mangadex.org/chapter/d2a20653-74f8-4314-904e-7073394413a1",
        },
      },
      title: "ao-ashi",
    },
    {
      chapter: "144",
      current_source: "any",
      domain: "",
      latest: "144",
      link: "https://asuracomic.net/series/overpowered-sword-6dd6cfde/chapter/131",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          latest: "144",
          latest_link:
            "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/144",
          old_chapters: {
            "142": {
              latest_link:
                "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/142",
              scansite: "asurascans",
            },
            "143": {
              latest_link:
                "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/143",
              scansite: "asurascans",
            },
            "144": {
              latest_link:
                "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/144",
              scansite: "asurascans",
            },
          },
          time_updated: 1746608395.5032387,
          url: "https://asuracomic.net/series/overpowered-sword-86c9e00c/chapter/144",
        },
        asurascans: {
          latest: "144",
          latest_link:
            "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/144",
          old_chapters: {
            "142": {
              latest_link:
                "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/142",
              scansite: "asurascans",
            },
            "143": {
              latest_link:
                "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/143",
              scansite: "asurascans",
            },
            "144": {
              latest_link:
                "https://asuracomic.net/series/overpowered-sword-96d6fb37/chapter/144",
              scansite: "asurascans",
            },
          },
          time_updated: 1746608395.5032387,
          url: "https://asuracomic.net/series/overpowered-sword-6dd6cfde/chapter/131",
        },
        cubari: {
          latest: "5",
          latest_link: "https://cubari.moe/read/imgur/jDWBpch/1/1/",
          old_chapters: {},
          time_updated: 1654382371,
        },
      },
      title: "overpowered-sword",
    },
    {
      chapter: "80",
      current_source: "any",
      domain: "",
      latest: "86",
      link: "https://mangadex.org/chapter/215c033c-8b65-4262-9689-3e981e7a8d36/1",
      read: false,
      scansite: "mangadex",
      sources: {
        any: {
          latest: "86",
          latest_link: "https://kmanga.kodansha.com/title/10065/episode/358733",
          old_chapters: {},
          time_updated: 1746030334,
          url: "https://mangadex.org/chapter/1cecd41e-bdc3-4fef-b64b-0542b9e52546/1",
        },
        cubari: {
          latest: "85",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L25laWxvd2VlZW4vUmljaGVoL3JlZnMvaGVhZHMvbWFpbi9XaXRjaC1IYXQtQXRlbGllci5qc29u/85/1/",
          old_chapters: {},
          time_updated: 1741202819,
        },
        kmanga: {
          latest: "86",
          latest_link: "https://kmanga.kodansha.com/title/10065/episode/358733",
          old_chapters: {},
          time_updated: 1746030334,
        },
        mangadex: {
          latest: "68",
          latest_link:
            "https://mangadex.org/chapter/215c033c-8b65-4262-9689-3e981e7a8d36",
          old_chapters: {},
          time_updated: 1683494779,
          url: "https://mangadex.org/chapter/215c033c-8b65-4262-9689-3e981e7a8d36/1",
        },
      },
      title: "witch-hat-atelier",
    },
    {
      chapter: "239.1",
      current_source: "any",
      domain: "mangaplus.shueisha.co.jp",
      latest: "239.1",
      link: "https://mangaplus.shueisha.co.jp/viewer/1022048",
      read: true,
      scansite: "mangaplus",
      sources: {
        any: {
          latest: "239.1",
          latest_link:
            "https://mangadex.org/chapter/44b2ca51-c81b-41fd-9630-29a9a45e9454",
          old_chapters: {},
          time_updated: 1743911513,
          url: "https://mangadex.org/chapter/44b2ca51-c81b-41fd-9630-29a9a45e9454",
        },
        mangadex: {
          latest: "239.1",
          latest_link:
            "https://mangadex.org/chapter/44b2ca51-c81b-41fd-9630-29a9a45e9454",
          old_chapters: {},
          time_updated: 1743911513,
        },
        mangaplus: {
          latest: "239",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1023309",
          old_chapters: {},
          time_updated: 1737903626,
          url: "https://mangaplus.shueisha.co.jp/viewer/1022048",
        },
      },
      title: "undead-unluck",
    },
    {
      chapter: "101",
      current_source: "any",
      domain: "",
      latest: "101",
      link: "https://www.asurascans.com/reincarnation-of-the-suicidal-battle-god-chapter-79/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          latest: "101",
          latest_link:
            "https://asuracomic.net/page/2//series/reincarnation-of-the-suicidal-battle-god-e48ddd0f/chapter/101.1",
          old_chapters: {
            "100": {
              latest_link:
                "https://asuracomic.net/page/2//series/reincarnation-of-the-suicidal-battle-god-e48ddd0f/chapter/100",
              scansite: "asurascans",
            },
            "101": {
              latest_link:
                "https://asuracomic.net/page/2//series/reincarnation-of-the-suicidal-battle-god-e48ddd0f/chapter/101.1",
              scansite: "asurascans",
            },
          },
          time_updated: 1742387945.6932878,
          url: "https://asuratoon.com/7827014947-reincarnation-of-the-suicidal-battle-god-chapter-101/",
        },
        asuracomics: {
          latest: "91",
          latest_link:
            "https://asuracomics.com/reincarnation-of-the-suicidal-battle-god-chapter-91/",
          old_chapters: {},
          time_updated: 1694956596,
        },
        asurascans: {
          latest: "101",
          latest_link:
            "https://asuracomic.net/page/2//series/reincarnation-of-the-suicidal-battle-god-e48ddd0f/chapter/101.1",
          old_chapters: {
            "100": {
              latest_link:
                "https://asuracomic.net/page/2//series/reincarnation-of-the-suicidal-battle-god-e48ddd0f/chapter/100",
              scansite: "asurascans",
            },
            "101": {
              latest_link:
                "https://asuracomic.net/page/2//series/reincarnation-of-the-suicidal-battle-god-e48ddd0f/chapter/101.1",
              scansite: "asurascans",
            },
          },
          time_updated: 1742387945.6932878,
          url: "https://www.asurascans.com/reincarnation-of-the-suicidal-battle-god-chapter-79/",
        },
      },
      title: "reincarnation-of-the-suicidal-battle-god",
    },
    {
      chapter: "612",
      current_source: "any",
      domain: "https://cosmicscans.com/",
      latest: "653",
      read: false,
      scansite: "cosmicscans",
      sources: {
        any: {
          latest: "653",
          latest_link:
            "https://www.webtoons.com/en/fantasy/tower-of-god/season-3-ep-235-season-3-finale/viewer?title_no=95&episode_no=653",
          old_chapters: {},
          time_updated: 1740362696,
          url: "https://ww2.readtowerofgod.com/chapter/tower-of-god-spoilers-raw-chapter-593",
        },
        cosmicscans: {
          latest: "612",
          latest_link: "https://cubari.moe/read/imgur/YScNql5/1/1/",
          old_chapters: {},
          time_updated: 1708946540,
          url: "https://cosmic-scans.com/tower-of-god-chapter-612/",
        },
        cubari: {
          latest: "584",
          latest_link: "https://cubari.moe/read/imgur/IIBQ5if/1/1/",
          old_chapters: {},
          time_updated: 1691965510,
        },
        webtoons: {
          latest: "653",
          latest_link:
            "https://www.webtoons.com/en/fantasy/tower-of-god/season-3-ep-235-season-3-finale/viewer?title_no=95&episode_no=653",
          old_chapters: {},
          time_updated: 1740362696,
        },
      },
      title: "tower-of-god",
    },
    {
      chapter: "138",
      current_source: "any",
      domain: "",
      latest: "138",
      link: "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-270eca79/chapter/109",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          latest: "138",
          latest_link:
            "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/138",
          old_chapters: {
            "136": {
              latest_link:
                "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/136",
              scansite: "asurascans",
            },
            "137": {
              latest_link:
                "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/137",
              scansite: "asurascans",
            },
            "138": {
              latest_link:
                "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/138",
              scansite: "asurascans",
            },
          },
          time_updated: 1739356275.5108056,
          url: "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-edc3d3e9/chapter/138",
        },
        asura: {
          latest: "68",
          latest_link:
            "https://asura.gg/reformation-of-the-deadbeat-noble-chapter-68-something-that-never-changes/",
          old_chapters: {},
          time_updated: 1665175302,
        },
        asuracomic: {
          latest: "129",
          latest_link:
            "https://asuracomic.netreformation-of-the-deadbeat-noble-chapter-129/",
          old_chapters: {},
          time_updated: 1734320945,
        },
        asuracomics: {
          latest: "95",
          latest_link:
            "https://asuracomics.com/reformation-of-the-deadbeat-noble-chapter-95/",
          old_chapters: {},
          time_updated: 1697370034,
        },
        asurascans: {
          latest: "138",
          latest_link:
            "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/138",
          old_chapters: {
            "136": {
              latest_link:
                "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/136",
              scansite: "asurascans",
            },
            "137": {
              latest_link:
                "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/137",
              scansite: "asurascans",
            },
            "138": {
              latest_link:
                "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-9683553e/chapter/138",
              scansite: "asurascans",
            },
          },
          time_updated: 1739356275.5108056,
          url: "https://asuracomic.net/series/reformation-of-the-deadbeat-noble-270eca79/chapter/109",
        },
        cubari: {
          latest: "107",
          latest_link: "https://cubari.moe/read/imgur/zb4467X/1/1/",
          old_chapters: {},
          time_updated: 1722020391,
        },
        s2endasurascans: {
          latest: "86",
          latest_link:
            "https://asurascans.com/reformation-of-the-deadbeat-noble-chapter-86/",
          old_chapters: {},
          time_updated: 1678042273,
        },
      },
      title: "reformation-of-the-deadbeat-noble",
    },
    {
      chapter: "97.85",
      current_source: "any",
      domain: "",
      latest: "97.85",
      link: "https://mangadex.org/chapter/b071d173-4580-4c0b-94f5-8eefbf59efd1",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          latest: "97.85",
          latest_link:
            "https://mangadex.org/chapter/12198780-aada-420a-9279-dc6a863a722f",
          old_chapters: {},
          time_updated: 1734360278,
          url: "https://mangadex.org/chapter/12198780-aada-420a-9279-dc6a863a722f",
        },
        mangadex: {
          latest: "97.85",
          latest_link:
            "https://mangadex.org/chapter/12198780-aada-420a-9279-dc6a863a722f",
          old_chapters: {},
          time_updated: 1734360278,
          url: "https://mangadex.org/chapter/b071d173-4580-4c0b-94f5-8eefbf59efd1",
        },
      },
      title: "dungeon-meshi",
    },
    {
      chapter: "202",
      current_source: "any",
      domain: "",
      latest: "202",
      link: "https://luminousscans.com/legend-of-the-northern-blade-chapter-160/",
      read: true,
      scansite: "luminousscans",
      sources: {
        alphascans: {
          latest: "161",
          latest_link:
            "https://luminousscans.com/1692255601-legend-of-the-northern-blade-chapter-161/",
          old_chapters: {},
          time_updated: 1689685204.6128988,
          url: "https://luminousscans.com/1692255601-legend-of-the-northern-blade-chapter-161/",
        },
        any: {
          latest: "202",
          latest_link:
            "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-202",
          old_chapters: {
            "198": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-198",
              scansite: "rizzfables",
            },
            "199": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-199",
              scansite: "rizzfables",
            },
            "200": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-200",
              scansite: "rizzfables",
            },
            "201": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-201",
              scansite: "rizzfables",
            },
            "202": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-202",
              scansite: "rizzfables",
            },
          },
          time_updated: 1732024739,
          url: "https://cubari.moe/read/imgchest/qe4gxgqbjyj/1/1/",
        },
        leviatanscans: {
          latest: "178",
          latest_link:
            "https://lscomic.com/manga/legend-of-the-northern-blade/chapter-178/",
          old_chapters: {},
          time_updated: 1706745600,
        },
        luminouscans: {
          latest: "196",
          latest_link:
            "https://radiantscans.com/legend-of-the-northern-blade-chapter-196/",
          old_chapters: {
            "194": {
              latest_link:
                "https://radiantscans.com/legend-of-the-northern-blade-chapter-194/",
              scansite: "luminouscans",
            },
            "195": {
              latest_link:
                "https://radiantscans.com/legend-of-the-northern-blade-chapter-195/",
              scansite: "luminouscans",
            },
            "196": {
              latest_link:
                "https://radiantscans.com/legend-of-the-northern-blade-chapter-196/",
              scansite: "luminouscans",
            },
          },
          time_updated: 1728424805.187056,
        },
        luminouscomics: {
          latest: "192.5",
          latest_link:
            "https://luminouscomics.org/legend-of-the-northern-blade-chapter-192-5/",
          old_chapters: {},
          time_updated: 1719334111,
        },
        luminousscans: {
          latest: "161",
          latest_link:
            "https://luminousscans.com/1692255601-legend-of-the-northern-blade-chapter-161/",
          old_chapters: {},
          time_updated: 1689685205.3269193,
          url: "https://luminousscans.com/legend-of-the-northern-blade-chapter-160/",
        },
        rizzfables: {
          latest: "202",
          latest_link:
            "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-202",
          old_chapters: {
            "198": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-198",
              scansite: "rizzfables",
            },
            "199": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-199",
              scansite: "rizzfables",
            },
            "200": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-200",
              scansite: "rizzfables",
            },
            "201": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-201",
              scansite: "rizzfables",
            },
            "202": {
              latest_link:
                "https://rizzfables.com/chapter/r2311170-legend-of-the-northern-blade-chapter-202",
              scansite: "rizzfables",
            },
          },
          time_updated: 1732024739,
        },
        vortexscans: {
          latest: "200",
          latest_link: "https://cubari.moe/read/imgur/8q14ry6/1/1/",
          old_chapters: {},
          time_updated: 1730816108,
        },
      },
      title: "legend-of-the-northern-blade",
    },
    {
      chapter: "93",
      current_source: "any",
      domain: "mangadex.org",
      latest: "93",
      link: "https://mangadex.org/chapter/ca794caa-8090-4914-8990-b234c146447d/1",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "93",
          latest: "93",
          latest_link:
            "https://mangadex.org/chapter/9bb5464d-b020-4cca-809b-03da313126fb",
          old_chapters: {},
          time_updated: 1729475789,
          url: "https://mangadex.org/chapter/9bb5464d-b020-4cca-809b-03da313126fb",
        },
        mangadex: {
          latest: "93",
          latest_link:
            "https://mangadex.org/chapter/9bb5464d-b020-4cca-809b-03da313126fb",
          old_chapters: {},
          time_updated: 1729475789,
        },
        reddit: {
          latest: "91.6",
          latest_link: "https://www.reddit.com/gallery/1scoox3",
          old_chapters: {},
          time_updated: 1775347042,
        },
      },
      title: "--record-of-ragnarok",
    },
    {
      chapter: "131",
      current_source: "any",
      domain: "",
      latest: "131",
      link: "https://www.asurascans.com/sword-fanatic-wanders-through-the-night-chapter-65/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          latest: "131",
          latest_link:
            "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/131",
          old_chapters: {
            "129": {
              latest_link:
                "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/129",
              scansite: "asurascans",
            },
            "130": {
              latest_link:
                "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/130",
              scansite: "asurascans",
            },
            "131": {
              latest_link:
                "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/131",
              scansite: "asurascans",
            },
          },
          time_updated: 1727452804.0358932,
          url: "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-092f9905/chapter/131",
        },
        asurascans: {
          latest: "131",
          latest_link:
            "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/131",
          old_chapters: {
            "129": {
              latest_link:
                "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/129",
              scansite: "asurascans",
            },
            "130": {
              latest_link:
                "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/130",
              scansite: "asurascans",
            },
            "131": {
              latest_link:
                "https://asuracomic.net/series/sword-fanatic-wanders-through-the-night-a5c13cd6/chapter/131",
              scansite: "asurascans",
            },
          },
          time_updated: 1727452804.0358932,
          url: "https://www.asurascans.com/sword-fanatic-wanders-through-the-night-chapter-65/",
        },
      },
      title: "sword-fanatic-wanders-through-the-night",
    },
    {
      best_score: 100,
      chapter: "271",
      closest_title: "jujutsu-kaisen",
      current_source: "any",
      domain: "https://onepiecechapters.com/",
      latest: "271",
      link: "https://onepiecechapters.com/chapters/2312/jujutsu-kaisen-chapter-187",
      read: true,
      scansite: "tcbscans",
      sources: {
        any: {
          latest: "271",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7808/jujutsu-kaisen-chapter-271",
          old_chapters: {},
          time_updated: 1727405729,
          url: "https://tcbscans.com/chapters/7808/jujutsu-kaisen-chapter-271",
        },
        mangaplus: {
          latest: "261",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1021184",
          old_chapters: {},
          time_updated: 1716735619,
        },
        tcbscans: {
          latest: "271",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7808/jujutsu-kaisen-chapter-271",
          old_chapters: {},
          time_updated: 1727405729,
        },
      },
      title: "jujutsu-kaisen",
    },
    {
      chapter: "155",
      current_source: "any",
      domain: "mangadex.org",
      latest: "155",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          latest: "155",
          latest_link:
            "https://mangadex.org/chapter/aa72593e-42ef-4f0e-96ab-d68a5d32d63c",
          old_chapters: {},
          time_updated: 1722998945,
          url: "https://mangadex.org/chapter/aa72593e-42ef-4f0e-96ab-d68a5d32d63c",
        },
        mangadex: {
          latest: "155",
          latest_link:
            "https://mangadex.org/chapter/aa72593e-42ef-4f0e-96ab-d68a5d32d63c",
          old_chapters: {},
          time_updated: 1722998945,
        },
      },
      title: "please-don't-bully-me,-nagatoro-/-ijiranaide,-nagatoro-san",
    },
    {
      best_score: 100,
      chapter: "430",
      closest_title: "my-hero-academia",
      current_source: "any",
      domain: "https://onepiecechapters.com/",
      latest: "430",
      link: "https://onepiecechapters.com/chapters/2303/my-hero-academia-chapter-355",
      read: true,
      scansite: "tcbscans",
      sources: {
        any: {
          latest: "430",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7777/my-hero-academia-chapter-430",
          old_chapters: {},
          time_updated: 1722565411,
          url: "https://tcbscans.com/chapters/7781/my-hero-academia-chapter-430.5",
        },
        mangaplus: {
          latest: "423",
          latest_link: "https://mangaplus.shueisha.co.jp/viewer/1021189",
          old_chapters: {},
          time_updated: 1716130814,
        },
        tcbscans: {
          latest: "430",
          latest_link:
            "https://tcbonepiecechapters.com/chapters/7777/my-hero-academia-chapter-430",
          old_chapters: {},
          time_updated: 1722565411,
        },
        viz: {
          latest: "126",
          latest_link:
            "https://www.viz.com/shonenjump/my-hero-academia-vigilantes-chapter-126/chapter/24687?action=read",
          old_chapters: {},
          time_updated: 1653671133,
        },
      },
      title: "my-hero-academia",
    },
    {
      chapter: "296",
      current_source: "any",
      domain: "https://luminousscans.com/",
      latest: "296",
      link: "https://flamescans.org/peerless-dad-chapter-221",
      read: true,
      scansite: "luminouscans",
      sources: {
        alphascans: {
          latest: "267",
          latest_link:
            "https://luminousscans.com/1694588401-peerless-dad-chapter-267/",
          old_chapters: {
            "265": {
              latest_link:
                "https://luminousscans.com/1694588401-peerless-dad-chapter-265/",
              scansite: "alphascans",
            },
            "266": {
              latest_link:
                "https://luminousscans.com/1694588401-peerless-dad-chapter-266/",
              scansite: "alphascans",
            },
            "267": {
              latest_link:
                "https://luminousscans.com/1694588401-peerless-dad-chapter-267/",
              scansite: "alphascans",
            },
          },
          time_updated: 1693787404.8741517,
        },
        any: {
          chapter: "296",
          latest: "296",
          latest_link:
            "https://mangadex.org/chapter/e0916d48-f2f7-441b-a92d-2529ce6df9af",
          old_chapters: {},
          time_updated: 1721626680,
          url: "https://mangadex.org/chapter/e0916d48-f2f7-441b-a92d-2529ce6df9af",
        },
        flamescans: {
          latest: "222",
          latest_link:
            "https://flamescans.org/1656432061-peerless-dad-chapter-222/",
          old_chapters: {},
          time_updated: 1654601691.2612362,
        },
        leviatanscans: {
          latest: "290",
          latest_link: "https://lscomic.com/manga/peerless-dad/chapter-290/",
          old_chapters: {},
          time_updated: 1707264000,
        },
        luminouscans: {
          latest: "285",
          latest_link:
            "https://luminouscomics.org/1717372802-peerless-dad-chapter-285/",
          old_chapters: {
            "283": {
              latest_link:
                "https://luminouscomics.org/1717372802-peerless-dad-chapter-283/",
              scansite: "luminouscans",
            },
            "284": {
              latest_link:
                "https://luminouscomics.org/1717372802-peerless-dad-chapter-284/",
              scansite: "luminouscans",
            },
            "285": {
              latest_link:
                "https://luminouscomics.org/1717372802-peerless-dad-chapter-285/",
              scansite: "luminouscans",
            },
          },
          time_updated: 1714813126.5967724,
        },
        luminousscans: {
          latest: "282",
          latest_link: "https://luminousscans.net/peerless-dad-chapter-282/",
          old_chapters: {},
          time_updated: 1706257146,
        },
        mangadex: {
          latest: "296",
          latest_link:
            "https://mangadex.org/chapter/e0916d48-f2f7-441b-a92d-2529ce6df9af",
          old_chapters: {},
          time_updated: 1721626680,
        },
      },
      title: "peerless-dad",
    },
    {
      chapter: "269",
      current_source: "any",
      domain: "",
      latest: "269",
      link: "https://luminousscans.com/a-returners-magic-should-be-special-chapter-220/",
      read: true,
      scansite: "flamescans",
      sources: {
        alphascans: {
          latest: "234",
          latest_link:
            "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-234/",
          old_chapters: {
            "232": {
              latest_link:
                "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-232/",
              scansite: "alphascans",
            },
            "233": {
              latest_link:
                "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-233/",
              scansite: "alphascans",
            },
            "234": {
              latest_link:
                "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-234/",
              scansite: "alphascans",
            },
          },
          time_updated: 1693787404.8741517,
        },
        any: {
          latest: "269",
          latest_link:
            "https://radiantscans.com/a-returners-magic-should-be-special-chapter-269/",
          old_chapters: {
            "267": {
              latest_link:
                "https://radiantscans.com/a-returners-magic-should-be-special-chapter-267/",
              scansite: "luminouscans",
            },
            "268": {
              latest_link:
                "https://radiantscans.com/a-returners-magic-should-be-special-chapter-268/",
              scansite: "luminouscans",
            },
            "269": {
              latest_link:
                "https://radiantscans.com/a-returners-magic-should-be-special-chapter-269/",
              scansite: "luminouscans",
            },
          },
          time_updated: 1721167205.187056,
          url: "https://luminous-scans.com/a-returners-magic-should-be-special-chapter-269/",
        },
        asurascans: {
          latest: "193",
          latest_link:
            "https://asurascans.com/a-returners-magic-should-be-special-chapter-193/",
          old_chapters: {},
          time_updated: 1656422989,
        },
        cubari: {
          latest: "235",
          latest_link: "https://cubari.moe/read/imgur/hxe4GlY/1/1/",
          old_chapters: {},
          time_updated: 1692492935,
        },
        flamescans: {
          latest: "192",
          latest_link:
            "https://flamescans.org/a-returners-magic-should-be-special-chapter-192",
          old_chapters: {},
          time_updated: 1655312059,
        },
        luminouscans: {
          latest: "269",
          latest_link:
            "https://radiantscans.com/a-returners-magic-should-be-special-chapter-269/",
          old_chapters: {
            "267": {
              latest_link:
                "https://radiantscans.com/a-returners-magic-should-be-special-chapter-267/",
              scansite: "luminouscans",
            },
            "268": {
              latest_link:
                "https://radiantscans.com/a-returners-magic-should-be-special-chapter-268/",
              scansite: "luminouscans",
            },
            "269": {
              latest_link:
                "https://radiantscans.com/a-returners-magic-should-be-special-chapter-269/",
              scansite: "luminouscans",
            },
          },
          time_updated: 1721167205.187056,
        },
        luminouscomics: {
          latest: "266",
          latest_link:
            "https://luminouscomics.org/a-returners-magic-should-be-special-chapter-266/",
          old_chapters: {},
          time_updated: 1719520838,
        },
        luminousscans: {
          latest: "234",
          latest_link:
            "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-234/",
          old_chapters: {
            "232": {
              latest_link:
                "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-232/",
              scansite: "luminousscans",
            },
            "233": {
              latest_link:
                "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-233/",
              scansite: "luminousscans",
            },
            "234": {
              latest_link:
                "https://luminousscans.com/1694588401-a-returners-magic-should-be-special-chapter-234/",
              scansite: "luminousscans",
            },
          },
          time_updated: 1693787406.8484993,
          url: "https://luminousscans.com/a-returners-magic-should-be-special-chapter-220/",
        },
        mangademon: {
          latest: "237",
          latest_link:
            "https://manga-demon.org/manga/A-Returner%2527s-Magic-Should-Be-Special/chapter/237-VA13",
          old_chapters: {},
          time_updated: 1694956884,
        },
        mangadex: {
          latest: "231",
          latest_link:
            "https://mangadex.org/chapter/1813cd97-dc7d-4555-855c-93ed36a2a362",
          old_chapters: {},
          time_updated: 1690130821,
        },
      },
      title: "a-returner's-magic-should-be-special",
    },
    {
      chapter: "46",
      current_source: "any",
      domain: "",
      latest: "46",
      link: "https://mangadex.org/chapter/40487676-0674-4d50-8a5b-e9dda0cb1b3e/1",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "46",
          latest: "46",
          latest_link:
            "https://mangadex.org/chapter/7c69b7de-9d5d-4395-ac71-64fd3d5228c9/1",
          old_chapters: {},
          time_updated: 1718932575.894568,
          url: "https://mangadex.org/chapter/40487676-0674-4d50-8a5b-e9dda0cb1b3e/1",
        },
        mangadex: {
          chapter: "46",
          latest: "46",
          latest_link:
            "https://mangadex.org/chapter/7c69b7de-9d5d-4395-ac71-64fd3d5228c9/1",
          old_chapters: {},
          time_updated: 1718932575.894568,
          url: "https://mangadex.org/chapter/40487676-0674-4d50-8a5b-e9dda0cb1b3e/1",
        },
      },
      title:
        "sokushi-cheat-ga-saikyou-sugite,-isekai-no-yatsura-ga-marude-aite-ni-naranai-n-desu-ga",
    },
    {
      chapter: "107",
      current_source: "any",
      domain: "",
      latest: "107",
      link: "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-99/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          chapter: "107",
          latest: "107",
          latest_link:
            "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-107/",
          old_chapters: {
            "105": {
              latest_link:
                "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-105/",
              scansite: "asurascans",
            },
            "106": {
              latest_link:
                "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-106/",
              scansite: "asurascans",
            },
            "107": {
              latest_link:
                "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-107/",
              scansite: "asurascans",
            },
          },
          time_updated: 1717983005.3271482,
          url: "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-107/",
        },
        asurascans: {
          latest: "107",
          latest_link:
            "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-107/",
          old_chapters: {
            "105": {
              latest_link:
                "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-105/",
              scansite: "asurascans",
            },
            "106": {
              latest_link:
                "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-106/",
              scansite: "asurascans",
            },
            "107": {
              latest_link:
                "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-107/",
              scansite: "asurascans",
            },
          },
          time_updated: 1717983005.3271482,
          url: "https://asuratoon.com/1908287720-archmage-transcending-through-regression-chapter-99/",
        },
      },
      title: "archmage-transcending-through-regression",
    },
    {
      chapter: "103",
      current_source: "any",
      domain: "https://cubari.moe/",
      latest: "108",
      read: false,
      scansite: "cubari",
      sources: {
        any: {
          latest: "108",
          latest_link:
            "https://mangadex.org/chapter/7c8e9218-72ed-4dc1-bbe7-decd0606161a",
          old_chapters: {},
          time_updated: 1713995342,
        },
        cubari: {
          latest: "103",
          latest_link:
            "https://cubari.moe/read/gist/cmF3L2Rzb25nYmlyZDEvTWFuZ2EvbWFzdGVyL0hvdXNla2klMjBubyUyMEt1bmkuanNvbg/103/1/",
          old_chapters: {},
          time_updated: 1692827796,
        },
        mangadex: {
          latest: "108",
          latest_link:
            "https://mangadex.org/chapter/7c8e9218-72ed-4dc1-bbe7-decd0606161a",
          old_chapters: {},
          time_updated: 1713995342,
        },
      },
      title: "houseki-no-kuni",
    },
    {
      chapter: "42",
      current_source: "any",
      domain: "",
      latest: "42",
      link: "https://mangadex.org/chapter/d0f0c642-3b89-442d-a120-8d6bd17ea2e9",
      read: true,
      scansite: "mangadex",
      sources: {
        any: {
          chapter: "42",
          latest: "42",
          latest_link:
            "https://mangadex.org/chapter/d0f0c642-3b89-442d-a120-8d6bd17ea2e9",
          time_updated: 1710437399.487284,
          url: "https://mangadex.org/chapter/d0f0c642-3b89-442d-a120-8d6bd17ea2e9",
        },
        mangadex: {
          latest: "42",
          latest_link:
            "https://mangadex.org/chapter/d0f0c642-3b89-442d-a120-8d6bd17ea2e9",
          time_updated: 1710437399.487284,
          url: "https://mangadex.org/chapter/d0f0c642-3b89-442d-a120-8d6bd17ea2e9",
        },
      },
      title:
        "my-instant-death-ability-is-so-overpowered,-no-one-in-this-other-world-stands-a-chance-against-me!",
    },
    {
      chapter: "127",
      current_source: "any",
      domain: "https://www.asurascans.com/",
      latest: "127",
      link: "https://asuratoon.com/4622438374-i-reincarnated-as-the-crazed-heir-chapter-121/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          latest: "127",
          latest_link:
            "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-127/",
          old_chapters: {
            "125": {
              latest_link:
                "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-125/",
              scansite: "asurascans",
            },
            "126": {
              latest_link:
                "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-126/",
              scansite: "asurascans",
            },
            "127": {
              latest_link:
                "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-127/",
              scansite: "asurascans",
            },
          },
          time_updated: 1709839805.052196,
          url: "https://asuratoon.com/4555060900-i-reincarnated-as-the-crazed-heir-chapter-127/",
        },
        asurascans: {
          latest: "127",
          latest_link:
            "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-127/",
          old_chapters: {
            "125": {
              latest_link:
                "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-125/",
              scansite: "asurascans",
            },
            "126": {
              latest_link:
                "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-126/",
              scansite: "asurascans",
            },
            "127": {
              latest_link:
                "https://asuratoon.com/8612194254-i-reincarnated-as-the-crazed-heir-chapter-127/",
              scansite: "asurascans",
            },
          },
          time_updated: 1709839805.052196,
          url: "https://asuratoon.com/4622438374-i-reincarnated-as-the-crazed-heir-chapter-121/",
        },
      },
      title: "i-reincarnated-as-the-crazed-heir",
    },
    {
      chapter: "81",
      current_source: "any",
      domain: "",
      latest: "81",
      link: "https://www.asurascans.com/damn-reincarnation-chapter-55/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          latest: "81",
          latest_link:
            "https://asuratoon.com/damn-reincarnation-chapter-50-s2-end/",
          old_chapters: {
            "79": {
              latest_link:
                "https://asuratoon.com/3955407132-damn-reincarnation-chapter-79/",
              scansite: "asurascans",
            },
            "80": {
              latest_link:
                "https://asuratoon.com/3955407132-damn-reincarnation-chapter-80/",
              scansite: "asurascans",
            },
            "81": {
              latest_link:
                "https://asuratoon.com/damn-reincarnation-chapter-50-s2-end/",
              scansite: "asurascans",
            },
          },
          time_updated: 1703687403.5792592,
          url: "https://asuratoon.com/damn-reincarnation-chapter-50-s2-end/",
        },
        asura: {
          latest: "50",
          latest_link: "https://asura.gg/damn-reincarnation-chapter-50/",
          old_chapters: {},
          time_updated: 1674052589,
        },
        asurascans: {
          latest: "81",
          latest_link:
            "https://asuratoon.com/damn-reincarnation-chapter-50-s2-end/",
          old_chapters: {
            "79": {
              latest_link:
                "https://asuratoon.com/3955407132-damn-reincarnation-chapter-79/",
              scansite: "asurascans",
            },
            "80": {
              latest_link:
                "https://asuratoon.com/3955407132-damn-reincarnation-chapter-80/",
              scansite: "asurascans",
            },
            "81": {
              latest_link:
                "https://asuratoon.com/damn-reincarnation-chapter-50-s2-end/",
              scansite: "asurascans",
            },
          },
          time_updated: 1703687403.5792592,
          url: "https://www.asurascans.com/damn-reincarnation-chapter-55/",
        },
        reaperscans: {
          latest: "80",
          latest_link:
            "https://reaperscans.com/comics/6887-damn-reincarnation/chapters/56361579-chapter-80",
          old_chapters: {
            "80": {
              latest_link:
                "https://reaperscans.com/comics/6887-damn-reincarnation/chapters/56361579-chapter-80",
              scansite: "reaperscans",
            },
            "81": {
              latest_link:
                "https://reaperscans.com/comics/6887-damn-reincarnation/chapters/30550051-chapter-81",
              scansite: "reaperscans",
            },
          },
          time_updated: 1703512811.794386,
        },
      },
      title: "damn-reincarnation",
    },
    {
      chapter: "133",
      current_source: "any",
      domain: "",
      latest: "133",
      link: "https://www.asurascans.com/legend-of-asura-the-venom-dragon-chapter-133/",
      read: true,
      scansite: "asurascans",
      sources: {
        any: {
          latest: "133",
          latest_link:
            "https://www.asurascans.com/legend-of-asura-the-venom-dragon-chapter-133/",
          time_updated: 1684251027.2231374,
          url: "https://www.asurascans.com/legend-of-asura-the-venom-dragon-chapter-133/",
        },
        asurascans: {
          latest: "133",
          latest_link:
            "https://www.asurascans.com/legend-of-asura-the-venom-dragon-chapter-133/",
          time_updated: 1684251027.2231374,
          url: "https://www.asurascans.com/legend-of-asura-the-venom-dragon-chapter-133/",
        },
        leviatanscans: {
          latest: "133",
          latest_link:
            "https://lscomic.com/manga/the-legend-of-sura-venom-dragon/chapter-133/",
          time_updated: 1693962004.8432171,
        },
      },
      title: "legend-of-asura-the-venom-dragon",
    },
  ];

  return (
    <div className="App">
      <React.StrictMode>
        {mode === "extension" ? (
          <PopupFromExtension />
        ) : (
          <Popup allManga={[]} demoMangaList={demoMangaList} />
        )}
      </React.StrictMode>
    </div>
  );
}

export default App;
