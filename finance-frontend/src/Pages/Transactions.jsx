import { useState } from 'react';
import '../styles/Transactions.css';
import TransactionModal from '../Components/TransactionsModal';

export default function Transactions() {

    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: '2026-09-27',
            payee: 'PLDT',
            description: 'Internet bill',
            amount: 2499.00,
            referenceNumber: 'PLDT-INV-0927',
            notes: 'Monthly broadband',
            createdAt: 'Sep 27, 2026',
            updatedAt: null
        },
        {
            id: 2,
            date: '2026-09-26',
            payee: 'Shopee',
            description: 'Office supplies',
            amount: 850.00,
            referenceNumber: 'SP-2026-0926',
            notes: 'Printer supplies',
            createdAt: 'Sep 26, 2026',
            updatedAt: null
        }
    ]);


    const [modalMode, setModalMode] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);


    function openCreateModal() {
        setSelectedTransaction(null);
        setModalMode('create');
    }


    function openViewModal(transaction) {
        setSelectedTransaction(transaction);
        setModalMode('view');
    }


    function openEditModal(transaction) {
        setSelectedTransaction(transaction);
        setModalMode('edit');
    }


    function closeModal() {
        setModalMode(null);
        setSelectedTransaction(null);
    }


    function deleteTransaction(id) {
        setTransactions(
            transactions.filter(
                transaction => transaction.id !== id
            )
        );
    }


    return (
        <div className="transactions-page">

            <div className="page-header">

                <div>
                    <h1>Transactions</h1>
                    <p>View and manage your transactions.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreateModal}
                >
                    + Add Transaction
                </button>

            </div>


            <div className="transaction-toolbar">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search transactions..."
                />

                <select>
                    <option value="">All dates</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                </select>

            </div>


            <div className="transaction-table-container">

                <table className="transaction-table">

                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Payee</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>


                    <tbody>

                        {transactions.map(transaction => (

                            <tr key={transaction.id}>

                                <td>
                                    {transaction.date}
                                </td>

                                <td>
                                    {transaction.payee}
                                </td>

                                <td>
                                    {transaction.description}
                                </td>

                                <td>
                                    ₱{transaction.amount.toLocaleString(
                                        'en-PH',
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </td>


                                <td className="transaction-actions">

                                    <button
                                        className="view-button"
                                        onClick={() =>
                                            openViewModal(transaction)
                                        }
                                    >
                                        View
                                    </button>


                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            openEditModal(transaction)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            deleteTransaction(
                                                transaction.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>


                {transactions.length === 0 && (
                    <div className="empty-state">

                        <h3>No transactions yet</h3>

                        <p>
                            Add your first transaction to start
                            tracking your finances.
                        </p>

                    </div>
                )}

            </div>


            {modalMode && (
                <TransactionModal
                    mode={modalMode}
                    transaction={selectedTransaction}
                    onClose={closeModal}
                    onEdit={openEditModal}
                />
            )}

        </div>
    );
}