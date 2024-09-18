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
          Combat Robotics History
        </Heading>
        <p className="hero__subtitle">History of our club and bots</p>
        <div className={styles.buttons}></div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`History of KSU Combat Robotics`}
      description="Linear series of events and milestones of our club">
      <main>
        <HomepageHeader />
        <div style={{ width: '100%', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: '1500', padding: '20px' }}>

            {/* Section 1: Beginnings */}
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <img
                src="/USINGimg/team_w.JPG"
                alt="Beginnings"
                style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
              <div>
                <Heading as="h2">Beginnings (2016-2018)</Heading>
                <p>
                  The club began in 2016 when the founding members: Maddie Wilson, Chad Soukup, Dan Youst, 
                  Damon Mandideto, and Emily Perine decided to start the club under the name of “X-Bots”. They 
                  approached Professor Trent True and asked him to be the academic advisor. He accepted despite 
                  starting at Kent State the year before.
                </p>
                <p>
                  The first bots of the club were The Twins, <Link to="/wiki/SorApp">Sorcerer & Apprentice</Link>. The Twins were two seven and a half pound bots, 
                  equipped with titanium wedges that allowed for a strong control game. They were active from the start until 2019 
                  when Big-Ish was introduced. During their years, they went through a few revisions until they found success at Dayton 
                  and the National Robotics League’s competition in Pittsburg. Their final and most successful redesign was wide-body bots with 6061 
                  Aluminum wedges equipped to the front of the bots.
                </p>
              </div>
            </section>

            {/* Section 2: Big-Ish Introduction */}
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <img
                src="/USINGimg/Bigish.JPG"
                alt="Big-Ish"
                style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
              <div>
                <Heading as="h2">Big-Ish’s Introduction (2019-2022)</Heading>
                <p>
                  After a few years of the club existing, new members began to make a mark on its legacy. One notable introduction was Brendan Steele. 
                  He joined in 2018 and was the lead designer on the club’s next bot, <Link to="/wiki/bigish">Big-Ish</Link>. Big-Ish is a tall 12lb bot with a large vertical spinning 
                  blade in the middle of its two halves. The design takes heavy inspiration from the BattleBots competitor <Link to="https://hugebattlebots.com" target="_blank" rel="noopener noreferrer">HUGE</Link>. Big-Ish’s design and creation 
                  was finished in 2019, right as Covid-19 began to take its toll on the club. Because of Covid, Brendan had to finish the bot at home, 
                  and the team was rushed to finish it for its first competition.
                </p>
                <p>
                  On top of rushing Big-Ish, Covid brought up other challenges for the club. The overall member count dwindled greatly and almost 
                  led to the club disbanding. This also caused the decommissioning of The Twins. Fortunately, with the creation of Big-Ish and the 
                  determination of its members, the club prevailed. Following the lift of Covid restrictions, Big-Ish was able to properly compete 
                  at the National Havoc Robot League (NHRL). Big-Ish found success, winning three out of its five matches.
                </p>
              </div>
            </section>

            {/* Section 3: The Current Age */}
            <section style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <img
                src="/USINGimg/FlashBang.jpg"
                alt="Flash-BANG"
                style={{ width: '400px', marginRight: '20px', borderRadius: '8px' }}
              />
              <div>
                <Heading as="h2">The Current Age (2022-Present)</Heading>
                <p>
                  During these more recent years, the club went through a large expansion and gained many members. The board members reorganized 
                  and created the structural foundation of what we know the club as today. They also introduced a third bot to the club, <Link to="/wiki/flashbang">Flash-BANG</Link>. 
                  Flash-BANG is a twelve-pound bot equipped with a drum spinner. The bot was originally designed by Austin Thebner & Gregory Wenner. 
                  It has fought at NHRL a few times and has competed at the Dayton competition.
                </p>
                <p>
                  Nowadays, the club continues with two active bots, Big-Ish and Flash-BANG. With these bots, they attend competitions when possible, 
                  with the main goal being to win NHRL. They also started a tradition of hosting an all-plastic bot competition. The first competition 
                  was held in the fall of 2023 and featured 1.5lb all-plastic bots. This is being followed by a 3lb all-plastic competition in the 
                  spring of 2025.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </Layout>
  );
}