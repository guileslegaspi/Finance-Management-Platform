import '../App.css'
import SummaryCard from './SummaryCard'
import FinancialOverview from './FinancialOverview'

function Dashboard() {
    return (
        <>
            <h1>Finance Management</h1>
            <p>Welcome to your financial dashboard.</p>

            <div className="summary-grid">
                <SummaryCard
                    title="Total Balance"
                    value="₱125,000"
                />

                <SummaryCard
                    title="Savings"
                    value="₱80,000"
                />

                <SummaryCard
                    title="Income"
                    value="₱45000"
                />

                <SummaryCard
                    title="Expense"
                    value="₱18500"
                />
            </div>

            <FinancialOverview />
        </>
    )
}

export default Dashboard