
import PostList from "../components/PostList";
import { getAllPosts } from "../utils/post";
import Head from 'next/head'

const Home = (props) => {
  return (
    <>
      <Head>
        <title>Decentralized Blog</title>
        <meta property="og:title" content="Decentralized Blog" key="title" />
      </Head>
      <PostList posts={props.posts} />
    </>

  )
}

export async function getStaticProps() {
  const posts = await getAllPosts()
  return {
    props: { posts: posts },
    revalidate: 10,
  }
}

export default Home
