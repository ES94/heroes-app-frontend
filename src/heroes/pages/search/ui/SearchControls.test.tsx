import { describe, expect, test } from "vitest";
import { MemoryRouter } from "react-router";
import { fireEvent, render, screen } from "@testing-library/react";

import { SearchControls } from "./SearchControls";

if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
}

const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls />
    </MemoryRouter>,
  );
};

describe("SearchControls", () => {
  test("should render search controls with default values", () => {
    const { container } = renderWithRouter();

    expect(container).toMatchSnapshot();
  });

  test("should set input value when search param name is set", () => {
    const name = "Batman";
    renderWithRouter([`/?name=${name}`]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );

    expect(input.getAttribute("value")).toBe(name);
  });

  test("should change params when input is changed and enter is pressed", () => {
    const name = "Batman";
    const newName = "Superman";
    renderWithRouter([`/?name=${name}`]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );

    expect(input.getAttribute("value")).toBe(name);

    fireEvent.change(input, { target: { value: newName } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.getAttribute("value")).toBe(newName);
  });

  test("should change params strength when slider changes", () => {
    renderWithRouter([`/?name=Batman&active-accordion=advanced-filters`]);

    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
  });

  test("should accordion be open when active-accordion param is set", () => {
    renderWithRouter([`/?active-accordion=advanced-filters`]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("open");
  });

  test("should accordion be closed when active-accordion param is set", () => {
    renderWithRouter();

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("closed");
  });
});
