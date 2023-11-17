import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import './ViewAll.css'
import { supabase } from '../client.js'

const ViewAll = () => {
    const [posts, setPosts] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [recentClicked, setRecentClicked] = useState(false);
    const [upvoteClicked, setUpvoteClicked] = useState(false);

    useEffect(() => {
        const fetchPosts = async() => {
            const {data} = await supabase
                          .from('OujiPosts')
                          .select()
                          .order('created_at', (recentClicked == false ? {ascending: true} : {ascending: false}))
                          
            setPosts(data);
        }
      
        const fetchUpvotePosts = async() => {
            const {data} = await supabase
                          .from('OujiPosts')
                          .select()
                          .order('likes', {ascending: false})
                          
            setPosts(data);
        }
      
        if (upvoteClicked === true && filteredResults.length === 0) {
            fetchUpvotePosts()
        } else if (filteredResults.length == 0) {
            fetchPosts();
        }
    }, [posts, filteredResults]);

    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
        setRecentClicked(false);
        setUpvoteClicked(false);
        setFilteredResults([]);

        if (searchValue.replace(/\s/g, '') !== '') {
            const filteredData = [];
    
            for (let i = 0; i < posts.length; i++) {
                if ((posts[i].title).toLowerCase().includes(searchValue.toLowerCase())) {
                    filteredData.push(i);
                }
            }
    
            setFilteredResults(filteredData);
        }
    };

    const handleRecentFilter = () => {
        if (recentClicked == false) {
          setRecentClicked(true);
          setUpvoteClicked(false);
          if (filteredResults.length > 0) {
            for (let i = 0; i < filteredResults.length; i++) {
                let max = i;
                for (let j = i+1; j < filteredResults.length; j++) { 
                    if (Date.parse(posts[filteredResults[j]].created_at) > 
                        Date.parse(posts[filteredResults[max]].created_at)) {
                        max = j;
                    }
                }

                if (max != i) {
                    let temp = filteredResults[i];
                    filteredResults[i] = filteredResults[max];
                    filteredResults[max] = temp;
                }
            }
          }
        } else {
          setRecentClicked(false);
          if (filteredResults.length > 0) {
            for (let i = 0; i < filteredResults.length; i++) {
                let min = i;
                for (let j = i+1; j < filteredResults.length; j++) { 
                    if (Date.parse(posts[filteredResults[j]].created_at) < 
                        Date.parse(posts[filteredResults[min]].created_at)) {
                        min = j;
                    }
                }

                if (min != i) {
                    let temp = filteredResults[i];
                    filteredResults[i] = filteredResults[min];
                    filteredResults[min] = temp;
                }
            }
          }
        }
    }
    
    const handleUpvoteFilter = () => {
        if (upvoteClicked == false) {
          setUpvoteClicked(true);
          setRecentClicked(false);
          if (filteredResults.length > 0) {
            for (let i = 0; i < filteredResults.length; i++) {
                let max = i;
                for (let j = i+1; j < filteredResults.length; j++) { 
                    if (posts[filteredResults[j]].likes > 
                        posts[filteredResults[max]].likes) {
                        max = j;
                    }
                }

                if (max != i) {
                    let temp = filteredResults[i];
                    filteredResults[i] = filteredResults[max];
                    filteredResults[max] = temp;
                }
            }
          }
        } else {
          setUpvoteClicked(false);
          if (filteredResults.length > 0) {
            for (let i = 0; i < filteredResults.length; i++) {
                let min = i;
                for (let j = i+1; j < filteredResults.length; j++) { 
                    if (posts[filteredResults[j]].likes < 
                        posts[filteredResults[min]].likes) {
                        min = j;
                    }
                }

                if (min != i) {
                    let temp = filteredResults[i];
                    filteredResults[i] = filteredResults[min];
                    filteredResults[min] = temp;
                }
            }
          }
        }
    }
    
    return (
        <>
        <div className='filterContainer'>
          <h2>Filters:</h2>
          <button 
            className={recentClicked == true ? "active" : ""} 
            onClick={handleRecentFilter}>
            Most Recent
          </button>
          <button 
            className={upvoteClicked == true ? "active" : ""}  
            onClick={handleUpvoteFilter}>
            Most Upvotes
          </button>
        </div>

        <input
            id="search"
            type="text"
            placeholder="Search post title..."
            onChange={(inputString) => searchItems(inputString.target.value)}
        />
        <br></br>
        <div className="ViewAll">
            
            {
                posts && posts.length > 0 ?
                (searchInput.length > 0 ?
                    filteredResults.map((post) =>
                        <Post 
                            key={posts[post].id}
                            id={posts[post].id} 
                            title={
                                Array.from(posts[post].title).length < 50 ? 
                                posts[post].title
                                : posts[post].title
                                    .slice(0,50)
                                    .concat("...")
                            } 
                            image={posts[post].image} 
                            text={
                                Array.from(posts[post].text).length < 100 ? 
                                posts[post].text
                                : posts[post].text
                                    .slice(0,100)
                                    .concat("...")
                            } 
                            video={posts[post].video}
                            createdAt={posts[post].created_at}
                            likes={posts[post].likes}
                        />) 
                    : posts && Object.entries(posts).map(([post]) =>
                        <Post 
                            key={posts[post].id}
                            id={posts[post].id} 
                            title={
                                Array.from(posts[post].title).length < 50 ? 
                                posts[post].title
                                : posts[post].title
                                    .slice(0,50)
                                    .concat("...")
                            } 
                            image={posts[post].image} 
                            text={
                                Array.from(posts[post].text).length < 100 ? 
                                posts[post].text
                                : posts[post].text
                                    .slice(0,100)
                                    .concat("...")
                            } 
                            video={posts[post].video}
                            createdAt={posts[post].created_at}
                            likes={posts[post].likes}
                        />)
                ) : <h2>{'No Posts Yet!'}</h2>
            }
        </div>  
        </>
        
    )
}

export default ViewAll;