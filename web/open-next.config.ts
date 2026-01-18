import type { OpenNextConfig } from '@opennextjs/aws/types/open-next';

const config: OpenNextConfig = {
  default: {
    placement: "arch",
    override: {
      wrapper: "cloudflare",
      converter: "edge",
      imageOptimization: {
        width: 1920,
        height: 1080,
        quality: 80,
      },
    },
  },
  buildCommand: "npx @opennextjs/cloudflare build",
};

export default config;
