import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures/index';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
        In the News
        </Heading>
        <p className="hero__subtitle">History of Media-Coverage</p>
        <div className={styles.buttons}></div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`In the News`}
      description="Linear series media-coverage of our club">
      <main>
        <HomepageHeader />

       {/* Embedded Local Video */}
        {/*<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
          <video width="640" height="360" controls>
            <source src="/USINGimg/Xbots Promo Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>*/}

        <div style={{ width: '100%', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: '1500', padding: '20px' }}>

            {/*
              NEWS items go in this div
            */}
            <a href='https://www.kent.edu/cae/news/kent-state-xbots-nhrl-robot-combat-league'>
              <img
                  src="/USINGimg/xbots_team.jpg"
                  alt="Kent State XBots at the NHRL Robot Combat League"
                  style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
            </a>
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <Heading as="h2">Kent State XBots at the NHRL Robot Combat League (May 1, 2022)</Heading>
                <p>
                In March, they competed at the Norwalk Havoc Robot League (NHRL) Robot Combat League in Norwalk, Connecticut. Kent State XBots were able to fight their way to the Semi-Finals, which is something worth bragging about!
                </p>
              </div>
            </section>

            <a href='https://www.kent.edu/cae/news/combat-robotics-team-finds-success-first-nhrl-season'>
              <img
                  src="/USINGimg/successInFirstNHRLSeason.png"
                  alt="Success in first NHRL Season"
                  style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
            </a>
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <Heading as="h2">Combat Robotics Team finds Success in first NHRL Season (February 13, 2023)</Heading>
                <p>
                On November 12th, 2022, the Kent State University Combat Robotics Team placed 3rd at a Norwalk Havoc Robotics League (NHRL) competition, qualifying for the 2022 Championships in December 2023.
                </p>
              </div>
            </section>

            <a href='https://kentstater.com/95378/uncategorized/combat-robotics-team-continues-to-find-success/'>
              <img
                  src="/USINGimg/FlashBang.jpg"
                  alt="Success Continues at NHRL"
                  style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
            </a>
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <Heading as="h2">Combat Robotics Team Continues to find Success (March 29, 2023)</Heading>
                <p>
                At the start of the semester the members of the Combat Robotics team weren’t sure whether they would be able to compete at any more events because of a lack of funding, but thanks to a generous donation from the NHRL, the team has continued competing.
                </p>
              </div>
            </section>

            <a href='https://www.kent.edu/cae/news/combat-robotics-team-makes-2023-nhrl-season-debut'>
              <img
                  src="/USINGimg/Flashbang_w_Minibot.jpg"
                  alt="NHRL 2023 Season-Debut"
                  style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
            </a>
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <Heading as="h2">Combat Robotics Team Makes 2023 NHRL Season Debut (April 20, 2023)</Heading>
                <p>
                At the start of the semester the members of the Combat Robotics team weren’t sure whether they would be able to compete at any more events because of a lack of funding, but thanks to a generous donation from the NHRL, the team has continued competing.
                </p>
              </div>
            </section>

            <a href='https://www.kent.edu/cae/news/combat-robotics-team-takes-robotics-great-nhrl-competition'>
              <img
                  src="/USINGimg/NHRL_June_Team.jpg"
                  alt="Combat Robotics takes on the Great NHRL Competition"
                  style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
            </a>
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <Heading as="h2">Combat Robotics Team Takes on Robotics Great at NHRL Competition (July 13, 2023)</Heading>
                <p>
                In June, the Kent State University Combat Robotics Team took on another weekend of fierce competition in the National Havoc Robotics League. After making some key modifications to their bot Flash-BANG, which made its NHRL debut in March, the team was prepared to face their biggest challenge yet.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}