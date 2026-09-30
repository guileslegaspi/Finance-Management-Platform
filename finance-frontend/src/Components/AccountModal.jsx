import { useState } from "react";
import "../styles/AccountModal.css";

function AccountModal({ account, onClose, onAccountSaved }) {
    const [name, setName] = useState(account?.name ?? "");

    const [accountType, setAccountType] = useState(
        account?.type?.toString() ?? "0"
    );

    const [balance, setBalance] = useState(
        account?.balance?.toString() ?? ""
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const isEditing = Boolean(account);

            const url = isEditing
                ? `https://localhost:7012/api/Accounts/${account.id}`
                : "https://localhost:7012/api/Accounts";

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    type: Number(accountType),
                    balance: Number(balance)
                })
            });

            if (!response.ok) {
                throw new Error(
                    isEditing
                        ? "Failed to update account."
                        : "Failed to create account."
                );
            }

            onAccountSaved();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="account-modal-overlay">
            <div className="account-modal">

                <div className="account-modal-header">
                    <div>
                        <h2>
                            {account
                                ? "Edit Account"
                                : "Add Account"}
                        </h2>

                        <p>
                            {account
                                ? "Update your financial account details."
                                : "Add a financial account to your profile."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="account-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="accountName">
                            Account Name
                        </label>

                        <input
                            id="accountName"
                            type="text"
                            placeholder="e.g. BPI Savings"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="accountType">
                            Account Type
                        </label>

                        <select
                            id="accountType"
                            value={accountType}
                            onChange={(event) =>
                                setAccountType(event.target.value)
                            }
                        >
                            <option value="0">
                                Cash
                            </option>

                            <option value="1">
                                Bank
                            </option>

                            <option value="2">
                                E-Wallet
                            </option>

                            <option value="3">
                                Credit Card
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="balance">
                            Initial Balance
                        </label>

                        <input
                            id="balance"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={balance}
                            onChange={(event) =>
                                setBalance(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="account-modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-button"
                        >
                            {account
                                ? "Save Changes"
                                : "Create Account"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default AccountModal;