import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import EmbeddedPage from '@site/src/components/stats/';

import styles from './index.module.css';

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
      <Layout
        title={`Big-ISH Stats Page & History`}
        description="Place to further dive into the world of our bot, Big-ISH">
        <main>
          <div style={{ width: '100%', height: '100vh' }}>
            <EmbeddedPage 
              url="https://wiki.nhrl.io/wiki/index.php/Big-ish" 
              title="NHRL Big-ISH Page" 
            />
          </div>
        </main>
      </Layout>
    );
}