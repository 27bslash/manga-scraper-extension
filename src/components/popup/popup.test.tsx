import { act, render, screen } from "@testing-library/react";
import Popup from "./popup";
import { makeManga, type ChromeMock } from "../../test/chrome-mock";

// let all queued chrome callbacks / effect chains settle deterministically
const settle = async () => {
  for (let i = 0; i < 8; i++) {
    await act(async () => {});
  }
};

describe("Popup", () => {
  const mockChrome = global.chrome as unknown as ChromeMock;

  beforeEach(() => {
    mockChrome.__reset();
  });

  it("renders unread manga from chrome storage", async () => {
    mockChrome.__seed({
      "manga-list": [
        makeManga({ title: "series-a", read: true, chapter: "5", latest: "5" }),
        makeManga({ title: "series-b", read: false }),
      ],
    });

    render(<Popup />);
    await settle();

    expect(screen.getByText(/series\s*b/i)).toBeInTheDocument();
    // read series is hidden in the default unread view
    expect(screen.queryByText(/series\s*a/i)).toBeNull();
  });

  it("boils demo props down to the unread view when storage is unavailable", async () => {
    const globalWithMockChrome = globalThis as unknown as {
      chrome?: ChromeMock;
    };
    const chromeRef = globalWithMockChrome.chrome;
    delete globalWithMockChrome.chrome;

    try {
      // one unread demo series -> "Unread" tab is shown
      render(<Popup demoMangaList={[makeManga({ title: "demo-series" })]} />);
      await settle();

      expect(screen.getByRole("tab", { name: "Unread" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "All series" })).toBeInTheDocument();
    } finally {
      globalWithMockChrome.chrome = chromeRef;
    }
  });

  it("renders an empty list without crashing when nothing is stored", async () => {
    render(<Popup />);
    await settle();

    expect(screen.getByRole("tab", { name: "All series" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Add New" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Unread" })).toBeNull();
  });
});
