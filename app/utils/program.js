import { Connection, PublicKey } from '@solana/web3.js'
import idl from '../idl.json'

export const IDL = idl
export const PROGRAM_KEY = new PublicKey(idl.metadata.address)
export const BLOG_KEY = process.env.NEXT_PUBLIC_BLOG_KEY

export function getConnection() {
    let rpc_endpoint = "http://127.0.0.1:8899"
    if (process.env.NEXT_PUBLIC_SOLANA_CLUSTER === 'devnet') {
        rpc_endpoint = "https://api.devnet.solana.com"
    }
    return new Connection(
        rpc_endpoint,
        "confirmed",
    )
}