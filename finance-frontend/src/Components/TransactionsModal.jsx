import '../styles/TransactionsModal.css';

function TransactionModal({
    mode,
    transaction,
    onClose,
    onEdit
}) {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    return (
        <div className="modal-overlay" onClick={onClose}>

            <div
                className="transaction-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <div>

                        <span className="modal-eyebrow">
                            {mode === 'create'
                                ? 'NEW TRANSACTION'
                                : 'TRANSACTION RECORD'}
                        </span>

                        <h2>
                            {mode === 'create'
                                ? 'Add Transaction'
                                : mode === 'edit'
                                    ? 'Edit Transaction'
                                    : 'Transaction Details'}
                        </h2>

                        {isViewMode && transaction && (
                            <p className="modal-subtitle">
                                {transaction.payee} · {transaction.date}
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
                                    {transaction?.date || '—'}
                                </div>
                            ) : (
                                <input
                                    type="date"
                                    defaultValue={
                                        transaction?.date || ''
                                    }
                                />
                            )}

                        </div>


                        <div className="form-group">

                            <label>Amount</label>

                            {isViewMode ? (
                                <div className="view-value amount-value">
                                    ₱{transaction?.amount?.toLocaleString(
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
                                        defaultValue={
                                            transaction?.amount || ''
                                        }
                                    />

                                </div>
                            )}

                        </div>

                    </div>


                    <div className="form-group">

                        <label>Payee</label>

                        {isViewMode ? (
                            <div className="view-value">
                                {transaction?.payee || '—'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="e.g. PLDT"
                                defaultValue={
                                    transaction?.payee || ''
                                }
                            />
                        )}

                    </div>


                    <div className="form-group">

                        <label>Description</label>

                        {isViewMode ? (
                            <div className="view-value">
                                {transaction?.description || '—'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="What was this transaction for?"
                                defaultValue={
                                    transaction?.description || ''
                                }
                            />
                        )}

                    </div>


                    <div className="form-group">

                        <label>Reference Number</label>

                        {isViewMode ? (
                            <div className="view-value">
                                {transaction?.referenceNumber || '—'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="Invoice / receipt / transaction number"
                                defaultValue={
                                    transaction?.referenceNumber || ''
                                }
                            />
                        )}

                    </div>


                    <div className="form-group">

                        <label>Notes</label>

                        {isViewMode ? (
                            <div className="view-value notes-value">
                                {transaction?.notes ||
                                    'No notes added.'}
                            </div>
                        ) : (
                            <textarea
                                placeholder="Additional notes..."
                                defaultValue={
                                    transaction?.notes || ''
                                }
                            />
                        )}

                    </div>


                    {isViewMode && transaction && (
                        <div className="transaction-metadata">

                            <div>
                                <span>Created</span>

                                <strong>
                                    {transaction.createdAt || '—'}
                                </strong>
                            </div>


                            <div>
                                <span>Last updated</span>

                                <strong>
                                    {transaction.updatedAt || 'Never'}
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
                            onClick={() => onEdit(transaction)}
                        >
                            Edit Transaction
                        </button>
                    )}


                    {!isViewMode && (
                        <button className="primary-button">
                            {isEditMode
                                ? 'Save Changes'
                                : 'Create Transaction'}
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}

export default TransactionModal;