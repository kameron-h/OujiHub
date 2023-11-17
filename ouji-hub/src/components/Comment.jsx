import './Comment.css'
import trash_icon from './trash_icon.png'
import { supabase } from '../client.js'

const Comment = (props) => {
    const deleteComment = async(event) => {
        event.preventDefault();

        const { error } = await supabase
            .from('OujiComments')
            .delete()
            .eq('id', props.id);

        if (error) console.log(error);
    }

    return (
        <>
        <div className='Comment' id={props.id}>
            <p>{props.text}</p>
            <img className='deleteBtn' src={trash_icon} alt="delete button" onClick={deleteComment}></img>
        </div>
        </>
    );
}

export default Comment;