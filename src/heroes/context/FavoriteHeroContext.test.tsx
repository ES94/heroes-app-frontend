import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: "1",
  name: "batman",
} as Hero;

const TestComponent = () => {
  const { favorites, favoritesCount, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoritesCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>
      <button data-testid="toggle-fav" onClick={() => toggleFavorite(mockHero)}>
        Toggle
      </button>
      <div data-testid="is-fav">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

const renderContextTestComponent = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

describe("FavoriteHeroContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should initialize with default values", () => {
    renderContextTestComponent();

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
  });

  test("should add hero to favorites when toggle favorite is called with new hero", () => {
    renderContextTestComponent();

    const button = screen.getByTestId("toggle-fav");
    fireEvent.click(button);

    expect(screen.getByTestId("is-fav").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");
  });

  test("should remove hero from favorites when toggle favorite is called", () => {
    localStorage.setItem("favorites", JSON.stringify([mockHero]));

    renderContextTestComponent();
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-fav").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");

    const button = screen.getByTestId("toggle-fav");
    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-fav").textContent).toBe("false");
    expect(screen.queryByTestId("hero-1")).toBeNull();
  });
});
