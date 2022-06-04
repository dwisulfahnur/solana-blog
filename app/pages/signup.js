import { AnchorProvider, Program } from "@project-serum/anchor"
import { SystemProgram } from "@solana/web3.js"
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useState } from "react"
import { useRouter } from "next/router"
import { IDL, PROGRAM_KEY } from "../utils/program"
import { genUserKey } from "../utils/user"
import ErrorAlert from "../components/ErrorAlert"

const SignUp = () => {
    const [name, setName] = useState("")
    const [avatar, setAvatar] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()
    const wallet = useAnchorWallet()
    const { connection } = useConnection()

    const _signup = async () => {
        if (!name || !avatar) {
            setError("Fill the form first!")
            return
        }
        const provider = new AnchorProvider(connection, wallet, {})
        const program = new Program(IDL, PROGRAM_KEY, provider)
        const userAccount = genUserKey(PROGRAM_KEY, wallet.publicKey)

        program.rpc.signupUser(name, avatar, {
            accounts: {
                authority: provider.wallet.publicKey,
                userAccount: userAccount.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [userAccount]
        }).then(user => {
            router.push("/")
        }).catch(err => setError(err.toString()))
    }

    return (
        <div className="my-4 shadow-md rounded-lg bg-white p-8">
            {wallet ? (
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        {error ? (
                            <div className="sm:col-start-2 sm:col-end-4 sm:col-span-2">
                                <ErrorAlert message={error} handleClose={() => { setError("") }} />
                            </div>
                        ) : ''}
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Name
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <div className="flex rounded-md shadow-sm">
                                <input
                                    value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Name"
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Avatar
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <div className="flex rounded-md shadow-sm">
                                <input
                                    value={avatar} onChange={e => setAvatar(e.target.value)}
                                    placeholder="Avatar URL"
                                    type="text"
                                    name="avatar"
                                    id="avatar"
                                    autoComplete="avatar"
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded sm:text-sm border-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <div></div>
                        <button
                            onClick={_signup}
                            type="button"
                            className="inline-flex items-center content-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            SignUp
                        </button>
                    </div>
                </div>) : (
                <div>
                    <span className="text-sm">Not Connected</span>
                </div>
            )}
        </div>
    )
}

export default SignUp