import '../styles/ExpenseModal.css';

function ExpenseModal({ mode, expense, onClose, onEdit }) {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="expense-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">
                    <div>
                        <span className="modal-eyebrow">
                            {mode === 'create'
                                ? 'NEW TRANSACTION'
                                : 'EXPENSE RECORD'}
                        </span>

                        <h2>
                            {mode === 'create'
                                ? 'Add Expense'
                                : mode === 'edit'
                                    ? 'Edit Expense'
                                    : 'Expense Details'}
                        </h2>

                        {isViewMode && expense && (
                            <p className="modal-subtitle">
                                {expense.payee} · {expense.date}
                            </p>
                        )}
                    </div>

                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>


                <div className="modal-body">

                    <div className="form-row">

                        <div className="form-group">
                            <label>Date</label>

                            {isViewMode ? (
                                <div className="view-value">
                                    {expense?.date || '—'}
                                </div>
                            ) : (
                                <input
                                    type="date"
                                    defaultValue={expense?.date || ''}
                                />
                            )}
                        </div>


                        <div className="form-group">
                            <label>Amount</label>

                            {isViewMode ? (
                                <div className="view-value amount-value">
                                    ₱{expense?.amount?.toLocaleString(
                                        'en-PH',
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    ) || '0.00'}
                                </div>
                            ) : (
                                <div className="amount-input">
                                    <span>₱</span>

                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        defaultValue={expense?.amount || ''}
                                    />
                                </div>
                            )}
                        </div>

                    </div>


                    <div className="form-group">
                        <label>Payee</label>

                        {isViewMode ? (
                            <div className="view-value">
                                {expense?.payee || '—'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="e.g. PLDT"
                                defaultValue={expense?.payee || ''}
                            />
                        )}
                    </div>


                    <div className="form-group">
                        <label>Description</label>

                        {isViewMode ? (
                            <div className="view-value">
                                {expense?.description || '—'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="What was this expense for?"
                                defaultValue={expense?.description || ''}
                            />
                        )}
                    </div>


                    <div className="form-group">
                        <label>Reference Number</label>

                        {isViewMode ? (
                            <div className="view-value">
                                {expense?.referenceNumber || '—'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="Invoice / receipt / transaction number"
                                defaultValue={
                                    expense?.referenceNumber || ''
                                }
                            />
                        )}
                    </div>


                    <div className="form-group">
                        <label>Notes</label>

                        {isViewMode ? (
                            <div className="view-value notes-value">
                                {expense?.notes || 'No notes added.'}
                            </div>
                        ) : (
                            <textarea
                                placeholder="Additional notes..."
                                defaultValue={expense?.notes || ''}
                            />
                        )}
                    </div>


                    {isViewMode && expense && (
                        <div className="expense-metadata">

                            <div>
                                <span>Created</span>
                                <strong>
                                    {expense.createdAt || '—'}
                                </strong>
                            </div>

                            <div>
                                <span>Last updated</span>
                                <strong>
                                    {expense.updatedAt || 'Never'}
                                </strong>
                            </div>

                        </div>
                    )}

                </div>


                <div className="modal-footer">

                    <button
                        className="secondary-button"
                        onClick={onClose}
                    >
                        {isViewMode ? 'Close' : 'Cancel'}
                    </button>

                    {isViewMode && (
                        <button
                            className="primary-button"
                            onClick={() => onEdit(expense)}
                        >
                            Edit Expense
                        </button>
                    )}

                    {!isViewMode && (
                        <button className="primary-button">
                            {isEditMode
                                ? 'Save Changes'
                                : 'Create Expense'}
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
}

export default ExpenseModal;