import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'KSU Combat Robotics',
  tagline: 'KSU Combat Robotics is a student organization at Kent State University that designs, builds, and competes in combat robotics events at a variety of weight classes.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'USINGimg/social-card.png',
    navbar: {
      title: 'Home',
      logo: {
        alt: 'KSU Combat Robotics Logo',
        src: 'img/logo.svg',
      },
      items: [
        //{
         //type: 'docSidebar',
          //sidebarId: 'tutorialSidebar',
          //position: 'left',
          //label: 'Tutorial',
        //},
        {to: '/sponsorsphip', label: 'Sponsors', position: 'left'},
        {to: '/blog', label: 'Team Updates', position: 'left'},
        {to: '/instagram', label: 'Instagram Feed', position: 'left'},
        {
          href: 'https://kent.campuslabs.com/engage/organization/combatrobotics',
          label: 'KSU Engage',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'Team Updates',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'Instagram',
              href: 'https://www.instagram.com/ksucombatrobotics/',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'Email',
              href: '#',
            },
          ],  
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Kent State CSI',
              to: 'https://www.kent.edu/csi',
            },
            {
              label: 'Anti-Hazing Policy',
              to: 'https://www.kent.edu/studentconduct/anti-hazing',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} KSU Combat Robotics - Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
