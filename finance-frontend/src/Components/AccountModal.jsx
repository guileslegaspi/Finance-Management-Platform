
import { useState } from "react";
import "../styles/AccountModal.css";

function AccountModal({ onClose, onAccountCreated }) {
    const [name, setName] = useState("");
    const [accountType, setAccountType] = useState("Cash");
    const [balance, setBalance] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://localhost:7012/api/Accounts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${ token } `
                    },
                    body: JSON.stringify({
                        name: name,
                        accountType: accountType,
                        balance: Number(balance)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create account.");
            }

            onAccountCreated();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="account-modal-overlay">
            <div className="account-modal">
                <div className="account-modal-header">
                    <div>
                        <h2>Add Account</h2>
                        <p>Add a financial account to your profile.</p>
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
                            onChange={(event) => setName(event.target.value)}
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
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                            <option value="EWallet">E-Wallet</option>
                            <option value="CreditCard">Credit Card</option>
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
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AccountModal;

