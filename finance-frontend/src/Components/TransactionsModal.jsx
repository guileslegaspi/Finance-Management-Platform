import { useState } from 'react';
import '../styles/TransactionsModal.css';

function TransactionModal({
    mode,
    transaction,
    accounts,
    onClose,
    onEdit,
    onSave
}) {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    const [formData, setFormData] = useState({
        date: transaction?.date ? transaction.date.substring(0, 10) : '',
        type: transaction?.type ?? 0,
        amount: transaction?.amount ?? '',
        accountId: transaction?.accountId ?? '',
        payee: transaction?.payee ?? '',
        description: transaction?.description ?? '',
        referenceNumber: transaction?.referenceNumber ?? '',
        notes: transaction?.notes ?? ''
    });

    function handleChanges(e) {
        const { name, value } = e.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="transaction-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        {isCreateMode && 'Create Transaction'}
                        {isEditMode && 'Edit Transaction'}
                        {isViewMode && 'Transaction Details'}
                    </h2>

                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChanges}
                            disabled={isViewMode}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChanges}
                            disabled={isViewMode}
                            required
                        >
                            <option value={0}>Expense</option>
                            <option value={1}>Income</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={handleChanges}
                            disabled={isViewMode}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Account</label>
                        <select
                            name="accountId"
                            value={formData.accountId}
                            onChange={handleChanges}
                            disabled={isViewMode}
                            required
                        >
                            <option value="">Select an account</option>

                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Payee</label>
                        <input
                            type="text"
                            name="payee"
                            value={formData.payee}
                            onChange={handleChanges}
                            disabled={isViewMode}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChanges}
                            disabled={isViewMode}
                        />
                    </div>

                    <div className="form-group">
                        <label>Reference Number</label>
                        <input
                            type="text"
                            name="referenceNumber"
                            value={formData.referenceNumber}
                            onChange={handleChanges}
                            disabled={isViewMode}
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChanges}
                            disabled={isViewMode}
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Close
                        </button>

                        {isViewMode && (
                            <button
                                type="button"
                                className="primary-button"
                                onClick={() => onEdit(transaction)}
                            >
                                Edit
                            </button>
                        )}

                        {!isViewMode && (
                            <button
                                type="submit"
                                className="primary-button"
                            >
                                {isEditMode ? 'Save Changes' : 'Create Transaction'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionModal;