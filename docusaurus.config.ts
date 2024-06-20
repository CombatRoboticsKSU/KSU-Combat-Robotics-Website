import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'KSU Combat Robotics',
  tagline: 'KSU Combat Robotics is a student organization at Kent State University that designs, builds, and competes in combat robotics events at a variety of weight classes.',
  favicon: 'img/favicon.ico',
  
  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'CombatRoboticsKSU', // Usually your GitHub org/user name.
  projectName: 'KSU-Combat-Robotics-Website', // Usually your repo name.

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
        blog: {
          path: './blog', // Path to your main blog directory
          routeBasePath: 'blog', // URL route for your main blog
          showReadingTime: true,
          //editUrl: 'https://github.com/CombatRoboticsKSU/KSU-Combat-Robotics-Website/tree/main',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'wiki',
        path: './wiki', // Path to your wiki directory
        routeBasePath: 'wiki', // URL route for your wiki
        showReadingTime: true,
        //editUrl: 'https://github.com/CombatRoboticsKSU/KSU-Combat-Robotics-Website/tree/main',
        blogSidebarTitle: 'Our Bots', // Custom title for the wiki sidebar
        blogSidebarCount: 'ALL',
      },
    ],
  ],

  themeConfig: {
    image: 'USINGimg/social-card.png',
    colorMode: {
      defaultMode: 'dark'
    },

    navbar: {
      style: 'dark',
      title: 'Home',
      logo: {
        alt: 'KSU Combat Robotics Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/sponsorsphip', label: 'Sponsors', position: 'left' },
        { to: '/contact', label: 'Contact Us', position: 'left' },
        { to: '/wiki', label: 'KSU BOT Wiki', position: 'left' },
        { to: '/blog', label: 'Team Updates', position: 'left' },
        { href: 'https://www.instagram.com/ksucombatrobotics/',
          label: 'Instagram Feed', 
          position: 'right' },
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
            { label: 'Home', to: '/' },
            { label: 'Team Updates', to: '/blog' },
            { label: 'Sponsors', to: '/sponsorsphip' },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'Instagram',
              href: 'https://www.instagram.com/ksucombatrobotics/',
              logo: {
                alt: 'Instagram',
                src: 'static/USINGimg/insta.png', // Path to your Instagram logo file
              },
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'Email',
              href: 'mailto:ksu.fightingrobotics@gmail.com',
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
