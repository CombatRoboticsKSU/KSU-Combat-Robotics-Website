import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import PhotoCropper from '@site/src/components/PhotoCropper/';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"


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
        <br/>
        <div className='row'>
          <div style={{width: 'auto', margin: 'auto'}}>
            <Link to='https://forms.gle/X3zqcZmmFKBerqPz5'>
            <button style={{ fontSize: '30px', marginTop: '15px' }}>
                3lb Competition Sign Up
              </button>
            </Link>
          </div>

          <div style={{width: 'auto', margin: 'auto'}}>
            <Link to='https://docs.google.com/forms/d/e/1FAIpQLSeiaPnbH_JF4BzJubGB4r-1ZSY93uP1mn5HZaoALPcZM_qOgA/viewform?usp=header'>
              <button style={{ fontSize: '30px', marginTop: '15px' }}>
                3lb Guest Sign Up
              </button>
            </Link>
          </div>
          
          <div style={{width: 'auto', margin: 'auto'}}>
            <Link to='https://forms.gle/x3p2VbEp6bgtNYE57'>
              <button style={{ fontSize: '30px', marginTop: '15px' }}>
                3d Printing Queue
              </button>
            </Link>
          </div> 
        </div>

        <div className='row'>
          <div style={{width: '15px', margin: '15px'}}>
          </div>
        </div>
        <br/>
        <p className="hero__subtitle">We meet every Friday from 5-7pm in 120 AEB. <br/> Being a club member is <i>ONLY</i> available to KSU Students. </p>
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
        <div style={{ textAlign: 'center', padding: '25px'}}>
          <img src='/USINGimg/TEAM.png' alt='Team' width="40%" height="auto"></img>
        </div>
        <div style={{ textAlign: 'center', width: '50%', margin: 'auto'}}>
            <Link to='/history'>
              <button style={{ fontSize: '40px', padding: '20px 30px' }}>
                Club History
              </button>
            </Link>
          </div> 
        <HomepageFeatures />
        <Analytics/>
        <SpeedInsights/>
      </main>
    </Layout>
  );
}
