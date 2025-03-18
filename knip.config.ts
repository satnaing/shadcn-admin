import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['src/components/ui/**', 'src/routeTree.gen.ts'],
  ignoreDependencies: ['tailwindcss', 'tailwindcss-animate'],
};

export default config;