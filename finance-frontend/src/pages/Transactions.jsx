import { useEffect, useState } from 'react';
import '../styles/Transactions.css';
import TransactionModal from '../components/transactions/TransactionsModal';
import DeleteConfirmationModal from '../components/shared/DeleteConfirmationModal';
import { apiRequest } from '../api/apiClient';

const API_URL = '/Transactions';
const ACCOUNTS_URL = '/Accounts';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [modalMode, setModalMode] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                setLoading(true);
                setError('');

                const response = await apiRequest(API_URL, {
                    headers: {
                        
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch transactions (${response.status})`);
                }

                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError('Unable to load transactions.');
            } finally {
                setLoading(false);
            }
        }

        fetchTransactions();
    }, []);

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const response = await fetch(ACCOUNTS_URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch accounts (${response.status})`);
                }

                const data = await response.json();
                setAccounts(data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        }

        fetchAccounts();
    }, []);

    function openCreateModal() {
        setOpenMenuId(null);
        setSelectedTransaction(null);
        setModalMode('create');
    }

    function openViewModal(transaction) {
        setOpenMenuId(null);
        setSelectedTransaction(transaction);
        setModalMode('view');
    }

    function openEditModal(transaction) {
        setOpenMenuId(null);
        setSelectedTransaction(transaction);
        setModalMode('edit');
    }

    function closeModal() {
        setModalMode(null);
        setSelectedTransaction(null);
    }

    async function handleSave(formData) {
        try {
            setError('');

            const isEdit = modalMode === 'edit';

            const url = isEdit
                ? `${API_URL}/${selectedTransaction.id}`
                : API_URL;

            const method = isEdit ? 'PUT' : 'POST';

            const requestBody = {
                date: formData.date,
                type: Number(formData.type),
                amount: Number(formData.amount),
                accountId: Number(formData.accountId),
                payee: formData.payee,
                description: formData.description,
                referenceNumber: formData.referenceNumber,
                notes: formData.notes
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    `Failed to ${isEdit ? 'update' : 'create'} transaction:`,
                    response.status,
                    errorText
                );

                setError(
                    `Unable to ${isEdit ? 'update' : 'create'} transaction.`
                );

                return;
            }

            const savedTransaction = await response.json();

            if (isEdit) {
                setTransactions(prevTransactions =>
                    prevTransactions.map(transaction =>
                        transaction.id === savedTransaction.id
                            ? savedTransaction
                            : transaction
                    )
                );
            } else {
                setTransactions(prevTransactions => [
                    ...prevTransactions,
                    savedTransaction
                ]);
            }

            closeModal();
        } catch (error) {
            console.error('Error saving transaction:', error);
            setError('Something went wrong while saving the transaction.');
        }
    }

    async function deleteTransaction(id) {
        try {
            setError('');

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();

                console.error(
                    'Failed to delete transaction:',
                    response.status,
                    errorText
                );

                setError('Unable to delete transaction.');
                return;
            }

            setTransactions(prevTransactions =>
                prevTransactions.filter(transaction => transaction.id !== id)
            );

            setTransactionToDelete(null);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setError('Something went wrong while deleting the transaction.');
        }
    }

    return (
        <div className="transactions-page">
            <div className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Manage your financial transactions.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreateModal}
                >
                    + Add Transaction
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading-message">
                    Loading transactions...
                </div>
            ) : transactions.length === 0 ? (
                <div className="empty-message">
                    No transactions found.
                </div>
            ) : (
                <div className="transactions-table-container">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Payee</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Account</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>
                                        {new Date(transaction.date)
                                            .toLocaleDateString('en-PH')}
                                    </td>

                                    <td>
                                        {transaction.type === 0
                                            ? 'Income'
                                            : transaction.type === 1
                                                ? 'Expense'
                                                : 'Transfer'}
                                    </td>

                                    <td>{transaction.payee}</td>

                                    <td>{transaction.description}</td>

                                    <td>
                                        ₱{Number(transaction.amount)
                                            .toLocaleString('en-PH', {
                                                minimumFractionDigits: 2
                                            })}
                                    </td>

                                    <td>{transaction.accountName || 'N/A'}</td>

                                    <td className="actions-column">
                                        <div className="transaction-menu">
                                            <button
                                                type="button"
                                                className="transaction-menu-trigger"
                                                aria-label={`Actions for transaction ${transaction.id}`}
                                                aria-haspopup="true"
                                                aria-expanded={
                                                    openMenuId === transaction.id
                                                }
                                                onClick={() =>
                                                    setOpenMenuId(
                                                        openMenuId === transaction.id
                                                            ? null
                                                            : transaction.id
                                                    )
                                                }
                                            >
                                                ⋮
                                            </button>

                                            {openMenuId === transaction.id && (
                                                <div className="transaction-menu-dropdown">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openViewModal(transaction)
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(transaction)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-action"
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            setTransactionToDelete(transaction);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalMode && (
                <TransactionModal
                    key={`${modalMode}-${selectedTransaction?.id ?? 'new'}`}
                    mode={modalMode}
                    transaction={selectedTransaction}
                    accounts={accounts}
                    onClose={closeModal}
                    onEdit={openEditModal}
                    onSave={handleSave}
                />
            )}

            {transactionToDelete && (
                <DeleteConfirmationModal
                    title="Delete Transaction?"
                    message="Are you sure you want to delete this transaction?"
                    onClose={() => setTransactionToDelete(null)}
                    onConfirm={() => deleteTransaction(transactionToDelete.id)}
                />
            )}
        </div>
    );
}