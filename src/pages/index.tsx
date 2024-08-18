import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import PhotoCropper from '@site/src/components/PhotoCropper/';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
        <img src='./USINGimg/longlogo.png'></img>
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className='row'>
          <div style={{ textAlign: 'center', width: '50%', margin: 'auto'}}>
            <Link to="/history">
              <button style={{ fontSize: '30px', padding: '20px 30px' }}>
                Club History
              </button>
            </Link>
          </div>
        </div>
        <br/>
        <br/>
        <p className="hero__subtitle">We meet every Friday from 4-7pm in 120 AEB. <br/> Being a club member is <i>ONLY</i> available to KSU Students. </p>
        {/*<p>*Quick Note: This site is best viewed under the dark mode settings. Please click the little sun icon in the top right corner.</p>*/}
      </div>
    </header>
      
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Landing page for KSU Combat Robotics domain">
      <HomepageHeader />
      <main>
        <PhotoCropper src="USINGimg/TEAM.png" height={1700} />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
