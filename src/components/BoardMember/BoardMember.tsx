import React from 'react';
import styles from './BoardMember.module.css';
import Link from '@docusaurus/Link';

// Define the props interface here
interface BoardMemberProps {
  name: string;
  imageSrc: string;
  title: string;
  stats: (string | JSX.Element)[]; // Accepts strings or JSX for inline elements like links
  bio: string;
  linkedIn: string;
}

// Define the BoardMember component, which takes props matching the BoardMemberProps interface
const BoardMember: React.FC<BoardMemberProps> = ({ name, imageSrc, title, stats, bio, linkedIn }) => {
  return (
    <div className={styles.boardMemberCard}>
      <img src={imageSrc} alt={`${name}'s photo`} className={styles.boardMemberImage} />
      <h2 className={styles.boardMemberName}>{name}</h2>
      <p className={styles.boardMemberTitle}>{title}</p>
      <ul className={styles.boardMemberStats}>
        {stats.map((stat, index) => (
          <li key={index}>{stat}</li>
        ))}
      </ul>
      <p className={styles.boardMemberBio}>{bio}</p>
      <Link to={linkedIn} className={styles.boardMemberLinkedIn} target="_blank" rel="noopener noreferrer">
        LinkedIn Profile
      </Link>
    </div>
  );
};

export default BoardMember;
