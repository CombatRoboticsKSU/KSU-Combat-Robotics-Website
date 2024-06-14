import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

const InstagramPage: React.FC = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink&access_token=YOUR_INSTAGRAM_ACCESS_TOKEN`
        );
        const data = await response.json();
        setPosts(data.data);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
      }
    };

    fetchInstagramPosts();
  }, []);

  return (
    <Layout title="Instagram Feed">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Our Instagram Feed</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {posts.map((post: any) => (
            <div key={post.id} style={{ margin: '10px' }}>
              <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                <img src={post.media_url} alt={post.caption} style={{ maxWidth: '300px', maxHeight: '300px' }} />
              </a>
              <p>{post.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default InstagramPage;
