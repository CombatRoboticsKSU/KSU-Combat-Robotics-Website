const { themes: prismThemes } = require('prism-react-renderer');
const dotenv = require('dotenv');
dotenv.config();

console.log('=== DOCUSAURUS CONFIG IS RUNNING ===');

module.exports = {
  title: 'KSU Combat Robotics',
  tagline: 'KSU Combat Robotics is a student organization at Kent State University that designs, builds, and competes in combat robotics events at a variety of weight classes.',
  favicon: 'img/favicon.ico',
  
  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'CombatRoboticsKSU',
  projectName: 'KSU-Combat-Robotics-Website',

  onBrokenLinks: 'ignore',
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
      },
      theme: {
        customCss: require.resolve('./src/css/custom.css'),
      },
      sitemap: false, // Disable the default sitemap plugin included in the preset
    },
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
    [
      '@docusaurus/plugin-sitemap',
      {
        changefreq: 'weekly', // Frequency of page changes
        priority: 0.5, // Default priority for pages
        ignorePatterns: ['/tags/**'], // Optional: Ignore certain patterns
        filename: 'sitemap.xml', // Name of the generated sitemap file
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
        { to: '/sponsorship', label: 'Sponsors', position: 'left' },
        /*
          { to: 'mailto:ksu.fightingrobotics@gmail.com', label: 'Contact Us', position: 'left' }, //We need to move this to something else, I like EmailJS if we can get that set up
        */
        { to: '/wiki', label: 'KSU BOT Wiki', position: 'left' },
        {
          type: 'dropdown',
          label: 'Updates',
          position: 'left',
          items: [
            { to: '/blog', label: 'Team Updates' },
            { to: '/publicity', label: 'Media Coverage' }
          ]
        },
        { to: '/leadership', label: 'Leadership', position: 'left' },
        { to: '/projects', label: 'Projects', position: 'left' },
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
            { label: 'Team Updates', to: '/blog' },
            { label: 'Leadership', to: '/leadership' },
            { label: 'History', to: '/history' },
            { label: 'Project Status', to: '/projects' },
          ],
        },
        {
          title: 'Our Bots',
          items: [
            { label: 'Personal Bots', to: '/pbots' },
            { label: 'Club Owned Bots', to: '/wiki' },
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
            { label: 'Sponsors', to: '/sponsorship' },
            {
              label: 'Email', // Note : I like EmailJS if we can get that set up
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
  },

  customFields: {
    backendUrl:
      process.env.NEXT_PUBLIC_BACKEND_URL
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : '',
    frontendUrl:
      process.env.NEXT_PUBLIC_FRONTEND_URL
        ? process.env.NEXT_PUBLIC_FRONTEND_URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : '',
  },
};
