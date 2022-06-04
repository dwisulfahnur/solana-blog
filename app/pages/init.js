import { web3, AnchorProvider, Program } from "@project-serum/anchor"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { useContext, useEffect } from "react"
import { BlogContext } from "../context/BlogProvider"
import { IDL, PROGRAM_KEY, getConnection } from "../utils/program"
import { useRouter } from "next/router"

export default function InitBlog() {
    const { BLOG_KEY } = useContext(BlogContext)
    const router = useRouter()

    const wallet = useAnchorWallet()
    const _initBlog = async () => {
        const connection = getConnection()
        const provider = new AnchorProvider(connection, wallet, {})
        const blogAccount = web3.Keypair.generate()
        const genesisPostAccount = web3.Keypair.generate()

        const program = new Program(IDL, PROGRAM_KEY, provider);
        try {
            await program.rpc.initBlog({
                accounts: {
                    authority: provider.wallet.publicKey,
                    blogAccount: blogAccount.publicKey,
                    genesisPostAccount: genesisPostAccount.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                },
                signers: [blogAccount, genesisPostAccount]
            });
        } catch (err) {
            console.error(err)
        }
        await program.account.blogState.fetch(blogAccount.publicKey);
        console.log("Blog pubkey: ", blogAccount.publicKey.toString());
    }

    useEffect(() => {
        if (BLOG_KEY) {
            router.push('/')
        }
    })
    return (
        <div className="bg-white my-4 shadow rounded-lg p-8">
            {BLOG_KEY ? <span>BLOG_KEY: {BLOG_KEY}</span> : (
                <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => _initBlog()}> Initialize Blog ...</button>
            )}

        </div >
    )
}