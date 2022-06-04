import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { getPostsByUserId } from "../utils/post"
import { useEffect, useState } from "react"
import UserPostList from "../components/UserPostList"
import Head from "next/head"

export default function MyPosts() {
    const [posts, setPosts] = useState()
    const wallet = useAnchorWallet()
    useEffect(() => {
        if (wallet?.publicKey) {
            getPostsByUserId(wallet.publicKey.toString())
                .then((posts) => setPosts(posts))
                .catch((e) => console.error(e))
        }
    }, [wallet])

    return (
        <>
            <Head>
                <title>My Posts</title>
                <meta property="og:title" content="Decentralized Blog" key="title" />
            </Head>
            <UserPostList posts={posts} />
        </>

    )
}