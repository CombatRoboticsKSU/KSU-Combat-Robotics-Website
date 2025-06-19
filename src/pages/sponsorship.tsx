import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './sponsorship.module.css';
//need to add information about how to sponsor us (sponsorship packages, etc)
//add SKB Cases after Friday meeting (9/20/24)

// imported these to allow for a basic interactive slide show
import React, { useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    customPaging: (i) => ( // Custom dot button styling
      <button
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "gray",
          border: "none",
          cursor: "pointer",
        }}
      />
    ),
  };

  const sponsorsSlider = useRef<Slider>(null); // Auto assigns itself to the only Slider tag present

  // Add new sponsors when needed, the slider will handle the heavy lifting
  // the react-js slider is dynamic
  const sponsors = [
    { link: 'https://www.wardjet.com', src: '/USINGimg/WARDjet.jpg', alt: 'WARDjet' },
    { link: 'https://itgresa.com', src: '/USINGimg/ITGresa.jpg', alt: 'IT Gresa' },
    { link: 'https://badasspower.com', src: '/USINGimg/BadAss.jpg', alt: 'Bad-Ass Motors' },
    { link: 'https://repeat-robotics.com', src: '/USINGimg/repeat_g.jpg', alt: 'Repeat Robotics' },
    { link: 'https://sendcutsend.com', src: '/USINGimg/send_g.jpg', alt: 'SendCutSend' },
    { link: 'https://www.haascnc.com/content/ghf/en/home.html', src: '/USINGimg/haascnc.jpg', alt: 'Gene Haas Foundation' },
    { link: 'https://www.skbcases.com', src: '/USINGimg/skb.jpg', alt: 'SKB Cases' },
  ];

  return (
    <Layout
      title={`Sponsorship`}
      description="Information about current sponsors, and the way to sponsor us in the future">
      <HomepageHeader />
      <main>
        <div style={{ textAlign: 'center', padding: '10px' }}> {/* Reduced padding */}
          <p className='hero__title'>Current Sponsors:</p>
        </div>

        <div className='sponsorshipPage' style={{ textAlign: 'center', paddingBottom: '75px', position: 'relative' }}>
          <Slider {...settings} ref={sponsorsSlider}>
            {sponsors.map((sponsor, index) => (
              <div key={index}>
                <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                  <img src={sponsor.src} alt={sponsor.alt} style={{ width: "500px", margin: "0 auto" }} />
                </a>
              </div>
            ))}
          </Slider>

          <div className={styles.sliderButtons} style={{ marginTop: '30px' }}> {/* Add margin to move below dots */}
            <button
                onClick={() => sponsorsSlider.current?.slickPrev()}
                style={{
                    background: '#0078D4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '20px',
                    padding: '10px 20px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#005A9E')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#0078D4')}
            >
                Back
            </button>

            <button
                onClick={() => sponsorsSlider.current?.slickNext()}
                style={{
                    background: '#0078D4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '20px',
                    padding: '10px 20px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#005A9E')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#0078D4')}
            >
                Next
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px', fontSize: '25px' }}>
          <h2>Recent Donations!</h2>
          <div className="donor-grid">
            {['Brendan Steele', 'Sternberg Family'].map(
              (donor, index) => (
                <div key={index} className="donor-name">
                  {donor}
                </div>
              )
            )}
          </div>
        </div>

        <div className='sponsorshipPage' style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Interested in Sponsoring Our Team?</h1>
          <p>Click <u><a href="/img/Letter.pdf" target="_blank">here</a></u> for our Sponsorship Packet</p>
        </div>
      </main>
    </Layout>
  );
}
