import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Sidebar for the main docs (auto-generated)
  tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],
  
  // Sidebar for the wiki section (customized title)
  wikiSidebar: [
    {
      type: 'autogenerated',
      dirName: 'wiki', // Assumes your wiki content is in the 'wiki' directory
    },
  ],
  pbotsSidebar: [
    {
      type: 'autogenerated',
      dirName: 'personal_bots', // Assumes your wiki content is in the 'wiki' directory
    },
  ],
};


export default sidebars;
