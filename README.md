# KSU Combat Robotics Website
=========================

Welcome to the source code of the official website for Kent State University's Combat Robotics team, proudly powered by Vercel.

## About Us
The Combat Robotics club at Kent State University is dedicated to developing innovative robotics projects, with a focus on combat sports robots designed to compete in various tournaments and events. Our website serves as an online hub for sharing information about our team's activities, achievements, and upcoming events.

## Features of the Website
- Responsive Design: The website features a modern responsive design that adapts seamlessly to different screen sizes, ensuring optimal viewing experiences across desktops, tablets, and mobile devices.
- Team Information: Learn more about our club's history, leadership team, and members through comprehensive profiles and bios.

## Contributing to this Repository
If you're interested in contributing code changes or enhancements to this website's source code, please follow these guidelines:

- Fork this repository by clicking on the "Fork" button at the top right corner.
- Clone your forked repository using git clone command.
- Create a new branch for any proposed changes and submit them as pull requests.

Note: All contributions to this project must comply with the terms of the GNU General Public License 3.0 (GPLv3). Please ensure that you understand and agree to these licensing terms before submitting your code.

## Getting Started
To set up a local development environment, ensure you have Node.js installed on your machine. Then:

- Install the required dependencies by running `npm install`.
- Start the application using `npm start`.
- This will launch the website locally at `http://localhost:3000`.

### Working on /login page
- Go to @src/pages/login.tsx and add `redirectTo='http://localhost:3000/login'`. For any other domains redirect them there
- Go to @src/pages/login.tsx and switch `fetch('/api/edge-config')` to `fetch('http://localhost:4000/api/edge-config')`
- Go to @site/supabaseClient.js and switch `fetch('api/env')` to `fetch('http://localhost:4000/api/env')`
- run `npm run run-api`
> [!WARNING]
> Make sure to undo @src/pages/login.tsx @site/supabaseClient.js and before publishing to github

## License
This project is licensed under the GNU General Public License 2.0 (GPLv2).

## Credits
This project uses a combination of open-source libraries and templates, including React & Docusaurus.

If you have any issues or concerns regarding this repository, please reach out to us via email.

Note: The image attached is used as a reference for the front page design.
