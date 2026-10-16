
import { useEffect, useMemo, useState } from 'react';
import '../styles/Transactions.css';
import TransactionModal from '../components/transactions/TransactionsModal';
import DeleteConfirmationModal from '../components/shared/DeleteConfirmationModal';
import { apiRequest } from '../api/apiClient';

const API_URL = '/Transactions';
const ACCOUNTS_URL = '/Accounts';

const TRANSACTION_TYPES = [
    { value: 0, label: 'Income' },
    { value: 2, label: 'Transfer' },
    { value: 1, label: 'Expense' }
];

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [modalMode, setModalMode] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);


    const [sortOrder, setSortOrder] = useState('newest');
    const [selectedTypes, setSelectedTypes] = useState([0, 1, 2]);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

   
    const visibleTransactions = useMemo(() => {
        return transactions
            .filter(transaction =>
                selectedTypes.includes(Number(transaction.type))
            )
            .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();

                return sortOrder === 'newest'
                    ? dateB - dateA
                    : dateA - dateB;
            });
    }, [transactions, selectedTypes, sortOrder]);

    function toggleTransactionType(type) {
        setSelectedTypes(current =>
            current.includes(type)
                ? current.filter(item => item !== type)
                : [...current, type]
        );
    }

    function resetSortAndFilters() {
        setSortOrder('newest');
        setSelectedTypes([0, 1, 2]);
    }

    useEffect(() => {
        async function fetchTransactions() {
            try {
                setLoading(true);
                setError('');

                const response = await apiRequest(API_URL);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch transactions (${response.status})`
                    );
                }

                setTransactions(await response.json());
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
                const response = await apiRequest(ACCOUNTS_URL);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch accounts (${response.status})`
                    );
                }

                setAccounts(await response.json());
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
            const isTransfer = Number(formData.type) === 2;

            if (isTransfer && isEdit) {
                setError(
                    'Editing transfer transactions is not supported yet.'
                );
                return;
            }

            const url = isTransfer
                ? `${API_URL}/transfer`
                : isEdit
                    ? `${API_URL}/${selectedTransaction.id}`
                    : API_URL;

            const method = isEdit ? 'PUT' : 'POST';

            const requestBody = isTransfer
                ? {
                    date: formData.date,
                    accountId: Number(formData.accountId),
                    destinationAccountId: Number(
                        formData.destinationAccountId
                    ),
                    amount: Number(formData.amount)
                }
                : {
                    date: formData.date,
                    type: Number(formData.type),
                    amount: Number(formData.amount),
                    accountId: Number(formData.accountId),
                    payee: formData.payee,
                    description: formData.description,
                    referenceNumber: formData.referenceNumber,
                    notes: formData.notes
                };

            const response = await apiRequest(url, {
                method,
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
                    errorText ||
                    `Unable to ${isEdit ? 'update' : 'create'} transaction.`
                );
                return;
            }

            const savedTransaction = response.status === 204
                ? null
                : await response.json();

            if (savedTransaction) {
                if (isEdit) {
                    setTransactions(previous =>
                        previous.map(transaction =>
                            transaction.id === savedTransaction.id
                                ? savedTransaction
                                : transaction
                        )
                    );
                } else {
                    setTransactions(previous => [
                        ...previous,
                        savedTransaction
                    ]);
                }
            }

            const [transactionsResponse, accountsResponse] =
                await Promise.all([
                    apiRequest(API_URL),
                    apiRequest(ACCOUNTS_URL)
                ]);

            if (transactionsResponse.ok) {
                setTransactions(await transactionsResponse.json());
            }

            if (accountsResponse.ok) {
                setAccounts(await accountsResponse.json());
            }

            closeModal();
        } catch (error) {
            console.error('Error saving transaction:', error);
            setError(
                'Something went wrong while saving the transaction.'
            );
        }
    }

    async function deleteTransaction(id) {
        try {
            setError('');

            const response = await apiRequest(`${API_URL}/${id}`, {
                method: 'DELETE'
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

            setTransactions(previous =>
                previous.filter(transaction => transaction.id !== id)
            );

            setTransactionToDelete(null);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setError(
                'Something went wrong while deleting the transaction.'
            );
        }
    }

    return (
        <div className="transactions-page">
            <div className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Manage your financial transactions.</p>
                </div>

                <div className="transactions-header-actions">
                    <button
                        className="primary-button"
                        onClick={openCreateModal}
                    >
                        + Add Transaction
                    </button>

                    <div className="sort-dropdown">
                        <button
                            type="button"
                            className="sort-dropdown-trigger"
                            aria-haspopup="true"
                            aria-expanded={sortDropdownOpen}
                            onClick={() =>
                                setSortDropdownOpen(open => !open)
                            }
                        >
                            <span aria-hidden="true">☷</span>
                            Sort &amp; Filter
                            <span aria-hidden="true">
                                {sortDropdownOpen ? '▴' : '▾'}
                            </span>
                        </button>

                        {sortDropdownOpen && (
                            <div className="sort-dropdown-panel">
                                <div className="sort-section">
                                    <h3>Sort by date</h3>

                                    <label className="sort-option">
                                        <input
                                            type="radio"
                                            name="transaction-sort"
                                            value="newest"
                                            checked={sortOrder === 'newest'}
                                            onChange={() =>
                                                setSortOrder('newest')
                                            }
                                        />
                                        Newest first
                                    </label>

                                    <label className="sort-option">
                                        <input
                                            type="radio"
                                            name="transaction-sort"
                                            value="oldest"
                                            checked={sortOrder === 'oldest'}
                                            onChange={() =>
                                                setSortOrder('oldest')
                                            }
                                        />
                                        Oldest first
                                    </label>
                                </div>

                                <div className="sort-section">
                                    <h3>Transaction type</h3>
                                    <p className="sort-hint">
                                        Select any combination.
                                    </p>

                                    {TRANSACTION_TYPES.map(type => (
                                        <label
                                            className="sort-option"
                                            key={type.value}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(
                                                    type.value
                                                )}
                                                onChange={() =>
                                                    toggleTransactionType(
                                                        type.value
                                                    )
                                                }
                                            />
                                            {type.label}
                                        </label>
                                    ))}
                                </div>

                                <div className="sort-dropdown-footer">
                                    <button
                                        type="button"
                                        className="reset-filters-button"
                                        onClick={resetSortAndFilters}
                                    >
                                        Reset
                                    </button>

                                    <button
                                        type="button"
                                        className="apply-filters-button"
                                        onClick={() =>
                                            setSortDropdownOpen(false)
                                        }
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">{error}</div>
            )}

            {loading ? (
                <div className="loading-message">
                    Loading transactions...
                </div>
            ) : transactions.length === 0 ? (
                <div className="empty-message">
                    No transactions found.
                </div>
            ) : visibleTransactions.length === 0 ? (
                <div className="empty-message">
                    No transactions match your selected filters.
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
                                <th className="actions-column">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {visibleTransactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>
                                        {new Date(transaction.date)
                                            .toLocaleDateString('en-PH')}
                                    </td>

                                    <td>
                                        {Number(transaction.type) === 0
                                            ? 'Income'
                                            : Number(transaction.type) === 1
                                                ? 'Expense'
                                                : 'Transfer'}
                                    </td>

                                    <td>{transaction.payee}</td>
                                    <td>{transaction.description}</td>

                                    <td>
                                        ₱{Number(
                                            transaction.amount
                                        ).toLocaleString('en-PH', {
                                            minimumFractionDigits: 2
                                        })}
                                    </td>

                                    <td>
                                        {transaction.accountName || 'N/A'}
                                    </td>

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
                                                        openMenuId ===
                                                            transaction.id
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
                                                            openViewModal(
                                                                transaction
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                transaction
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-action"
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            setTransactionToDelete(
                                                                transaction
                                                            );
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
                    onConfirm={() =>
                        deleteTransaction(transactionToDelete.id)
                    }
                />
            )}
        </div>
    );
}
