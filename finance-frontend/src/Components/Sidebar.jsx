function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">F</div>

                <div>
                    <h2>Finance</h2>
                    <span>Management Platform</span>
                </div>
            </div>

            <nav>
                <p className="nav-label">MAIN MENU</p>

                <a href="/dashboard" className="active">
                    Dashboard
                </a>

                <a href="/accounts">
                    Accounts
                </a>

                <a href="/transactions">
                    Transactions
                </a>

                <a href="/reports">
                    Reports
                </a>

                <p className="nav-label">SYSTEM</p>

                <a href="/settings">
                    Settings
                </a>
            </nav>

            <div className="sidebar-footer">
                <strong>Finance Platform</strong>
                <span>Personal Finance</span>
            </div>
        </aside>
    )
}

export default Sidebar