import fs from 'fs';
import path from 'path';
import { LoadContext, Plugin, PluginContentLoadedActions } from '@docusaurus/types';

export default function wikiPlugin(context: LoadContext, options: {}): Plugin<void> {
  return {
    name: 'docusaurus-plugin-wiki',

    async contentLoaded({ actions }: { actions: PluginContentLoadedActions }) {
      const { addRoute } = actions;
      const wikiDir = path.resolve(__dirname, '../wiki');
      const files = fs.readdirSync(wikiDir);

      files.forEach(file => {
        const fileName = file.replace(/\.md$/, '');
        addRoute({
          path: `/wiki/${fileName}`,
          component: '@theme/MDXPage',
          exact: true,
          modules: {
            content: path.join(wikiDir, file),
          },
        });
      });
    },
  };
}
