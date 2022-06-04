import { Fragment, useContext, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { deletePostById } from '../utils/post'
import { useRouter } from 'next/router'
import {
  PencilAltIcon,
  TrashIcon,
  EyeIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/solid'

const PostAction = ({ pid, menus, onDelete }) => {
  const [menuList, setMenuList] = useState(menus ? menus : [])

  const router = useRouter()
  if (menuList.length === 0) {
    setMenuList(['view', 'edit', 'delete'])
  }

  const wallet = useAnchorWallet()
  const _deletePost = async () => {
    if (confirm('Are you sure to delete this Post?')) {
      deletePostById(pid, wallet)
        .then((_) => {
          router.pathname === '/my-posts'
            ? router.reload(window.location.pathname)
            : router.push('/my-posts')
        })
        .catch((err) => console.error(err))
    }
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="border-0  shadow-0 inline-flex justify-center w-full rounded-md bg-white text-sm font-medium text-gray-700">
        <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100 z-10"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          <div className="py-1">
            {menuList.includes('view') ? (
              <Menu.Item>
                <div>
                  <Link href={`/posts/${pid}`}>
                    <a className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900">
                      <EyeIcon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      View
                    </a>
                  </Link>
                </div>
              </Menu.Item>
            ) : (
              ''
            )}
            {menuList.includes('edit') ? (
              <Menu.Item>
                <div>
                  <Link href={`/posts/${pid}/update`}>
                    <a className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900">
                      <PencilAltIcon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Edit
                    </a>
                  </Link>
                </div>
              </Menu.Item>
            ) : (
              ''
            )}
            {menuList.includes('delete') ? (
              <Menu.Item>
                <a
                  className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                  onClick={_deletePost}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Delete
                </a>
              </Menu.Item>
            ) : (
              ''
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default PostAction
