import React, { useEffect, useState } from 'react';
import Post from '../post/Post'

// Define a Feed component which receives a navigate prop to handle navigation.
const Feed = ({ navigate }) => {
  // Initialize states with useState for posts, token and newPost.
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // useEffect hook is used for handling side effects.
  // It fetches posts from the "/posts" endpoint and updates the posts state.
  // The token is included in the header for authorization.
  useEffect(() => {
    if(token) {
      fetch("/posts", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(async data => {
          window.localStorage.setItem("token", data.token)
          setToken(window.localStorage.getItem("token"))
          setPosts(data.posts);
        })
    }
  }, [])

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

  };


  // handleSubmit function handles post submission.
  // It sends a POST request to "/posts" endpoint with the new post data.
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('message', JSON.stringify({ message: newPost }));
      formData.append('image', selectedImage);
      
      const response = await fetch("/posts", {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      // JSON.stringify({ message: newPost })
      const data = await response.json();
  
      setPosts([{ ...data.post, _id: data.post._id}, ...posts]);
      setNewPost('');
      setSelectedImage(null);
  
    } catch (error) {
      console.error(error);
    }
  };

  // handleLike function sends a POST request to "/posts/{postId}/likes" endpoint to like a post.
  // It also updates the post's like count in the local state.
  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      const data = await response.json();
  
      if (response.status === 400) {
        removeLike(postId);

      } else {
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, like: data.post.like } : post
        ));
      }
    } catch (error) {
      console.error(error);
    }
  }; 
  
  const removeLike = async (postId) => {
    try {
      const response = await fetch(`/posts/${postId}/likes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, like: data.post.like } : post));
      
      if (response.ok) {
        console.log('Like removed successfully');
      } else {
        //
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleComment = async (postId, comment) => {
    try {
      const response = await fetch(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      });
  
      // const data = await response.json();
  
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, comments: [...post.comments, { comment, author: { name: 'You' }, date: new Date(), _id: new Date().getTime() }] } : post
      ));      
    } catch (error) {
      console.error(error);
    }
  };
  
  // If token is present, render the posts feed with the ability to add a new post and logout.
  // If not, navigate to the signin page.
  if(token) {
    return(
      <>
        <h2>Posts</h2>
        <form onSubmit={handleSubmit}>
          <label>
            New Post:
            <input id="postText" type="text" value={newPost} onChange={(event) => setNewPost(event.target.value)} />
          </label>
          <button id="post" type="submit">Post</button>
        </form>

        <form onSubmit={handleSubmit}>
          <label>
            New Image Post:
            <input id="postImage" type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleImageUpload} />
          </label>
          <button id="post" type="submit">Post</button>
        </form>

        <div id='feed' role="feed">
            {posts.map(
              (post) => ( <Post post={ post } key={ post._id } onLike={handleLike} onComment={handleComment} /> )
            )}
        </div>
      </>
    )
  } else {
    navigate('/login')
  }
}


export default Feed;