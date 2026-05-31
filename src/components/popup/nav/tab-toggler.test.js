import { fireEvent, render, screen } from "@testing-library/react";
import TabToggler from "./tab-toggler";

const makeManga = (read) => ({
  title: "series-a",
  chapter: "1",
  latest: "2",
  link: "https://example.com",
  domain: "example.com",
  scansite: "demo",
  read: read,
  current_source: "any",
  sources: {
    any: {
      url: "https://example.com/1",
      latest: "2",
      chapter: "1",
      latest_link: "https://example.com/2",
      time_updated: 0,
      old_chapters: {},
    },
  },
});

const renderTabs = (overrides = {}) => {
  const handleClick = jest.fn();
  const handleDelete = jest.fn();
  const updateRead = jest.fn();
  const updateEditing = jest.fn();

  render(
    <TabToggler
      showAll={false}
      handleClick={handleClick}
      checked={[]}
      handleDelete={handleDelete}
      updateEditing={updateEditing}
      updateRead={updateRead}
      totalData={[makeManga(false)]}
      {...overrides}
    />,
  );

  return { handleClick, handleDelete, updateRead };
};

describe("TabToggler", () => {
  it("switches to all-series view when All series tab is clicked", () => {
    const { handleClick } = renderTabs();

    fireEvent.click(screen.getByRole("tab", { name: "All series" }));

    expect(handleClick).toHaveBeenCalledWith(true, "toggleView");
  });

  it("switches to unread view when Unread tab is clicked", () => {
    const { handleClick } = renderTabs({ showAll: true });

    fireEvent.click(screen.getByRole("tab", { name: "Unread" }));

    expect(handleClick).toHaveBeenCalledWith(false, "toggleView");
  });

  it("opens add-new view when Add New tab is clicked", () => {
    const { handleClick } = renderTabs();

    fireEvent.click(screen.getByRole("tab", { name: "Add New" }));

    expect(handleClick).toHaveBeenCalledWith(true, "addNew");
  });

  it("shows only All series/Add New tabs when there are no unread items", () => {
    renderTabs({ totalData: [makeManga(true)] });

    expect(screen.queryByRole("tab", { name: "Unread" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All series" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Add New" })).toBeInTheDocument();
  });

  it("triggers batch actions when items are selected", () => {
    const { updateRead, handleDelete } = renderTabs({
      checked: [0],
      showAll: true,
    });

    fireEvent.click(screen.getByRole("tab", { name: "read" }));
    fireEvent.click(screen.getByRole("tab", { name: "un-read" }));
    fireEvent.click(screen.getByRole("tab", { name: "Delete" }));

    expect(updateRead).toHaveBeenCalledWith(true);
    expect(updateRead).toHaveBeenCalledWith(false);
    expect(handleDelete).toHaveBeenCalledWith(-1);
  });
});
