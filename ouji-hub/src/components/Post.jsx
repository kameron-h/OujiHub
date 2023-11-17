import React, { useEffect } from 'react'
import { useState } from 'react'
import './Post.css'
import { Link } from 'react-router-dom'
import { supabase } from '../client.js'
import more from './more.png'
import like_button from './like_button.png'
import comments_symbol from './comments_symbol.png'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advancedFormat)

const Post = (props) => {
    const [likeCount, setLikeCount] = useState(props.likes);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async() => {
            const {data, error} = await supabase
              .from('OujiComments')
              .select()
              .eq('post_id', props.id)
      
            if (data) {
                setComments(data);
            } else if (error) {
                console.error;
            }
        }

        fetchComments();
    }, [])

    const getPostDate = (date) => {
        return "Posted on " + 
                dayjs(date).format('MM/DD/YYYY') +
                " at " + 
                dayjs(date).format('h:mm A (z)')
    }

    const updateLikes = async(event) => {
        event.preventDefault();

        const {error} = await supabase
              .from('OujiPosts')
              .update({likes: likeCount + 1})
              .eq('id', props.id)

        if (error) console.log(error)

        setLikeCount((likeCount) => likeCount + 1);
    }

    return (
        <>
        <div className="Post">
            <Link to={'edit/'+ props.id}><img className="moreButton" alt="edit button" src={more} /></Link>
            <Link to={'post/' + props.id}><h1 className="title">{props.title}</h1></Link>
            <p className='text'>{props.text}</p>
            {
                props.image ? 
                <img className='postImage' alt={props.alt} src={props.image}></img>
                : null
            }
            {
                props.video ?
                <video className='postVideo' controls>
                    <source src={props.video} type="video/mp4"/>
                    <source src={props.video} type="video/ogg"/>
                    <source src={props.video} type="video/webm"/>
                    Your browser does not support the video tag.
                </video> 
                : null
            }
            <div className='statsContainer'>
                <img className='likeButton' alt='like button' src={like_button} onClick={updateLikes}></img>
                <p>{likeCount}</p>
                <img className='commentImg' alt='comments' src={comments_symbol}></img>
                <p>{comments.length}</p>
            </div>
            <p className='date'>{getPostDate(props.createdAt)}</p>
        </div>
        </>    
      );
}

export default Post;