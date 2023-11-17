import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client.js'
import './EditPost.css'

const EditPost = ({data}) => {
    const [newPost, setNewPost] = useState({
                                    title: "", 
                                    image: "", 
                                    text: "",
                                    video: ""
                                });
    const [titleBlank, setTitleBlank] = useState(false);
    const [textBlank, setTextBlank] = useState(false);
    const {id} = useParams();

    const reset = () => {
        setTitleBlank(false);
        setTextBlank(false);
    }

    const handleChange = (event) => {
        const {name, value} = event.target;

        setNewPost((prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    const updatePost = async(event) => {
        event.preventDefault();
        reset();

        await supabase
            .from('OujiPosts')
            .update({title: newPost.title, 
                    image: newPost.image, 
                    text: newPost.text,
                    video: newPost.video})
            .eq('id', id);

        window.location = "/";
    }

    const deletePost = async(event) => {
        event.preventDefault();
        reset();

        await supabase
            .from('OujiPosts')
            .delete()
            .eq('id', id);

        window.location = "/";
    }

    const formError = (event) => {
        event.preventDefault()

        if (newPost.title.replace(/\s/g, '') === '' && newPost.text.replace(/\s/g, '') === '') {
            setTitleBlank(true);
            setTextBlank(true);
            setNewPost({title: "",
                        text: "",
                        image: newPost.image,
                        video: newPost.video});
        } else if (newPost.title.replace(/\s/g, '') === '') {
            setTitleBlank(true);
            setTextBlank(false);
            setNewPost({title: "",
                        text: newPost.text,
                        image: newPost.image,
                        video: newPost.video});
        } else {
            setTitleBlank(false);
            setTextBlank(true);
            setNewPost({title: newPost.title,
                        text: "",
                        image: newPost.image,
                        video: newPost.video});
        }
    }

    return (
        <>
        
        <div className='editPost'>
            <h1>Edit or Delete Post</h1>
            <hr></hr>
            <p>Questions marked with <span className='red'>*</span> are required.</p>
            <form onSubmit={newPost.title.replace(/\s/g, '') !== '' && newPost.text.replace(/\s/g, '') !== '' ? updatePost : formError}>
                <span><label htmlFor="title"><span className='red'>*</span> New Title:</label> <br /></span>
                <input type="text" id="title" name="title" className={titleBlank !== true ? "" : "error"} placeholder={titleBlank !== true ? "Write new title..." : "Title cannot be blank."} value={newPost.title} onChange={handleChange}/><br />
                <br/>

                <span><label htmlFor="text"><span className='red'>*</span> New Text:</label> <br /></span>
                <textarea rows="5" cols="50" id="text" name="text" className={textBlank !== true ? "" : "error"} placeholder={textBlank !== true ? "Write new text..." : "Text cannot be blank."} value={newPost.text} onChange={handleChange}></textarea><br />
                <br/>

                <span><label htmlFor="image">New Image Address:</label> <br /></span>
                <p className='videoMust'>(URL must contain ".jpg", ".jpeg", ".png", or ".gif")</p>
                <input type="text" id="image" name="image" placeholder='Enter new image address...' value={newPost.image} onChange={handleChange}/><br />
                <br/>

                <span><label htmlFor="video">New Video Address:</label> <br /></span>
                <p className='videoMust'>(URL must contain ".mp4", ".ogg", or ".webm")</p>
                <input type="text" id="video" name="video" placeholder='Enter new video address...' value={newPost.video} onChange={handleChange}/><br />
                <br/>

                <input type="submit" value="Submit"/>
                <button className="deleteButton" onClick={deletePost}>Delete</button>
            </form>
        </div>
        </>
    );
}

export default EditPost