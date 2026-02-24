import { describe, expect, test } from "vitest";
import { heroApi } from "./hero.api";

const BASE_URL = import.meta.env.VITE_API_URL;

describe("HeroApi", () => {
  test("should be configure pointing to the testing server", () => {
    const port = "3001";

    expect(heroApi).toBeDefined();
    expect(BASE_URL).toContain(port);
    expect(heroApi.defaults.baseURL).toBe(`${BASE_URL}/api/heroes`);
  });
});
