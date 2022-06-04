import Link from 'next/link'
import { Disclosure } from '@headlessui/react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useContext } from 'react'
import { BlogContext } from '../context/BlogProvider'

export default function Navbar() {
  const { connected } = useWallet()
  const { user } = useContext(BlogContext)
  return (
    <Disclosure as="nav" className="bg-white shadow rounded-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 md:py-2">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-semibold text-indigo-600 cursor-pointer truncate">
                  Decentralized Blog
                </h1>
              </Link>
            </div>
            {user ? (
              <>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link href="/create-post">
                    <span className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-0 text-sm font-medium cursor-pointer">
                      Create Post
                    </span>
                  </Link>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link href="/my-posts">
                    <span className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-0 text-sm font-medium cursor-pointer">
                      My Post
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              ''
            )}
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="m-top-1 flex gap-4">
                <div className="flex items-center contents-center">
                  {connected ? (
                    user ? (
                      <div className="flex items-center contents-center">
                        {user.avatar ? (
                          <img
                            className="w-10 rounded-full border mr-1"
                            src={user.avatar}
                            alt={user.name}
                          ></img>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      <Link href="/signup">SignUp</Link>
                    )
                  ) : (
                    ''
                  )}
                </div>
                <WalletMultiButton className="relative inline-flex items-center h-10 px-2 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
