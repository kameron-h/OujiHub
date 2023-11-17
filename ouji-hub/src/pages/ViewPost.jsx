import { useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from '../client.js'
import { Link } from 'react-router-dom'
import './ViewPost.css'
import Comment from '../components/Comment.jsx';
import more from '../components/more.png'
import like_button from '../components/like_button.png'
import comments_symbol from '../components/comments_symbol.png'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advancedFormat)

const ViewPost = ({data}) => {
    const [post, setPost] = useState({
                            title: "", 
                            image: "", 
                            text: "",
                            video: "",
                            created_at: ""
                        });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({
                                        post_id: null,
                                        text: ""
                                    });
    const {id} = useParams();
    const [likeCount, setLikeCount] = useState(0);
    const [blank, setBlank] = useState(false);

    useEffect(() => {
        const fetchPost = async() => {
            const {data, error} = await supabase
              .from('OujiPosts')
              .select()
              .eq('id', id)
              .single()
      
            if (data) {
                setPost({title: data.title, 
                        image: data.image, 
                        text: data.text,
                        video: data.video,
                        created_at: data.created_at});
                setLikeCount(data.likes);
            } else if (error) {
                console.error;
            }
        }

        const fetchComments = async() => {
            const {data, error} = await supabase
              .from('OujiComments')
              .select()
              .eq('post_id', id)
      
            if (data) {
                setComments(data);
            } else if (error) {
                console.error;
            }
        }
      
        fetchPost();
        fetchComments();
    }, [comments])

    const handleChange = (event) => {
        setBlank(false);
        const {name, value} = event.target;

        setNewComment((prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    const commentError = (event) => {
        event.preventDefault();
        setBlank(true);

        setNewComment({
            post_id: null,
            text: ""
        });
    }

    const submitComment = async(event) => {
        event.preventDefault();
        setBlank(false);
        
        const { error } = await supabase
                            .from('OujiComments')
                            .insert({post_id: id,
                                    text: newComment.text})
                            .select();

        if (error) console.log(error);

        setNewComment({
            post_id: null,
            text: ""
        });
    }

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
              .eq('id', id)

        if (error) console.log(error);

        setLikeCount((likeCount) => likeCount + 1);
    }

    return (
        <>
        <div className='ViewPost'>
            <Link to={'/edit/'+ id}><img className="moreButton" alt="edit button" src={more} /></Link>
            
            <h1 className="title">{post.title}</h1>
            <p>{post.text}</p>
            {
                post.image ? 
                <img className='postImage' alt="" src={post.image}></img>
                : null
            }
            {
                post.video ?
                <video className='postVideo' controls>
                    <source src={post.video} type="video/mp4"/>
                    <source src={post.video} type="video/webm"/>
                    <source src={post.video} type="video/ogg"/>
                    Your browser does not support the video tag.
                </video> 
                : null
            }
            <div className='statsContainer'>
                <img className='likeButton' alt='like button' src={like_button} onClick={updateLikes}></img>
                <p>{likeCount}</p>
                <img className='commentImg' alt='comments symbol' src={comments_symbol}></img>
                <p>{comments.length}</p>
            </div>
            <p className='date'>{getPostDate(post.created_at)}</p>
        </div>
        
        <div className='Comments'>
            <h2 className='title'>Comments</h2>
            <textarea rows="5" cols="50" name="text" id="text" className={blank !== true ? "" : "error"} value={newComment.text} placeholder={blank !== true ? "Write a comment..." : "Comment cannot be blank."} onChange={handleChange}></textarea>
            <p className='commentButton' onClick={newComment.text.replace(/\s/g, '') !== '' ? submitComment : commentError}>+ Add Comment</p>
            {
                comments && comments.length > 0 ?
                comments && Object.entries(comments).map(([comment]) =>
                    <Comment 
                        key={comments[comment].id} 
                        id={comments[comment].id}
                        text={comments[comment].text} 
                    />)
                : <h3>{'No Comments Yet!'}</h3>
            }
        </div>
        </>
    );
}

export default ViewPost