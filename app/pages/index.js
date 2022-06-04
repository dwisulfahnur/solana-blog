
import PostList from "../components/PostList";
import { getAllPosts } from "../utils/post";

const Home = (props) => {
  return <PostList posts={props.posts} />
}

export async function getStaticProps() {
  const posts = await getAllPosts()
  return {
    props: { posts: posts },
    revalidate: 10,
  }
}

export default Home
