import '../styles/DeleteConfirmationModal.css';

function DeleteConfirmationModal({
    title,
    message,
    onClose,
    onConfirm
}) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="delete-confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>

                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="delete-confirmation-body">
                    <p>{message}</p>

                    <p className="delete-warning">
                        This action cannot be undone.
                    </p>

                    <div className="delete-confirmation-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>

                        <button type="button" className="delete-button" onClick={onConfirm}> Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;

