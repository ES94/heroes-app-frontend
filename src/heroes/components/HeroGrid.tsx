import type { Hero } from "../types/hero.interface";
import { HeroGridCard } from "./HeroGridCard";

interface Props {
  heroesList: Hero[];
}

export const HeroGrid = ({ heroesList }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {heroesList.map((hero) => (
        <HeroGridCard key={hero.slug} hero={hero} />
      ))}
    </div>
  );
};
