import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { getPostsByUserId } from "../utils/post"
import UserPostList from "../components/UserPostList"
import { useEffect, useState } from "react"

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

    return (<UserPostList posts={posts} />)
}