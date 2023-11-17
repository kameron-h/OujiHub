import React, { useState } from 'react';
import './CreatePost.css'
import { supabase } from '../client.js'

const CreatePost = () => {
    const [post, setPost] = useState({
                            title : "", 
                            image: "", 
                            text: "",
                            video: ""
                        })
    const [titleBlank, setTitleBlank] = useState(false);
    const [textBlank, setTextBlank] = useState(false);

    const handleChange = (event) => {
        const {name, value} = event.target;

        setPost((prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    const submitPost = async(event) => {
        event.preventDefault();

        const { error } = await supabase
                            .from('OujiPosts')
                            .insert({title: post.title, 
                                    image: post.image,
                                    text: post.text,
                                    video: post.video})
                            .select();

        if (error) console.log(error);

        window.location = "/";
    }

    const formError = (event) => {
        event.preventDefault()

        if (post.title.replace(/\s/g, '') === '' && post.text.replace(/\s/g, '') === '') {
            setTitleBlank(true);
            setTextBlank(true);
            setPost({title: "",
                    text: "",
                    image: post.image,
                    video: post.video});
        } else if (post.title.replace(/\s/g, '') === '') {
            setTitleBlank(true);
            setTextBlank(false);
            setPost({title: "",
                    text: post.text,
                    image: post.image,
                    video: post.video});
        } else {
            setTitleBlank(false);
            setTextBlank(true);
            setPost({title: post.title,
                    text: "",
                    image: post.image,
                    video: post.video});
        }
    }

    return (
        <>
        <div className='createPost'>
            <h1>Create Post</h1>
            <hr></hr>
            <p>Questions marked with <span className='red'>*</span> are required.</p>
            <form onSubmit={post.title.replace(/\s/g, '') !== '' && post.text.replace(/\s/g, '') !== '' ? submitPost : formError}>
                <span><label htmlFor="title"><span className='red'>*</span> Title:</label> <br /></span>
                <input type="text" id="title" name="title" className={titleBlank !== true ? "" : "error"} placeholder={titleBlank !== true ? "Write new title..." : "Title cannot be blank."} value={post.title} onChange={handleChange}/><br />
                <br/>

                <span><label htmlFor="text"><span className='red'>*</span> Text:</label> <br /></span>
                <textarea rows="5" cols="50" id="text" name="text" className={textBlank !== true ? "" : "error"} placeholder={textBlank !== true ? "Write new text..." : "Text cannot be blank."} value={post.text} onChange={handleChange}></textarea><br />
                <br/>

                <span><label htmlFor="image">Image Address:</label> <br /></span>
                <p className='videoMust'>(URL must contain ".jpg", ".jpeg", ".png", or ".gif")</p>
                <input type="text" id="image" name="image" value={post.image} onChange={handleChange}/><br />
                <br/>

                <span><label htmlFor="video">Video Address:</label> <br /></span>
                <p className='videoMust'>(URL must contain ".mp4", ".ogg", or ".webm")</p>
                <input type="text" id="video" name="video" value={post.video} onChange={handleChange}/><br />
                <br/>

                <input type="submit" value="Submit"/>
            </form>
        </div>
        </>

    );
}

export default CreatePost;