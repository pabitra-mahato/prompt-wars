import React from 'react';

export default function BudgetMeter({ budget, currentCost }) {
  const remaining = budget - currentCost;
  const isOverBudget = remaining < 0;
  
  // Calculate percentage (capped at 100 for display safety, but can be larger)
  const percent = budget > 0 ? (currentCost / budget) * 100 : 0;
  const displayPercent = Math.min(percent, 100);

  // Determine color status based on budget usage
  let statusClass = "within";
  let statusLabel = "🟢 Within Budget";
  let barColorClass = "";

  if (percent > 100) {
    statusClass = "over";
    statusLabel = "🔴 Over Budget";
    barColorClass = "danger";
  } else if (percent >= 85) {
    statusClass = "near";
    statusLabel = "🟡 Near Limit";
    barColorClass = "warning";
  }

  return (
    <div className="glass-panel budget-meter-card">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Budget Tracking</span>
        <span className={`budget-status-badge ${statusClass}`}>{statusLabel}</span>
      </h3>

      {/* Progress Bar */}
      <div className="budget-bar-container">
        <div 
          className={`budget-bar-fill ${barColorClass}`} 
          style={{ width: `${displayPercent}%` }}
        ></div>
      </div>

      {/* Stats Breakdown */}
      <div className="budget-stats">
        <div className="budget-stat-box">
          <div className="budget-stat-title">Budget</div>
          <div className="budget-stat-value budget">₹{budget}</div>
        </div>
        <div className="budget-stat-box">
          <div className="budget-stat-title">To Buy</div>
          <div className="budget-stat-value cost">₹{currentCost}</div>
        </div>
        <div className="budget-stat-box">
          <div className="budget-stat-title">Remaining</div>
          <div 
            className={`budget-stat-value remaining ${isOverBudget ? 'negative' : ''}`}
          >
            {isOverBudget ? `-₹${Math.abs(remaining)}` : `₹${remaining}`}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
        {isOverBudget 
          ? "⚠️ You are exceeding your budget. Consider swapping some premium ingredients for substitutes or using already available items."
          : percent >= 85 
            ? "💡 You are close to your limit, but still in the green."
            : "✨ Excellent! You have a comfortable buffer left in your budget."
        }
      </div>
    </div>
  );
}
