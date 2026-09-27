function SummaryCard({ title, value }) {
    return (
        <div className="summary-card">
            <p>{title}</p>
            <h2>{value}</h2>
        </div>
    )
}

export default SummaryCard