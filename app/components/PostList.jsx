import Link from 'next/link'

export default function PostList(props) {
  return (
    <div>
      {props.posts
        ? props.posts.map(({ id, title, content, userId }) => {
            return (
              <div key={id} className="boarder rounded my-4 bg-white p-8">
                <Link href={`/posts/${id}`}>
                  <h2 className="font-semibold text-2xl mb-4 text-gray-600 cursor-pointer">
                    {title}
                  </h2>
                </Link>
                <p className="mb-2">{content}</p>
              </div>
            )
          })
        : ''}
    </div>
  )
}
