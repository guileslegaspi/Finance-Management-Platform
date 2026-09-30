import { useEffect, useState } from "react";
import AccountModal from "../Components/AccountModal";
import "../styles/Accounts.css";

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const accountTypeLabels = {
        0: "Cash",
        1: "Bank",
        2: "E-Wallet",
        3: "Credit Card"
    };

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
    }, [refreshKey]);

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setShowModal(true);
        setOpenMenuId(null);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this account?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://localhost:7012/api/Accounts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete account.");
            }

            setRefreshKey((value) => value + 1);
            setOpenMenuId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = () => {
        setSelectedAccount(null);
        setShowModal(true);
    };

    return (
        <div className="accounts-page">
            <div className="page-header">
                <div>
                    <h1>Accounts</h1>
                    <p>Manage your financial accounts.</p>
                </div>

                <button onClick={handleAdd}>
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

                    <button onClick={handleAdd}>
                        + Add Account
                    </button>
                </div>
            ) : (
                <div className="accounts-grid">
                    {accounts.map((account) => (
                        <div
                            className="account-card"
                            key={account.id}
                        >
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
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(account)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(account.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="account-card-header">
                                <div>
                                    <h2>{account.name}</h2>

                                    <p>
                                        {accountTypeLabels[account.type]}
                                    </p>
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
                    account={selectedAccount}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedAccount(null);
                    }}
                    onAccountSaved={() => {
                        setShowModal(false);
                        setSelectedAccount(null);
                        setRefreshKey((value) => value + 1);
                    }}
                />
            )}
        </div>
    );
}

export default Accounts;