import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router";
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { router } from "./app.router";

vi.mock("@/heroes/layouts/HeroesLayout", () => ({
  HeroesLayout: () => (
    <div data-testid="heroes-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("@/heroes/pages/home/HomePage", () => ({
  HomePage: () => (
    <div data-testid="home-page">
      <Outlet />
    </div>
  ),
}));

vi.mock("@/heroes/pages/hero/HeroPage", () => ({
  HeroPage: () => {
    const { idSlug = "" } = useParams();

    return <div data-testid="hero-page">HeroPage - {idSlug}</div>;
  },
}));

vi.mock("@/heroes/pages/search/SearchPage", () => ({
  default: () => <div data-testid="search-page"></div>,
}));

describe("appRouter", () => {
  test("should be configured as expected", () => {
    expect(router.routes).toMatchSnapshot();
  });

  test("should render home page at root path", () => {
    const memRouter = createMemoryRouter(router.routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={memRouter} />);

    expect(screen.getByTestId("home-page")).toBeDefined();
  });

  test("should render hero page at /heroes/:idSlug path", () => {
    const memRouter = createMemoryRouter(router.routes, {
      initialEntries: ["/heroes/clark-kent"],
    });

    render(<RouterProvider router={memRouter} />);

    expect(screen.getByTestId("hero-page").innerHTML).toContain("clark-kent");
  });

  test("should render search page at /search path", async () => {
    const memRouter = createMemoryRouter(router.routes, {
      initialEntries: ["/search"],
    });

    render(<RouterProvider router={memRouter} />);

    expect(await screen.findByTestId("search-page")).toBeDefined();
  });

  test("should redirect to home page for unknown routes", async () => {
    const memRouter = createMemoryRouter(router.routes, {
      initialEntries: ["/pagina-rara"],
    });

    render(<RouterProvider router={memRouter} />);

    expect(screen.getByTestId("home-page")).toBeDefined();
  });
});
