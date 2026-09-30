import { useState } from 'react';
import '../styles/Expenses.css';
import TransactionModal from '../Components/TransactionModal';

export default function Expenses() {

    const [expenses, setExpenses] = useState([
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
    const [selectedExpense, setSelectedExpense] = useState(null);


    function openCreateModal() {
        setSelectedExpense(null);
        setModalMode('create');
    }


    function openViewModal(expense) {
        setSelectedExpense(expense);
        setModalMode('view');
    }


    function openEditModal(expense) {
        setSelectedExpense(expense);
        setModalMode('edit');
    }


    function closeModal() {
        setModalMode(null);
        setSelectedExpense(null);
    }


    function deleteExpense(id) {
        setExpenses(
            expenses.filter(expense => expense.id !== id)
        );
    }


    return (
        <div className="expenses-page">

            <div className="page-header">

                <div>
                    <h1>Expenses</h1>
                    <p>View and manage your expenses.</p>
                </div>

                <button
                    className="primary-button"
                    onClick={openCreateModal}
                >
                    + Add Expense
                </button>

            </div>

            <div className="expense-toolbar">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search expenses..."
                />

                <select>
                    <option value="">All dates</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                </select>

            </div>

            <div className="expense-table-container">

                <table className="expense-table">

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

                        {expenses.map(expense => (

                            <tr key={expense.id}>

                                <td>
                                    {expense.date}
                                </td>

                                <td>
                                    {expense.payee}
                                </td>

                                <td>
                                    {expense.description}
                                </td>

                                <td>
                                    ₱{expense.amount.toLocaleString(
                                        'en-PH',
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </td>


                                <td className="expense-actions">

                                    <button
                                        className="view-button"
                                        onClick={() =>
                                            openViewModal(expense)
                                        }
                                    >
                                        View
                                    </button>


                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            openEditModal(expense)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            deleteExpense(expense.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {expenses.length === 0 && (
                    <div className="empty-state">

                        <h3>No expenses yet</h3>

                        <p>
                            Add your first expense to start
                            tracking spending.
                        </p>

                    </div>
                )}

            </div>

            {modalMode && (
                <TransactionModal
                    mode={modalMode}
                    expense={selectedExpense}
                    onClose={closeModal}
                    onEdit={openEditModal}
                />
            )}

        </div>
    );
}