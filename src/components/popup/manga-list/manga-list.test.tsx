import { act, fireEvent, render, screen } from "@testing-library/react";
import UserMangaList from "./manga-list";
import { makeManga, type ChromeMock } from "../../../test/chrome-mock";
import type Manga from "../../../types/manga";

const titleRe = (t: string) => new RegExp(`^${t.replace(/-/g, "\\s+")}$`, "i");

// let all queued chrome callbacks / effect chains settle deterministically
const settle = async () => {
  for (let i = 0; i < 8; i++) {
    await act(async () => {});
  }
};

const click = async (el: Element | null | undefined) => {
  await act(async () => {
    fireEvent.click(el as Element);
  });
  await settle();
};

describe("UserMangaList", () => {
  const mockChrome = global.chrome as unknown as ChromeMock;

  beforeEach(() => {
    mockChrome.__reset();
  });

  const seedList = (items: Manga[]) => { mockChrome.__reset(); mockChrome.__seed({ "manga-list": items }); };

  it("shows only unread series by default when unread items exist", async () => {
    seedList([
      makeManga({
        title: "unread-series",
        read: false,
        chapter: "1",
        latest: "5",
      }),
      makeManga({
        title: "read-series",
        read: true,
        chapter: "5",
        latest: "5",
      }),
    ]);

    render(<UserMangaList />);
    await settle();

    expect(screen.getByText(titleRe("unread-series"))).toBeInTheDocument();
    expect(screen.queryByText(titleRe("read-series"))).toBeNull();
    expect(screen.getByRole("tab", { name: "Unread" })).toBeInTheDocument();
  });

  it("shows every series after clicking the All series tab", async () => {
    seedList([
      makeManga({ title: "unread-series", read: false }),
      makeManga({
        title: "read-series",
        read: true,
        chapter: "5",
        latest: "5",
      }),
    ]);

    render(<UserMangaList />);
    await settle();

    await click(screen.getByRole("tab", { name: "All series" }));

    expect(screen.getByText(titleRe("read-series"))).toBeInTheDocument();
    expect(screen.getByText(titleRe("unread-series"))).toBeInTheDocument();
  });

  it("renders chapter progress as current/latest links", async () => {
    seedList([
      makeManga({ title: "chapter-manga", chapter: "2", latest: "9" }),
    ]);

    render(<UserMangaList />);
    await settle();

const list = document.querySelector(".manga-updater-list-item");
    expect(list).not.toBeNull();
    expect(list!.textContent).toContain("2");
    expect(list!.textContent).toContain("/");
    expect(list!.textContent).toContain("9");
  });

  it("links each item to its resolved chapter url", async () => {
    seedList([makeManga({ title: "linked-manga", read: false })]);

    render(<UserMangaList />);
    await settle();

    // current chapter (1) is 3 behind latest (5): label stays "1" but the
    // link is rewritten to point at the next chapter
    const link = screen
      .getAllByRole("link")
      .find((a) => (a.getAttribute("href") || "").includes("chapter-2"));
    expect(link).toBeTruthy();
    expect(link).toHaveAttribute("href", "https://example.com/chapter-2");
  });

  it("marks a series read when its latest chapter link is clicked", async () => {
    seedList([makeManga({ title: "click-manga", read: false })]);

    render(<UserMangaList />);
    await settle();

    const links = Array.from(document.querySelectorAll("a"));
    const latestLink = links.find((a) =>
      (a.getAttribute("href") || "").includes("chapter-5"),
    );
    await click(latestLink);

    const stored = mockChrome.__store.get("manga-list") as Manga[];
    expect(stored[0].read).toBe(true);
    expect(stored[0].chapter).toBe("5");
  });

  it("exposes batch actions once an item is checked", async () => {
    seedList([makeManga({ title: "batch-manga", read: false })]);

    render(<UserMangaList />);
    await settle();

    // batch controls with read/un-read/Delete only appear in the "all" view
    await click(screen.getByRole("tab", { name: "All series" }));
    await click(
      document.querySelector('.manga-updater-list-item [role="button"]'),
    );

    expect(screen.getByRole("tab", { name: "read" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "un-read" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Delete" })).toBeInTheDocument();
  });

  it("deletes checked items after confirming the delete prompt", async () => {
    seedList([
      makeManga({ title: "delete-me", read: false }),
      makeManga({ title: "keep-me", read: false }),
    ]);

    render(<UserMangaList />);
    await settle();

    await click(screen.getByRole("tab", { name: "All series" }));
    await click(
      document.querySelector('.manga-updater-list-item [role="button"]'),
    );

    await click(screen.getByRole("tab", { name: "Delete" }));
    await click(screen.getByText("yes"));

    const stored = mockChrome.__store.get("manga-list") as Manga[];
    expect(stored.map((m) => m.title)).toEqual(["keep-me"]);
  });
});





