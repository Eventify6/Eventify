import React, { useState, useEffect } from 'react';
import './CommentSection.css';
import { getCookie } from '../../utils/cookieUtils';

const initialComments = [
    { id: 1, author: 'John Doe', text: 'This was an amazing event! Highly recommend.' },
    { id: 2, author: 'Jane Smith', text: 'Had a great time. The organization was perfect.' },
];

const CommentSection = () => {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Determine login status
        const loggedInStatus = getCookie('isLoggedIN') === 'true';

        // Pull raw JSON string out of cookie
        const rawUserData = getCookie('userData');
        let parsedUserData = null;

        if (rawUserData) {
            try {
                // If you url-encoded it when setting the cookie, decode first:
                // const decoded = decodeURIComponent(rawUserData);
                parsedUserData = JSON.parse(rawUserData);
            } catch (err) {
                console.error('Failed to parse userData cookie:', err);
            }
        }

        setIsLoggedIn(loggedInStatus);
        setUserData(parsedUserData);
    }, []);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;

        const authorName = isLoggedIn && userData
            ? `${userData.firstName} ${userData.lastName}`
            : 'New User';

        const newCommentObject = {
            id: comments.length + 1,
            author: authorName,
            text: newComment.trim(),
        };

        setComments(prev => [...prev, newCommentObject]);
        setNewComment('');
    };

    return (
        <div className="comment-section-container">
            <h5 className="comment-section-title">Comments</h5>

            <ul className="comment-list">
                {comments.map((comment, idx) => (
                    <React.Fragment key={comment.id}>
                        <li className="comment-item">
                            <div className="comment-author">
                                <strong>{comment.author}</strong>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                        </li>
                        {idx < comments.length - 1 && <hr className="comment-divider" />}
                    </React.Fragment>
                ))}
            </ul>

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
        </div>
    );
};

export default CommentSection;
