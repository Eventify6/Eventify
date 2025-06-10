import React, { useState, useEffect } from 'react';
import './CommentSection.css';
import { getCookie } from '../../utils/cookieUtils';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const { id: eventId } = useParams();

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/comments`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data.comments);
        } catch (error) {
            toast.error(error.message || 'Error fetching comments');
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        // Determine login status
        const loggedInStatus = getCookie('isLoggedIN') === 'true';

        // Pull raw JSON string out of cookie
        const rawUserData = getCookie('userData');
        let parsedUserData = null;

        if (rawUserData) {
            try {
                parsedUserData = JSON.parse(rawUserData);
            } catch (err) {
                console.error('Failed to parse userData cookie:', err);
            }
        }

        setIsLoggedIn(loggedInStatus);
        setUserData(parsedUserData);

        // Fetch comments when component mounts
        fetchComments();
    }, [eventId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !isLoggedIn || !userData) return;

        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userData.id,
                    content: newComment.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to post comment');
            }

            // Refresh comments after posting
            await fetchComments();
            setNewComment('');
            toast.success('Comment posted successfully!');
        } catch (error) {
            toast.error(error.message || 'Error posting comment');
            console.error('Error posting comment:', error);
        }
    };

    return (
        <div className="comment-section-container">
            <h5 className="comment-section-title">Comments</h5>

            <ul className="comment-list">
                {comments.map((comment, idx) => (
                    <React.Fragment key={comment.id}>
                        <li className="comment-item">
                            <div className="comment-author">
                                <strong>{comment.user.firstName} {comment.user.lastName}</strong>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                            <small className="comment-date">
                                {new Date(comment.created_at).toLocaleString()}
                            </small>
                        </li>
                        {idx < comments.length - 1 && <hr className="comment-divider" />}
                    </React.Fragment>
                ))}
            </ul>

            {isLoggedIn ? (
                <form
                    className="comment-form"
                    noValidate
                    autoComplete="off"
                    onSubmit={e => { e.preventDefault(); handleCommentSubmit(); }}
                >
                    <textarea
                        className="comment-textarea"
                        placeholder="Write a comment..."
                        rows={4}
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <button
                        type="button"
                        className="comment-submit-button"
                        onClick={handleCommentSubmit}
                    >
                        Submit Comment
                    </button>
                </form>
            ) : (
                <p className="login-prompt">Please log in to leave a comment.</p>
            )}
        </div>
    );
};

export default CommentSection;
