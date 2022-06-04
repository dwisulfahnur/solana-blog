import { useState, useEffect, createContext } from "react"
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { fetchUser } from "../utils/user";
import { BLOG_KEY, IDL, PROGRAM_KEY } from "../utils/program";

export const BlogContext = createContext()

export default function BlogProvider({ children }) {
    const [user, setUser] = useState()
    const wallet = useAnchorWallet()

    useEffect(() => {
        if (wallet?.publicKey) {
            fetchUser(wallet)
                .then(user => setUser(user))
                .catch(err => console.error(err))
        }
    }, [wallet])
    return (
        <BlogContext.Provider value={{ user: user, BLOG_KEY: BLOG_KEY, PROGRAM_KEY: PROGRAM_KEY, IDL: IDL }}>
            {children}
        </BlogContext.Provider>
    );
}
