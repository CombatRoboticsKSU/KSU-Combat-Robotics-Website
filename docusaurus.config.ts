import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type { Options as PresetOptions, ThemeConfig } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'KSU Combat Robotics',
  tagline: 'KSU Combat Robotics is a student organization at Kent State University that designs, builds, and competes in combat robotics events at a variety of weight classes.',
  favicon: 'img/favicon.ico',
  
  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'CombatRoboticsKSU',
  projectName: 'KSU-Combat-Robotics-Website',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        blog: {
          path: './blog',
          routeBasePath: 'blog',
          showReadingTime: true,
          //editUrl: 'https://github.com/CombatRoboticsKSU/KSU-Combat-Robotics-Website/tree/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies PresetOptions,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'wiki',
        path: './wiki',
        routeBasePath: 'wiki',
        showReadingTime: true,
        //editUrl: 'https://github.com/CombatRoboticsKSU/KSU-Combat-Robotics-Website/tree/main',
        blogSidebarTitle: 'Our Bots',
        blogSidebarCount: 'ALL',
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'personalbots',
        path: './personal_bots',
        routeBasePath: 'pbots',
        showReadingTime: true,
        //editUrl: 'https://github.com/CombatRoboticsKSU/KSU-Combat-Robotics-Website/tree/main',
        blogSidebarTitle: 'Personal Bots',
        blogSidebarCount: 'ALL',
      },
    ],
  ],

  themeConfig: {
    image: 'USINGimg/social-card.png',
    colorMode: {
      defaultMode: 'dark',
    },
    customCss: require.resolve('./src/css/custom.css'),

    navbar: {
      style: 'dark',
      title: '',
      logo: {
        alt: 'KSU Combat Robotics Logo',
        src: 'USINGimg/Logos.png',
      },
      items: [
        { to: '/sponsorsphip', label: 'Sponsors', position: 'left' },  //I know sponsorship is spelled wrong, but it works and that is the name of the page file
        { to: 'mailto:ksu.fightingrobotics@gmail.com', label: 'Contact Us', position: 'left' }, //We need to move this to something else, I like EmailJS if we can get that set up
        { to: '/wiki', label: 'KSU BOT Wiki', position: 'left' },
        { to: '/blog', label: 'Team Updates', position: 'left' },
        { to: '/leadership', label: 'Leadership', position: 'left' },
        {
          href: 'https://www.instagram.com/ksucombatrobotics/',
          label: 'Instagram Feed', 
          position: 'right',
        },
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
          title: 'About',
          items: [
            { label: 'KSU BOT Wiki', to: '/wiki' },
            { label: 'Team Updates', to: '/blog' },
            { label: 'Leadership', to: '/leadership' },
            { label: 'History', to: '/history' },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'Instagram',
              to: 'https://www.instagram.com/ksucombatrobotics/',
              logo: {
                alt: 'Instagram',
                src: 'static/USINGimg/insta.png',
              },
            },
          ],
        },
        {
          title: 'Sponsorship & Contact',
          items: [
            { label: 'Sponsors', to: '/sponsorsphip' },
            {
              label: 'Email',
              to: 'mailto:ksu.fightingrobotics@gmail.com',
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
      copyright: `KSU Combat Robotics is a registered organization of Kent State University - Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies ThemeConfig,
};

export default config;
