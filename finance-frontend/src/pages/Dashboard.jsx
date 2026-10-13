
import { useEffect, useState } from "react";
import "../App.css";
import "../styles/Dashboard.css";
import ScheduleCalendar from "../components/dashboard/ScheduleCalendar";

function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingsGoal, setSavingsGoal] = useState(50000);

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

                setAccounts(await response.json());
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadAccounts();
    }, []);

    const totalBalance = accounts.reduce(
        (total, account) => total + Number(account.balance || 0),
        0
    );

    const actualSavings = 0;

    const savingsProgress = savingsGoal > 0
        ? Math.min((actualSavings / savingsGoal) * 100, 100)
        : 0;

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Finance Management</h1>
                    <p>Your money, organized in one place.</p>
                </div>

                <div className="dashboard-balance">
                    <span>Total Balance</span>
                    <strong>
                        {loading
                            ? "Loading..."
                            : `₱${totalBalance.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`}
                    </strong>
                </div>
            </header>

            <section className="dashboard-grid">
                <article className="dashboard-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="panel-number"></span>
                            <h2>Recent Transactions</h2>
                        </div>
                    </div>

                    <div className="panel-empty">
                        <span className="panel-icon">↕</span>
                        <strong>Transaction activity</strong>
                        <p>
                            testingggg
                        </p>
                    </div>
                </article>

                <article className="dashboard-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="panel-number"></span>
                            <h2>Income & Expenses</h2>
                        </div>
                    </div>

                    <div className="income-expense-summary">
                        <div className="finance-metric income-metric">
                            <span>Income</span>
                            <strong>₱0.00</strong>
                        </div>

                        <div className="finance-metric expense-metric">
                            <span>Expenses</span>
                            <strong>₱0.00</strong>
                        </div>
                    </div>

                    <div className="comparison-track">
                        <div className="comparison-income" />
                        <div className="comparison-expense" />
                    </div>

                    <p className="panel-note">
                        Transaction totals will appear once the transactions
                        API is connected.
                    </p>
                </article>

                <article className="dashboard-panel calendar-panel">
                    <ScheduleCalendar />
                </article>

                <article className="dashboard-panel savings-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="panel-number"></span>
                            <h2>Savings Goals</h2>
                        </div>
                    </div>

                    <div className="savings-content">
                        <div
                            className="savings-chart"
                            style={{
                                "--progress": `${savingsProgress}%`
                            }}
                            role="img"
                            aria-label={`${savingsProgress.toFixed(0)} percent of savings goal reached`}
                        >
                            <div className="savings-chart-center">
                                <strong>
                                    {savingsProgress.toFixed(0)}%
                                </strong>
                                <span>Completed</span>
                            </div>
                        </div>

                        <div className="savings-details">
                            <span>Actual savings</span>
                            <strong>
                                ₱{actualSavings.toLocaleString("en-PH")}
                            </strong>

                            <span>Savings target</span>
                            <strong>
                                ₱{savingsGoal.toLocaleString("en-PH")}
                            </strong>

                            <label htmlFor="savings-goal">
                                Set target (₱)
                            </label>

                            <input
                                id="savings-goal"
                                type="number"
                                min="1"
                                value={savingsGoal}
                                onChange={event =>
                                    setSavingsGoal(
                                        Math.max(
                                            0,
                                            Number(event.target.value)
                                        )
                                    )
                                }
                            />
                        </div>
                    </div>

                    <p className="panel-note">
                        Actual savings will soon be here hehe
                    </p>
                </article>

                <article className="dashboard-panel reserved-panel">
                    <span className="panel-number"></span>
                    <span className="reserved-icon">＋</span>
                    <h2>Coming Soon</h2>
                    <p>Panel five — wala pa ako maisip .</p>
                </article>

                <article className="dashboard-panel reserved-panel">
                    <span className="panel-number"></span>
                    <span className="reserved-icon">＋</span>
                    <h2>Coming Soon</h2>
                    <p>
                        Panel six — wala pa ako maisip
                    </p>
                </article>
            </section>
        </main>
    );
}

export default Dashboard;
