import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AnchorProvider, Program, web3 } from '@project-serum/anchor'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { getConnection } from '../../../utils/program'
import { getPostById } from '../../../utils/post'
import { BlogContext } from '../../../context/BlogProvider'
import ErrorAlert from '../../../components/ErrorAlert'
import Link from 'next/link'

export default function UpdatePost() {
    const router = useRouter()
    const [post, setPost] = useState()
    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const [errors, setErrors] = useState()
    const [byteLength, setByteLength] = useState()

    const { user, PROGRAM_KEY, IDL } = useContext(BlogContext)
    const wallet = useAnchorWallet()

    useEffect(() => {
        const pid = router.query?.pid
        if (pid) {
            getPostById(pid).then(_post => {
                setPost(_post)
                setTitle(_post.title)
                setContent(_post.content)
            }).catch(err => console.error(err))
        }
    }, [router])

    useEffect(() => {
        if (title && content) {
            setByteLength(Buffer.byteLength(title + content))
        }
    }, [title + content])

    const _updatePost = async () => {
        let _errors = Object()
        if (title.length === 0) _errors.title = "This field is required"
        if (content.length === 0) _errors.content = "This field is required"
        if (byteLength > 500) _errors.message = "The Title and Content length must be less or equal than 500 Chars"

        setErrors(_errors)
        let error = false
        Object.keys(_errors).forEach(key => {
            if (_errors[key]) error = true
        });
        if (error) return

        const connection = getConnection()
        const provider = new AnchorProvider(connection, wallet, {})
        const program = new Program(IDL, PROGRAM_KEY, provider);
        program.rpc.updatePost(title, content, {
            accounts: {
                authority: provider.wallet.publicKey,
                postAccount: new web3.PublicKey(post.id),
            },
        }).then(res => {
            console.log(res)
            router.push(`/posts/${post.id}`)
        }).catch(err => {
            console.error(err)
            setErrors(err.toString())
        })
    }

    return (<div className="my-4 p-8 bg-white">
        {post ? (
            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                {user ? (
                    <>
                        <div className="sm:grid sm:grid-cols-4">
                            <div className="sm:col-start-2 sm:col-span-2">
                                <h1 className="text-2xl font-semibold">Update Post</h1>
                            </div>
                        </div>
                        {errors && errors.message ? (
                            <div className="sm:grid sm:grid-cols-4 sm:gap-4">
                                <div className="sm:col-start-2 sm:col-span-2">
                                    <ErrorAlert message={errors && errors.message} handleClose={() => setErrors({ ...errors, message: null })} />
                                </div>
                            </div>
                        ) : ''}
                        <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 text-right">
                                Title
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        value={title} onChange={e => setTitle(e.target.value)}
                                        placeholder="Title"
                                        type="text"
                                        name="title"
                                        id="title"
                                        className={`flex-1 block w-full min-w-0 rounded sm:text-sm border-gray-300 ${errors?.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                                    />
                                </div>
                                {errors && errors.title ? <div className="text-sm text-red-500 mt-1">{errors && errors.title}</div> : ''}
                            </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:pt-2">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 text-right">
                                Content Body
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="flex rounded-md shadow-sm mb-1">
                                    <textarea
                                        value={content} onChange={e => setContent(e.target.value)}
                                        placeholder="Type the content here"
                                        type="text"
                                        name="content"
                                        id="content"
                                        rows="6"
                                        className={`flex-1 block w-full min-w-0 rounded sm:text-sm border-gray-300 ${errors?.content ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                                    ></textarea>
                                </div>
                                {errors && errors.content ? <div className="text-sm text-red-500">{errors && errors.content}</div> : ''}
                                <div className="text-sm text-gray-500 mt-4"><span>Length: {Buffer.byteLength(title + content)} bytes</span></div>
                            </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start">
                            <div></div>
                            <button
                                onClick={() => _updatePost()}
                                type="button"
                                className="inline-flex items-center content-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save
                            </button>
                        </div>
                    </>) : (
                    <div className="sm:grid sm:grid-cols-4">
                        <div className="sm:col-start-2 sm:col-span-2">
                            <span className="text-1xl">You are not registered yet, please <Link href="/signup"><a href="" className="cursor-pointer text-indigo-500">SignUp</a></Link> to create a post in this Platform</span>
                        </div>
                    </div>
                )}
            </div>
        ) : 'Post Not Found'}

    </div>
    )
}
