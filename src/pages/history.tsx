import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
      <Layout
        title={`History of KSU Combat Robotics`}
        description="Linear series of events and milestones of our club">
        <main>
          <div style={{ width: '100%', height: '100vh' }}>
            
          </div>
        </main>
      </Layout>
    );
}