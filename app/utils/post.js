import { AnchorProvider, Program } from '@project-serum/anchor'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { BLOG_KEY, IDL, PROGRAM_KEY, getConnection } from './program'
import { genUserKey } from './user'

export const getPostById = async (postId) => {
    const connection = getConnection()
    const provider = new AnchorProvider(connection, null, {})
    const program = new Program(IDL, PROGRAM_KEY, provider)
    try {
        const post = await program.account.postState.fetch(new PublicKey(postId))
        const userId = post.user.toString()
        if (userId === SystemProgram.programId.toString()) return
        return {
            id: postId,
            title: post.title,
            content: post.content,
            userId: userId,
            prePostId: post.prePostKey.toString(),
        }
    } catch (err) { }
}

export const getAllPosts = async () => {
    const connection = getConnection()
    const provider = new AnchorProvider(connection, null, {})
    const program = new Program(IDL, PROGRAM_KEY, provider)
    const blog = await program.account.blogState.fetch(BLOG_KEY)
    const latestPostId = blog.currentPostKey.toString()

    let nextPostId = latestPostId
    const posts = []
    while (!!nextPostId) {
        let post = null
        post = await getPostById(nextPostId)
        if (!post) {
            break
        }
        posts.push(post)
        nextPostId = post.prePostId
    }
    return posts
}

export const getPostsByUserId = async (publicKey) => {
    const userId = genUserKey(PROGRAM_KEY, publicKey).publicKey.toString()
    const posts = await getAllPosts()
    return posts.filter((post) => post.userId === userId)
}

export const getNextPost = async (pid) => {
    const connection = getConnection()
    const provider = new AnchorProvider(connection, null, {})
    const program = new Program(IDL, PROGRAM_KEY, provider)
    const blog = await program.account.blogState.fetch(BLOG_KEY)
    const latestPostId = blog.currentPostKey.toString()

    let prePostId = latestPostId
    while (true) {
        const post = await getPostById(prePostId, connection)
        if (!post) return
        if (post?.prePostId === pid) {
            return post
        }
        prePostId = post.prePostId
    }
}

export const deletePostById = async (pid, wallet) => {
    const connection = getConnection()
    const provider = new AnchorProvider(connection, wallet, {})
    const program = new Program(IDL, PROGRAM_KEY, provider)
    const nextPost = await getNextPost(pid)
    if (!nextPost) {
        await program.rpc.deleteLatestPost({
            accounts: {
                authority: provider.wallet.publicKey,
                postAccount: new PublicKey(pid),
                blogAccount: new PublicKey(BLOG_KEY),
            },
        })
    } else {
        await program.rpc.deletePost({
            accounts: {
                authority: provider.wallet.publicKey,
                postAccount: new PublicKey(pid),
                nextPostAccount: nextPost.id,
            },
        });
    }
}
