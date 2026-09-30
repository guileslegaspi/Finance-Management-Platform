
import { useEffect, useState } from "react";
import AccountModal from "../Components/AccountModal";
import "../styles/Accounts.css";

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        async function loadAccounts() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "https://localhost:7012/api/Accounts",
                    {
                        headers: {
                            Authorization: `Bearer ${ token } `
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
    }, [refreshKey]);

    return (
        <div className="accounts-page">
            <div className="page-header">
                <div>
                    <h1>Accounts</h1>
                    <p>Manage your financial accounts.</p>
                </div>

                <button onClick={() => setShowModal(true)}>
                    + Add Account
                </button>
            </div>

            {loading ? (
                <p>Loading accounts...</p>
            ) : accounts.length === 0 ? (
                <div className="empty-state">
                    <h2>No accounts yet</h2>
                    <p>
                        Add your first financial account to start
                        tracking your money.
                    </p>

                    <button onClick={() => setShowModal(true)}>
                        + Add Account
                    </button>
                </div>
            ) : (
                <div className="accounts-grid">
                    {accounts.map((account) => (
                        <div className="account-card" key={account.id}>
                            <div className="account-menu">
                                <button
                                    type="button"
                                    className="account-menu-button"
                                    onClick={() =>
                                        setOpenMenuId(
                                            openMenuId === account.id
                                                ? null
                                                : account.id
                                        )
                                    }
                                >
                                    ⋮
                                </button>

                                {openMenuId === account.id && (
                                    <div className="account-menu-dropdown">
                                        <button type="button">
                                            Edit
                                        </button>

                                        <button type="button">
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="account-card-header">
                                <div>
                                    <h2>{account.name}</h2>
                                    <p>{account.accountType}</p>
                                </div>
                            </div>

                            <div className="account-balance">
                                ₱{account.balance.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <AccountModal
                    onClose={() => setShowModal(false)}
                    onAccountCreated={() => {
                        setShowModal(false);
                        setRefreshKey((value) => value + 1);
                    }}
                />
            )}
        </div>
    );
}

export default Accounts;



