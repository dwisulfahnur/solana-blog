import { useContext, useEffect, useState } from "react"
import { getAllPosts, getPostById } from "../../../utils/post"
import PostAction from '../../../components/PostAction'
import { BlogContext } from "../../../context/BlogProvider"
import { genUserKey } from "../../../utils/user"

export default function PostDetail(props) {
    const [showAction, setShowAction] = useState(false)
    const { user, PROGRAM_KEY } = useContext(BlogContext)
    const post = props.post

    useEffect(() => {
        if (user?.authority) {
            const userKey = genUserKey(PROGRAM_KEY, user.authority).publicKey.toString()
            if (post?.userId === userKey) {
                setShowAction(true)
            }
        }
    }, [user])

    return (
        <div className="my-4 p-8 bg-white">
            {post ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">{post.title}</h2>
                        {showAction ? <PostAction pid={post.id} menus={["edit", "delete"]} /> : ''}
                    </div>

                    <p>{post.content}</p>
                </>
            ) : (
                <span>Post Not Found</span>
            )}
        </div >
    )
}

export async function getStaticProps({ params }) {
    const post = await getPostById(params.pid)
    return {
        props: { post: post },
        revalidate: 10,
    }
}

export async function getStaticPaths({ params }) {
    const posts = await getAllPosts()
    const paths = posts.map(post => `/posts/${post.id}`)
    return { paths: paths, fallback: true }
}