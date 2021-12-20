import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';

const mainFeaturedPost = {
  title: 'Simple. Secure. Reliable messaging.',
  description:"With Thiscord, you'll get fast, simple, secure messaging for free, available on phones all over the world.",
  image: 'http://localhost:3000/message.jpg',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Be yourself',
    description:
      'Set your own profile picture or choose from a wonderful selection ',
    image: 'http://localhost:3000/profile.jpeg',
    imageLabel: 'Image Text',
  },
  {
    title: 'Hang out anytime, anywhere',
    description:
      "Thiscord makes it easy and fun to stay close to your favorite people.",
      image: 'http://localhost:3000/friends.jpg',
    imageLabel: 'main image description',
  },
];


const sidebar = {
  social: [
    { name: 'GitHub', icon: GitHubIcon,link:'https://github.com/bloomkail/Web-technologies'},
    { name: 'Twitter', icon: TwitterIcon,link:'https://twitter.com/bloomkail' },
    { name: 'Instagram', icon: InstagramIcon,link:'https://www.instagram.com/clement_bouvard/?hl=fr' },
  ],
};

export default function Blog() {
  return (
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="From the firehose" />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
  );
}
