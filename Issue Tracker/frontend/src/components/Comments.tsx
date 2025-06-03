import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User { id: string; username: string; }
interface Comment { id: string; userId: string; ticketId: string; content: string; createdBy: string; createdAt: string; }

interface CommentsProps {
  ticketId: string;
  users: User[]; // Maybe not need this, just to get the usernames by the userId
}

const Comments: React.FC<CommentsProps> = ({ ticketId, users }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);

  useEffect(() => {
    axios.get(`/api/tickets/${ticketId}/comments`)
      .then(({ data }) => setComments(data))
      .catch(() => console.error('Failed to load comments'));
  }, [ticketId]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    setCommentError(e.target.value.trim() ? '' : 'Comment cannot be empty');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    setAddingComment(true);
    axios.post(`/api/tickets/${ticketId}/comments`, {
      content: newComment,
      ticketId
    })
      .then(({ data }) => {
        setComments(prev => [...prev, data]);
        setNewComment('');
        setCommentError('');
        setShowAddCommentForm(false);
      })
      .catch(err => setCommentError(`Failed to add comment: ${err.message}`))
      .finally(() => setAddingComment(false));
  };

  const toggleAddCommentForm = () => {
    setShowAddCommentForm(prev => !prev);
    if (!showAddCommentForm) {
      setNewComment('');
      setCommentError('');
    }
  };

  const getAssigneeName = (uid: string) => {
    const u = users.find(u => u.id === uid);
    return u ? u.username : 'Unknown';
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(iso));

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h2 className="comments-title">Comments ({comments.length})</h2>
      </div>
      <div className="comments-content">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          <div className="comments-list">
            {comments.map(c => (
              <div key={c.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">Posted by: {getAssigneeName(c.createdBy)}</span>
                  <span className="comment-date">Create date: {formatDate(c.createdAt)}</span>
                </div>
                <div className="comment-content">{c.content}</div>
              </div>
            ))}
          </div>
        )}
        {!showAddCommentForm ? (
          <button onClick={toggleAddCommentForm} className="btn-secondary add-comment-button">
            Add Comment
          </button>
        ) : (
          <div className="add-comment">
            <form onSubmit={handleAddComment}>
              <textarea
                value={newComment}
                onChange={handleCommentChange}
                className={`comment-textarea ${commentError ? 'input-error' : ''}`}
                placeholder="Write your comment here..."
                rows={4}
              />
              {commentError && <div className="error-message">{commentError}</div>}
              <div className="comment-form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={addingComment || !newComment.trim()}
                >
                  {addingComment ? 'Adding...' : 'Submit'}
                </button>
                <button type="button" className="btn-secondary" onClick={toggleAddCommentForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
