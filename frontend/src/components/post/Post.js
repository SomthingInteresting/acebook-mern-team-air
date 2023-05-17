import React from 'react';

const Post = ({post}) => {
  return(
    <article data-cy="post" key={ post._id }>
      <div>
        {post.firstname} {post.lastname}
      </div>
      <div>
        { post.message }
      </div>
    </article>
  )
}

export default Post;
