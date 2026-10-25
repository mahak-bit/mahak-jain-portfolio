import { HomeWork } from '@/components/home/HomeWork';
import { Intro } from '@/components/Intro';
import { toExhibitProject } from '@/components/exhibition/types';
import { projects } from '@/data/projects';

/**
 * The home page: the first screen, then the work — a 3D walk through the
 * projects where the device allows it, a plain list where it doesn't. Everything
 * else lives at /about, /contact and /archive.
 */
export default function HomePage() {
  return (
    <>
      <Intro />
      <HomeWork projects={projects.map(toExhibitProject)} />
    </>
  );
}
