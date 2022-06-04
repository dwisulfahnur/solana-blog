import { useContext, useEffect, useState } from "react"
import { getAllPosts, getPostById } from "../../../utils/post"
import PostAction from '../../../components/PostAction'
import { BlogContext } from "../../../context/BlogProvider"
import { genUserKey } from "../../../utils/user"
import Head from "next/head"

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
        <>
            <Head>
                <title>{post.title}</title>
                <meta property="og:title" content={post.title} key="title" />
            </Head>
            <div className="mt-4 p-8 bg-white rounded-t-lg rounded-b-0 shadow">
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
            </div>
            <div className="mb-4 px-8 py-4 bg-white rounded-b-lg rounded-t-0 shadow border-t">
                {/* <a className="border rounded px-4 py-2"><img src="/solscan.png" />Proof of Post</a> */}
                <div>
                    <a className="flex items-center w-fit border rounded px-2 py-1 bg-indigo-700 hover:bg-indigo-800" target="_blank" href={`https://explorer.solana.com/address/${post.id}?cluster=${process.env.NEXT_PUBLIC_SOLANA_CLUSTER}`}>
                        <img src="/solana-explorer.png" className="inline mr-2 h-5" /><span className="text-lg font-semibold text-white">Proof of Post</span>
                    </a>
                </div>
            </div>
        </>
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