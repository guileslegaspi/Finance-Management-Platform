import { useEffect, useState } from "react";
import "../App.css";
import SummaryCard from "./SummaryCard";
import FinancialOverview from "./FinancialOverview";

function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAccounts() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "https://localhost:7012/api/Accounts",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch accounts.");
                }

                const data = await response.json();

                setAccounts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadAccounts();
    }, []);

    const totalBalance = accounts.reduce(
        (total, account) => total + account.balance,
        0
    );

    return (
        <>
            <h1>Finance Management</h1>
            <p>Welcome to your financial dashboard.</p>

            <div className="summary-grid">
                <SummaryCard
                    title="Total Balance"
                    value={
                        loading
                            ? "Loading..."
                            : `₱${totalBalance.toLocaleString()}`
                    }
                />

                <SummaryCard
                    title="Savings"
                    value={
                        loading
                            ? "Loading..."
                            : `₱${totalBalance.toLocaleString()}`
                    }
                />

                <SummaryCard
                    title="Income"
                    value="₱0"
                />

                <SummaryCard
                    title="Expense"
                    value="₱0"
                />

                <SummaryCard
                    title="Expense"
                    value="₱0"
                />


            </div>

            <FinancialOverview />
        </>
    );
}

export default Dashboard;