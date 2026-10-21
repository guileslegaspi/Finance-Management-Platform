
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiClient";
import "../../styles/RecentTransactionPanel.css";

const transactionTypes = {
    0: "Income",
    1: "Expense",
    2: "Transfer",
    income: "Income",
    expense: "Expense",
    transfer: "Transfer"
};

function getTransactionType(type) {
    return transactionTypes[String(type).toLowerCase()] ?? "Unknown";
}

function RecentTransactionPanel() {
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRecentTransactions() {
            try {
                const response = await apiRequest("/Transactions/recent");

                if (!response.ok) {
                    throw new Error("Failed to fetch recent transactions.");
                }

                setTransactions(await response.json());
            } catch (error) {
                console.error(error);
                setError("Unable to load recent transactions.");
            } finally {
                setTransactionsLoading(false);
            }
        }

        loadRecentTransactions();
    }, []);

    return (
        <article className="dashboard-panel recent-transactions-panel">
            <div className="panel-heading">
                <div>
                    <span className="panel-number"></span>
                    <h2>Recent Transactions</h2>
                </div>
            </div>

            {transactionsLoading ? (
                <div className="panel-empty">
                    <p>Loading recent transactions...</p>
                </div>
            ) : error ? (
                <div className="panel-empty">
                    <p>{error}</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="panel-empty">
                    <span className="panel-icon">↕</span>
                    <strong>No transactions yet</strong>
                    <p>Your recent activity will appear here.</p>
                </div>
            ) : (
                <ul className="recent-transactions-list">
                    {transactions.map(transaction => {
                        const type = getTransactionType(transaction.type);
                        const typeClass = type.toLowerCase();

                        const icon =
                            type === "Income" ? "↑" :
                                type === "Expense" ? "↓" :
                                    type === "Transfer" ? "↔" : "?";

                        return (
                            <li
                                className="recent-transaction"
                                key={transaction.id}
                            >
                                <div
                                    className={`transaction-icon transaction-${typeClass}`}
                                    aria-label={type}
                                    title={type}
                                >
                                    {icon}
                                </div>

                                <div className="transaction-details">
                                    <strong>
                                        {transaction.payee || type}
                                    </strong>

                                    <span>
                                        {type} ·{" "}
                                        {new Date(transaction.date)
                                            .toLocaleDateString("en-PH", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                    </span>
                                </div>

                                <strong
                                    className={`transaction-amount transaction-amount-${typeClass}`}
                                >
                                    {type === "Income" ? "+" :
                                        type === "Expense" ? "−" : ""}
                                    ₱{Number(transaction.amount).toLocaleString(
                                        "en-PH",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </strong>
                            </li>
                        );
                    })}
                </ul>
            )}
        </article>
    );
}

export default RecentTransactionPanel;
