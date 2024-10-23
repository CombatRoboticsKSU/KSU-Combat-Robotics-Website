import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures/index';
import Heading from '@theme/Heading';
import EmailForm from '@site/src/components/EmailForm/index';

import styles from './index.module.css';
//need to add information about how to sponsor us (sponsorship packages, etc)
//add SKB Cases after Friday meeting (9/20/24)

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Our Sponsors
        </Heading>
        <p className="hero__subtitle">Our generous sponsors make our bot projects & competitions possible. We would not be here without them.</p>
        <div className={styles.buttons}>

        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const w = 500;
  return (
    <Layout
      title={`Sponsorship`}
      description="Information about current sponsors, and the way to sponsor us in the future">
      <HomepageHeader />
      <main>
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <p className='hero__title'>Current Sponsors:</p>
        </div>

        <div className='sponsorshipPage' style={{ textAlign: 'center'}}>
          <ul style={{ listStyleType: 'none', padding: '0px' }}>
            <li><a href='https://www.wardjet.com'                           target="_blank"><img src='/USINGimg/WARDjet.jpg'  alt='WARDjet'               width={w} height="auto"></img></a></li>
            <li><a href='https://itgresa.com'                               target="_blank"><img src='/USINGimg/ITGresa.jpg'  alt='IT Gresa'              width={w} height="auto"></img></a></li>
            <li><a href='https://badasspower.com'                           target="_blank"><img src='/USINGimg/BadAss.jpg'   alt='Bad-Ass Motors'        width={w} height="auto"></img></a></li>
            <li><a href='https://repeat-robotics.com'                       target="_blank"><img src='/USINGimg/repeat_g.jpg' alt='Repeat Robotics'       width={w} height="auto"></img></a></li>
            <li><a href='https://sendcutsend.com'                           target="_blank"><img src='/USINGimg/send_g.jpg'   alt='SendCutSend'           width={w} height="auto"></img></a></li>
            <li><a href='https://www.haascnc.com/content/ghf/en/home.html'  target="_blank"><img src='/USINGimg/haascnc.jpg'  alt='Gene Haas Foundation'  width={w} height="auto"></img></a></li>
            <li><a href='https://www.skbcases.com'                          target="_blank"><img src='/USINGimg/skb.jpg'      alt='SKB Cases'             width={w} height="auto"></img></a></li>
          </ul>
        </div>

        <div className='sponsorshipPage' style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Interested in Sponsoring Our Team?</h1>
          <p>Click <u><a href="/img/Letter.pdf" target="_blank">here</a></u> for our Sponsorship Packet</p>
        </div>

      </main>
    </Layout>
  );
}