
import { NavLink } from 'react-router-dom';

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

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/accounts">
                    Accounts
                </NavLink>

                <NavLink to="/transactions">
                    Transactions
                </NavLink>

                <NavLink to="/reports">
                    Reports
                </NavLink>

                <p className="nav-label">SYSTEM</p>

                <NavLink to="/settings">
                    Settings
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <strong>Finance Platform</strong>
                <span>Personal Finance</span>
            </div>

        </aside>
    );
}

export default Sidebar;

