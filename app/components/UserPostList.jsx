import Link from 'next/link'
import PostAction from './PostAction'

const PostList = ({ posts }) => {
  return (
    <ul>
      {posts
        ? posts.map(({ id, title }) => {
            return (
              <li
                key={id}
                className="grid grid-cols-4 rounded my-4 bg-white px-8 py-3 align-middle"
              >
                <div className="col-start-1 col-end-4 truncate">
                  <Link href={`/posts/${id}`}>
                    <a className="font-semibold">{title}</a>
                  </Link>
                </div>
                <div className="col-start-4 col-end-5 text-right block justify-end">
                  <PostAction pid={id} />
                </div>
              </li>
            )
          })
        : ''}
    </ul>
  )
}

export default PostList
