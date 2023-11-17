import React, { useState, useEffect } from 'react'
import { supabase } from './client.js'
import { Link } from 'react-router-dom'
import './App.css'
import { useRoutes } from 'react-router-dom'
import ViewAll from './pages/ViewAll.jsx'
import CreatePost from './pages/CreatePost.jsx'
import ViewPost from './pages/ViewPost.jsx'
import EditPost from './pages/EditPost.jsx'

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async() => {
      const {data} = await supabase
                    .from('OujiPosts')
                    .select()
                    
      setPosts(data);
    }

    fetchPosts();
  }, [posts])

  let element = useRoutes([
    {
      path: "/",
      element:<ViewAll/>
    },
    {
      path:"/post/:id",
      element: <ViewPost data={posts}/>
    },
    {
      path:"/edit/:id",
      element: <EditPost data={posts}/>
    },
    {
      path: "/new",
      element:<CreatePost />
    }
  ]);

  return (
    <>
      <div className="App">
        <div className="header">
            <h1 className='headerTitle'>OujiHub</h1>
            <Link to="/" className='headerLink'>Explore</Link>
            <Link to="/new" className='headerLink'>Create Post</Link>
        </div>
        {element}
      </div>
    </>
  )
}

export default App
