import type { PropsWithChildren } from "react";

import { describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { fireEvent, render, screen } from "@testing-library/react";

import { CustomPagination } from "./CustomPagination";

vi.mock("../ui/button", () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe("CustomPagination", () => {
  test("should render component with default values", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    expect(screen.getByText("Anterior")).toBeDefined();
    expect(screen.getByText("Siguiente")).toBeDefined();
  });

  test("should disable previous button when page is 1", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    const prevButton = screen.getByText("Anterior");

    expect(prevButton).toBeDefined();
    expect(prevButton.getAttributeNames()).toContain("disabled");
  });

  test("should disable next button when page is the last one", () => {
    const pages = 5;
    renderWithRouter(<CustomPagination totalPages={pages} />, [
      `/?page=${pages}`,
    ]);

    const nextButton = screen.getByText("Siguiente");

    expect(nextButton).toBeDefined();
    expect(nextButton.getAttributeNames()).toContain("disabled");
  });

  test("should disable page button when page is the very same one", () => {
    const pages = 5;
    const currentPage = 3;

    renderWithRouter(<CustomPagination totalPages={pages} />, [
      `/?page=${currentPage}`,
    ]);

    const pageButton = screen.getByText("3");

    expect(pageButton).toBeDefined();
    expect(pageButton.getAttribute("variant")).toContain("default");
  });

  test("should change page when click on number button", () => {
    // Instanciar paginador
    const pages = 5;
    const currentPage = 3;
    renderWithRouter(<CustomPagination totalPages={pages} />, [
      `/?page=${currentPage}`,
    ]);

    // Recuperar y verificar btonoes de prueba
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");
    expect(button2).toBeDefined();
    expect(button3).toBeDefined();
    expect(button2.getAttribute("variant")).toContain("outline");
    expect(button3.getAttribute("variant")).toContain("default");

    // Disparar evento y verificar cambio
    fireEvent.click(button2);
    expect(button2.getAttribute("variant")).toContain("default");
    expect(button3.getAttribute("variant")).toContain("outline");
  });
});
