import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import BoardMember from '@site/src/components/BoardMember/BoardMember';

import styles from './index.module.css';
//need to add information about how to sponsor us (sponsorship packages, etc)
//add SKB Cases after Friday meeting (9/20/24)

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Current Leadership
        </Heading>
        <div className={styles.buttons}>

        </div>
      </div>
    </header>
  );
}

function HomepageHeader2() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header style={{textAlign: 'center'}} >
      <div className="container">
        <Heading as="h1" >
          Former Leadership
        </Heading>
        <div className={styles.buttons}>

        </div>
      </div>
    </header>
  );
}

// Introducting the TWATS board XD
export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
      <Layout
        title={`Home`}
        description="Landing page for KSU Combat Robotics domain">
        <main>
          <HomepageHeader />
          <div className={styles['board-members-container']}>
            <BoardMember
              name="Austin Sternberg"
              imageSrc="/USINGimg/BOARD25/austin.JPG"
              title="President"
              stats={["Years in Robotics: 9.5", 
                "Club Member: 3 years", 
                "Major: Computer Science",
                "Fun Fact: I built this website!"
              ]}
              bio="Austin is the club's President and has been a member for 3 years. He has been in combat robotics since 6th grade and is slowly developing his own 12lb bot."
            />
            <BoardMember
              name="Ian Rohrbacher"
              imageSrc="/USINGimg/BOARD25/ian.JPG"
              title="Administrator"
              stats={[
                "Years in Robotics: 6",
                "Club Member: 2 years",
                "Major: Computer Science",
                <>Personal Website: <Link to="https://web.cs.kent.edu/~irohrbac/">Home</Link>.</>
              ]}
              bio={[
                "Ian is the club's Administration lead. They has done FIRST Robotics Competition throughout high school and is still involved with FIRST, mentoring their high school team and volunteering at events, and is now a part of Kent State's VexU team. They are the current driver of Big-ish"
              ]}
              />
            <BoardMember
              name="Sean Burns"
              imageSrc="/USINGimg/BOARD25/sean.JPG"
              title="Treasurer"
              stats={["Years in Robotics: 2", 
                "Club Member: 2 years", 
                "Major: Communications"
              ]}
              bio="Sean is the club's Treasurer and has been a member for 2 years."
            />
            <BoardMember
              name="Adam Turniski"
              imageSrc="/USINGimg/BOARD25/adam.JPG"
              title="Project Manager"
              stats={["Years in Robotics: 2", 
                "Club Member: 2 years", "Major: Mechatronics Engineering",
                "Fun Fact: I like to fish and cook and I am also apart of the AFS chapter at Kent."
              ]}
              bio="Adam is an aspiring engineer from northeast Ohio that loves automation and robotics"
            />
          </div>
          <br/>
          <HomepageHeader2 />
          <div className={styles['board-members-container']}>
            <BoardMember
              name="Austin Thebner"
              imageSrc="/USINGimg/austint.jpg"
              title="President"
              stats={["Years in Robotic: 4 with no previous experience", 
                "Club Member: 4 years", 
                "Major: Mechanical engineering technology BA & Engineering technology ma",
                "Fun Fact: I am colorblind",
                "Fomerly: President-2024, Vice President-2023",
                <>Personal Bot: <Link to="/pbots/pnuematador">PNUEMATADOR</Link></>
              ]}
              bio="Austin lead the club for 3 years and specializes in mechanical design and strategy."
            />
          </div>
        </main>
      </Layout>
    );
  }
