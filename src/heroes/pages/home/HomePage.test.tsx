import { beforeEach, describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { HomePage } from "./HomePage";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

vi.mock("@/heroes/hooks/usePaginatedHero");
const mockUsePaginatedHero = vi.mocked(usePaginatedHero);
mockUsePaginatedHero.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof usePaginatedHero>);

const queryClient = new QueryClient();
const renderHomePage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render HomePage with default values", () => {
    const { container } = renderHomePage();

    expect(container).toMatchSnapshot();
  });

  test("should call usePaginatedHero with default values", () => {
    renderHomePage();

    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should call usePaginatedHero with custom query params", () => {
    const page = 2;
    const limit = 5;
    const category = "villains";

    renderHomePage([`/?page=${page}&limit=${limit}&category=${category}`]);

    expect(mockUsePaginatedHero).toHaveBeenCalledWith(page, limit, category);
  });

  test("should call usePaginatedHero with default page and same limit on clicked tab", () => {
    const page = 2;
    const limit = 5;

    renderHomePage([`/?tab=favorites&page=${page}&limit=${limit}`]);

    const [, , , villainsTab] = screen.getAllByRole("tab");
    fireEvent.click(villainsTab);

    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, limit, "villain");
  });
});
