import './Modal.css';

export default function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className="custom-modal-overlay" onClick={onClose}>
            <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                <button className="custom-modal-close" onClick={onClose}>&times;</button>
                {children}
            </div>
        </div>
    );
} 