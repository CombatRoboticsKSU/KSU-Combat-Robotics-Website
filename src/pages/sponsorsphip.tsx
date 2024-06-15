import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import EmailForm from '@site/src/components/EmailForm';

import styles from './index.module.css';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Our Sponsors / How to Sponsor the Team
        </Heading>
        <p className="hero__subtitle">Our generous sponsors make our bot projects & competitions possible. We would not be here without them.</p>
        <div className={styles.buttons}>
          
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const w = 500;
  return (
    <Layout
      title={`Sponsorship`}
      description="Information about current sponsors, and the way to sponsor us in the future">
      <HomepageHeader />
      <main>
        <div style={{ textAlign: 'center', padding: '20px'}}>
          <p className='hero__title'>Current Sponsors:</p>
        </div>

          <div className='sponsorshipPage'style={{ textAlign: 'center', padding: '20px'}}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><img src='/USINGimg/WARDjet.jpg' alt='WARDjet' width={w} height="auto"></img></li>
              <li><img src='/USINGimg/ITGresa.jpg' alt='IT Gresa' width={w} height="auto"></img></li>
              <li><img src='/USINGimg/BadAss.png' alt='Bad-Ass Motors' width={w} height="auto"></img></li>
              <li><img src='/USINGimg/repeat.webp' alt='Repeat Robotics' width={w} height="auto"></img></li>
              <li><img src='/USINGimg/SendCutSend.png' alt='SendCutSend' width={w} height="auto"></img></li>
            </ul>
          </div>
        

        <div style={{ textAlign: 'center', padding: '20px'}}>
            <p className='hero__title'>Interested in Sponsoring Us?</p>
            <EmailForm />
        </div>
      </main>
    </Layout>
  );
}
