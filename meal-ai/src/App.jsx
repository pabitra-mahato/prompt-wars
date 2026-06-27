import { useState, useEffect } from 'react';
import { fetchMealSuggestions, fetchSubstitutes } from './services/gemini';
import BudgetMeter from './components/BudgetMeter';
import './App.css';

function App() {
  // Wizard state: 'home' | 'setup' | 'loading' | 'suggestions' | 'ingredients' | 'saved'
  const [step, setStep] = useState('home');
  
  // User Profile
  const [profile, setProfile] = useState({
    name: '',
    schedule: 'Office till 8PM',
    budget: 350,
    diet: 'Vegetarian',
    timeAvailable: 20,
    servings: 2,
    meals: ['Breakfast', 'Lunch', 'Dinner']
  });

  // Saved Plan State
  const [savedPlan, setSavedPlan] = useState(() => {
    const local = localStorage.getItem('nutrichef_saved_plan');
    return local ? JSON.parse(local) : null;
  });

  // API Configuration
  const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const isApiConfigured = !!rawApiKey && rawApiKey !== 'YOUR_GEMINI_API_KEY_HERE';
  const apiKey = isApiConfigured ? rawApiKey : '';

  // Suggestions & Shopping States
  const [mealPlanOptions, setMealPlanOptions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // Handle Confirm and Save Plan
  const handleConfirmAndSavePlan = () => {
    const finalPlan = {
      profile,
      meals: selectedPlan.meals,
      shoppingList,
      currentPlanCost
    };
    localStorage.setItem('nutrichef_saved_plan', JSON.stringify(finalPlan));
    setSavedPlan(finalPlan);
    setStep('saved');
  };

  // Substitution modal states
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subTargetIng, setSubTargetIng] = useState(null); // { id, name, mealName }
  const [substituteOptions, setSubstituteOptions] = useState([]);
  const [isLoadingSubstitutes, setIsLoadingSubstitutes] = useState(false);

  // Profile Input Change handlers
  const handleProfileChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleMealSelection = (mealType) => {
    setProfile(prev => {
      const current = prev.meals;
      if (current.includes(mealType)) {
        // keep at least one meal selected
        if (current.length === 1) return prev;
        return { ...prev, meals: current.filter(m => m !== mealType) };
      } else {
        return { ...prev, meals: [...current, mealType] };
      }
    });
  };

  // Trigger meal suggestions generation
  const handleGenerateMealPlan = async () => {
    // Validate profile
    if (!profile.name.trim()) {
      alert("Please enter your name!");
      return;
    }
    
    setStep('loading');
    setIsLoading(true);
    setApiError('');
    
    const messages = [
      "Gathering fresh local recipes...",
      "Analyzing nutritional content for your diet...",
      "Fitting within your cooking time limits...",
      "Comparing ingredient prices against your budget...",
      "Optimizing protein and macronutrient balance..."
    ];
    
    let msgIndex = 0;
    setLoadingMessage(messages[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2500);

    try {
      const planResponse = await fetchMealSuggestions(profile, apiKey);
      setMealPlanOptions(planResponse.options);
      // Default select the first option
      setSelectedPlan(planResponse.options[0]);
      setStep('suggestions');
    } catch (error) {
      console.error(error);
      setApiError(error.message || "Failed to fetch meal suggestions. Please check your API key or continue with Demo Mode.");
      setStep('setup');
    } finally {
      clearInterval(msgInterval);
      setIsLoading(false);
    }
  };

  // Approve a meal option plan
  const handleApprovePlan = (plan) => {
    setSelectedPlan(plan);
    
    // Extract all ingredients and flatten them into a unique list
    // If multiple meals contain the same ingredient, combine them, or show them by meal.
    // For shopping clarity, displaying ingredients grouped by meal is extremely helpful,
    // but a combined shopping checklist is cleaner. Let's merge duplicate ingredients if they have the same name,
    // or keep them separated by meal so they can swap substitutes in the context of a specific meal.
    // Separated by meal makes substitution MUCH cleaner, because "Rice" in "Rajma Rice" might have different substitutes
    // than "Oats" or other starches. Let's keep them with a unique ID and meal reference!
    let ingredientId = 1;
    const items = [];
    
    plan.meals.forEach(meal => {
      meal.ingredients.forEach(ing => {
        items.push({
          id: ingredientId++,
          mealName: meal.name,
          mealType: meal.type,
          name: ing.name,
          originalName: ing.name,
          quantity: ing.quantity,
          estimatedCost: ing.estimatedCost,
          originalCost: ing.estimatedCost,
          owned: false,
          isSubstituted: false,
          substituteNote: ''
        });
      });
    });
    
    setShoppingList(items);
    setStep('ingredients');
  };

  // Toggle checklist item "owned"
  const toggleIngredientOwned = (id) => {
    setShoppingList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, owned: !item.owned };
      }
      return item;
    }));
  };

  // Trigger Substitutes Fetch
  const handleSuggestSubstitute = async (item) => {
    setSubTargetIng(item);
    setSubModalOpen(true);
    setIsLoadingSubstitutes(true);
    setSubstituteOptions([]);

    try {
      const options = await fetchSubstitutes(item.name, item.mealName, apiKey);
      setSubstituteOptions(options);
    } catch (error) {
      console.error(error);
      alert("Failed to load substitutes. Using demo substitutions.");
    } finally {
      setIsLoadingSubstitutes(false);
    }
  };

  // Swap an ingredient with a substitute option
  const applySubstitute = (subOption) => {
    setShoppingList(prev => prev.map(item => {
      if (item.id === subTargetIng.id) {
        return {
          ...item,
          name: `${subOption.name} (Sub)`,
          estimatedCost: subOption.estimatedCost,
          isSubstituted: true,
          substituteNote: `Substituted for ${item.originalName}: ${subOption.note}`
        };
      }
      return item;
    }));
    setSubModalOpen(false);
    setSubTargetIng(null);
  };

  // Restore the original ingredient
  const restoreOriginalIngredient = (id) => {
    setShoppingList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: item.originalName,
          estimatedCost: item.originalCost,
          isSubstituted: false,
          substituteNote: ''
        };
      }
      return item;
    }));
  };

  // Calculate current purchase cost (only count items that the user doesn't already have)
  const currentPlanCost = shoppingList
    .filter(item => !item.owned)
    .reduce((sum, item) => sum + item.estimatedCost, 0);

  // Split shopping lists
  const needToBuyList = shoppingList.filter(item => !item.owned);
  const alreadyAvailableList = shoppingList.filter(item => item.owned);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-container" onClick={() => setStep('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">🍳</span>
          <h1 className="logo-text">NutriChef AI</h1>
        </div>
        
        {/* API Indicator removed for production configuration */}
      </header>

      {/* Main Content Router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Step Stepper Indicator (visible during wizard, suggestions, shopping) */}
        {step !== 'home' && step !== 'loading' && (
          <div className="stepper-container">
            <div className="stepper-line"></div>
            <div 
              className="stepper-progress-line"
              style={{
                width: 
                  step === 'setup' ? '0%' :
                  step === 'suggestions' ? '50%' : '100%'
              }}
            ></div>
            
            <div className={`step-node ${step === 'setup' ? 'active' : 'completed'}`}>
              <div className="step-circle">1</div>
              <div className="step-label">Profile</div>
            </div>
            
            <div className={`step-node ${step === 'suggestions' ? 'active' : step === 'ingredients' ? 'completed' : ''}`}>
              <div className="step-circle">2</div>
              <div className="step-label">Meal Suggestions</div>
            </div>
            
            <div className={`step-node ${step === 'ingredients' ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <div className="step-label">Shopping List</div>
            </div>
          </div>
        )}

        {/* Step 1: Home/Landing Screen */}
        {step === 'home' && (
          <div className="hero-section">
            <div className="hero-badge">AI-Powered Meal Prep</div>
            <h2 className="hero-title">
              Eat Healthy. <span>Stay on Budget.</span> Save Cooking Time.
            </h2>
            <p className="hero-subtitle">
              NutriChef AI creates customized meal plans based on your schedule, budget, and diet, checks off what you already have, suggests swaps, and keeps your wallet green.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-primary btn-large" onClick={() => setStep('setup')}>
                {savedPlan ? 'Plan New Meals ➔' : 'Create My Meal Plan ➔'}
              </button>
              {savedPlan && (
                <button className="btn btn-secondary btn-large" onClick={() => {
                  setProfile(savedPlan.profile);
                  setSelectedPlan({ meals: savedPlan.meals });
                  setShoppingList(savedPlan.shoppingList);
                  setStep('saved');
                }}>
                  View Saved Plan 📁
                </button>
              )}
              {!isApiConfigured && !savedPlan && (
                <button className="btn btn-secondary btn-large" onClick={() => setShowApiModal(true)}>
                  Configure API Key
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Onboarding Questionnaire Wizard */}
        {step === 'setup' && (
          <div className="glass-panel wizard-card">
            <h2 className="wizard-title">Let's craft your customized plan</h2>
            <p className="wizard-subtitle">We will generate personalized meal options tailored to your constraints.</p>

            {apiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#fca5a5' }}>
                <strong>⚠️ Generation Error:</strong> {apiError}
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setApiError('')}>
                    Dismiss & Use Mock Demo Mode
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="form-row">
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name-input">Your Name</label>
                  <input 
                    type="text" 
                    id="name-input"
                    className="input-control" 
                    placeholder="E.g., Pabitra" 
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>

                {/* Schedule */}
                <div className="form-group">
                  <label htmlFor="schedule-input">Today's Schedule</label>
                  <input 
                    type="text" 
                    id="schedule-input"
                    className="input-control" 
                    placeholder="E.g., Office till 8PM, Busy day" 
                    value={profile.schedule}
                    onChange={(e) => handleProfileChange('schedule', e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {['Office till 8PM', 'Work from Home', 'Gym / Training Day', 'Relaxed Weekend'].map((sch) => (
                      <span 
                        key={sch}
                        onClick={() => handleProfileChange('schedule', sch)}
                        style={{
                          fontSize: '0.75rem',
                          background: profile.schedule === sch ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${profile.schedule === sch ? 'var(--primary)' : 'var(--border-light)'}`,
                          color: profile.schedule === sch ? 'var(--primary)' : 'var(--text-secondary)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {sch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                {/* Budget */}
                <div className="form-group">
                  <label htmlFor="budget-input">Daily Budget (INR)</label>
                  <div className="budget-input-wrapper">
                    <span className="budget-symbol">₹</span>
                    <input 
                      type="number" 
                      id="budget-input"
                      className="input-control budget-input" 
                      min="100" 
                      max="2000"
                      value={profile.budget}
                      onChange={(e) => handleProfileChange('budget', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {[150, 250, 350, 500].map((b) => (
                      <span 
                        key={b}
                        onClick={() => handleProfileChange('budget', b)}
                        style={{
                          fontSize: '0.75rem',
                          background: profile.budget === b ? 'var(--accent-glow)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${profile.budget === b ? 'var(--accent)' : 'var(--border-light)'}`,
                          color: profile.budget === b ? 'var(--accent)' : 'var(--text-secondary)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ₹{b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Diet */}
                <div className="form-group">
                  <label>Dietary Preference</label>
                  <div className="grid-chips">
                    {['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Gluten-Free'].map((d) => (
                      <div 
                        key={d}
                        className={`chip-option ${profile.diet === d ? 'selected' : ''}`}
                        onClick={() => handleProfileChange('diet', d)}
                      >
                        <span className="chip-icon">
                          {d === 'Vegetarian' ? '🥗' : d === 'Vegan' ? '🌱' : d === 'Non-Vegetarian' ? '🍗' : '🌾'}
                        </span>
                        <span className="chip-label">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                {/* Cooking Time Available */}
                <div className="form-group">
                  <label htmlFor="time-input">Cooking Time Available per Meal</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="range" 
                      id="time-input"
                      min="10" 
                      max="60" 
                      step="5"
                      style={{ flex: 1, accentColor: 'var(--primary)' }}
                      value={profile.timeAvailable}
                      onChange={(e) => handleProfileChange('timeAvailable', Number(e.target.value))}
                    />
                    <span style={{ fontWeight: '600', color: 'var(--primary)', minWidth: '60px' }}>
                      {profile.timeAvailable} mins
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {[15, 20, 30, 45].map((t) => (
                      <span 
                        key={t}
                        onClick={() => handleProfileChange('timeAvailable', t)}
                        style={{
                          fontSize: '0.75rem',
                          background: profile.timeAvailable === t ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${profile.timeAvailable === t ? 'var(--primary)' : 'var(--border-light)'}`,
                          color: profile.timeAvailable === t ? 'var(--primary)' : 'var(--text-secondary)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {t} mins
                      </span>
                    ))}
                  </div>
                </div>

                {/* People to Cook For (Servings) */}
                <div className="form-group">
                  <label>People to Cook For (Servings)</label>
                  <div className="servings-control">
                    <button 
                      className="servings-btn" 
                      onClick={() => handleProfileChange('servings', Math.max(1, profile.servings - 1))}
                    >
                      -
                    </button>
                    <span className="servings-value">{profile.servings}</span>
                    <button 
                      className="servings-btn" 
                      onClick={() => handleProfileChange('servings', profile.servings + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Target Meals checkboxes */}
              <div className="form-group">
                <label>Meals to Plan</label>
                <div className="check-cards">
                  {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
                    const isSelected = profile.meals.includes(meal);
                    return (
                      <div 
                        key={meal}
                        className={`check-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleMealSelection(meal)}
                      >
                        <div className="check-box">
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="check-card-label">
                          {meal === 'Breakfast' ? '🥞 ' : meal === 'Lunch' ? '🍛 ' : '🍽️ '}
                          {meal}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="wizard-actions">
              <button className="btn btn-secondary" onClick={() => setStep('home')}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleGenerateMealPlan}>
                Generate AI Meal Plan 🍳
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Loading Screen */}
        {step === 'loading' && (
          <div className="glass-panel loader-container">
            <div className="loader-animation">
              <div className="loader-ring"></div>
              <div className="loader-ring"></div>
              <div className="loader-ring"></div>
              <div className="loader-ring"></div>
            </div>
            <h2 className="loader-message">{loadingMessage}</h2>
            <p className="loader-sub">This will take just a few seconds...</p>
          </div>
        )}

        {/* Step 4: AI suggestions with nutrition score */}
        {step === 'suggestions' && (
          <div>
            <div className="greeting-title">
              Hello, <span>{profile.name}</span>! Here are your plans:
            </div>
            <p className="greeting-text">
              We generated two specialized plan options tailored to your daily budget of <strong>₹{profile.budget}</strong> and cooking time of <strong>{profile.timeAvailable} mins</strong>.
            </p>

            {/* Plan selection Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {mealPlanOptions.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                return (
                  <div 
                    key={plan.id}
                    className={`glass-panel ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold' }}>
                      Option {plan.id}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>{plan.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{plan.description}</p>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', color: 'var(--accent)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                      Est. Cost: ₹{plan.totalCost}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Meal Items from selected plan */}
            <div className="meal-list">
              {selectedPlan?.meals.map((meal, index) => {
                const mealTypeClass = meal.type.toLowerCase();
                const scoreColor = meal.nutritionScore >= 90 ? 'high' : '';
                return (
                  <div key={index} className={`meal-card ${mealTypeClass}`}>
                    <div className="meal-icon-box">
                      {meal.type === 'Breakfast' ? '🥞' : meal.type === 'Lunch' ? '🍛' : '🍽️'}
                    </div>
                    
                    <div className="meal-info">
                      <div className="meal-type-label">{meal.type}</div>
                      <h3>{meal.name}</h3>
                      <div className="meal-meta-row">
                        <span className="meal-meta-item">⏱️ {meal.cookTime} mins</span>
                        <span className="meal-meta-item">🔥 {meal.calories} kcal</span>
                      </div>
                    </div>

                    <div className="meal-nutrition">
                      <span className={`score-badge ${scoreColor}`}>
                        ⭐ Nutrition: {meal.nutritionScore}/100
                      </span>
                      <div className="macro-grid">
                        <span className="macro-tag">P: <span>{meal.macros.protein}g</span></span>
                        <span className="macro-tag">C: <span>{meal.macros.carbs}g</span></span>
                        <span className="macro-tag">F: <span>{meal.macros.fat}g</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="wizard-actions" style={{ border: 'none', marginTop: '0' }}>
              <button className="btn btn-secondary" onClick={() => setStep('setup')}>
                ⬅ Modify Preferences
              </button>
              <button className="btn btn-primary btn-large" onClick={() => handleApprovePlan(selectedPlan)}>
                Approve Plan & Customize Groceries ✔
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Ingredients Shopping List and Budget Meter */}
        {step === 'ingredients' && (
          <div>
            <div className="greeting-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span>Grocery List & Budget Meter</span>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setStep('suggestions')}>
                ⬅ Back to Options
              </button>
            </div>
            <p className="greeting-text">
              Check off ingredients you already have. For items you don't have, click "Suggest Substitute" to customize.
            </p>

            <div className="shopping-layout">
              {/* Left Column: Shopping checklist */}
              <div>
                {/* Need to Buy Checklist */}
                <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Need to Buy</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                      {needToBuyList.length} items
                    </span>
                  </h3>
                  
                  {needToBuyList.length === 0 ? (
                    <div style={{ padding: '1rem 0', color: 'var(--primary)', textAlign: 'center', fontWeight: '500' }}>
                      🎉 You have all ingredients in stock! Your shopping cost is ₹0.
                    </div>
                  ) : (
                    needToBuyList.map((item) => (
                      <div key={item.id} className="ingredient-item">
                        <div className="ingredient-left" onClick={() => toggleIngredientOwned(item.id)}>
                          <div className="check-box" style={{ flexShrink: 0 }}>
                            {/* Unchecked */}
                          </div>
                          <div>
                            <div className="ingredient-name">{item.name}</div>
                            <span className="ingredient-meta">{item.quantity} · For {item.mealName}</span>
                            {item.isSubstituted && (
                              <span className="substitute-note">
                                {item.substituteNote}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="ingredient-price">₹{item.estimatedCost}</span>
                          
                          {item.isSubstituted ? (
                            <button 
                              className="substitute-btn"
                              style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                              onClick={() => restoreOriginalIngredient(item.id)}
                            >
                              Restore
                            </button>
                          ) : (
                            <button 
                              className="substitute-btn"
                              onClick={() => handleSuggestSubstitute(item)}
                            >
                              Substitute
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Already Available Checklist */}
                <div className="glass-panel">
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Already Available (In Pantry)</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                      {alreadyAvailableList.length} items
                    </span>
                  </h3>
                  
                  {alreadyAvailableList.length === 0 ? (
                    <div style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
                      Mark ingredients you already have to save budget.
                    </div>
                  ) : (
                    alreadyAvailableList.map((item) => (
                      <div key={item.id} className="ingredient-item owned">
                        <div className="ingredient-left" onClick={() => toggleIngredientOwned(item.id)}>
                          <div className="check-box" style={{ background: 'var(--primary)', borderColor: 'var(--primary)', flexShrink: 0 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0b0f19" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <div>
                            <div className="ingredient-name">{item.name}</div>
                            <span className="ingredient-meta">{item.quantity} · In Stock</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="ingredient-price">₹{item.estimatedCost}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Sticky Budget Tracker */}
              <div>
                <BudgetMeter budget={profile.budget} currentCost={currentPlanCost} />
                
                <button 
                  className="btn btn-accent btn-large btn-full" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={handleConfirmAndSavePlan}
                >
                  Confirm & Save Meal Plan ➔
                </button>
                <button 
                  className="btn btn-secondary btn-full" 
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => {
                    if (confirm("Reset everything and start a new plan?")) {
                      setStep('setup');
                    }
                  }}
                >
                  Start Over 🔄
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Final Saved Dashboard Summary */}
        {step === 'saved' && savedPlan && (
          <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem' }}>🎉</span>
              <h2 className="wizard-title" style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>
                Meal Plan Confirmed & Saved!
              </h2>
              <p className="wizard-subtitle" style={{ marginBottom: 0 }}>
                Excellent choice, {savedPlan.profile.name}! Your grocery shopping list and recipe plan are saved.
              </p>
            </div>

            {/* Plan Info Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              
              {/* Left Widget: Meals overview */}
              <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)' }}>Your Approved Menu</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {savedPlan.meals.map((meal, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                      <div>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>
                          {meal.type}
                        </strong>
                        <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{meal.name}</span>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div>⏱️ {meal.cookTime} mins</div>
                        <div>🔥 {meal.calories} kcal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Widget: Budget statistics */}
              <div>
                <BudgetMeter budget={savedPlan.profile.budget} currentCost={savedPlan.currentPlanCost} />
              </div>
            </div>

            {/* Shopping List Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              
              {/* Need to buy */}
              <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>
                  🛒 Grocery Shopping List ({savedPlan.shoppingList.filter(i => !i.owned).length} items)
                </h3>
                {savedPlan.shoppingList.filter(i => !i.owned).length === 0 ? (
                  <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                    You have all ingredients in stock! No shopping needed.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {savedPlan.shoppingList.filter(i => !i.owned).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                        <span>
                          <strong>{item.name}</strong> ({item.quantity})
                          {item.isSubstituted && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: '0.5rem', fontStyle: 'italic' }}>Sub</span>}
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--accent)' }}>₹{item.estimatedCost}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0 0 0', marginTop: '0.5rem', borderTop: '2px solid var(--border-light)', fontWeight: 'bold' }}>
                      <span>Total Estimated Expense</span>
                      <span style={{ color: 'var(--accent)' }}>₹{savedPlan.currentPlanCost}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Already Available */}
              {savedPlan.shoppingList.filter(i => i.owned).length > 0 && (
                <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                    🏡 Already in Pantry ({savedPlan.shoppingList.filter(i => i.owned).length} items)
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {savedPlan.shoppingList.filter(i => i.owned).map((item, idx) => (
                      <span 
                        key={idx} 
                        style={{
                          fontSize: '0.8rem',
                          background: 'rgba(16, 185, 129, 0.08)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px'
                        }}
                      >
                        ✓ {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="wizard-actions" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    // Set active states back to edit ingredients
                    setStep('ingredients');
                  }}
                >
                  ✏️ Edit Plan
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    window.print();
                  }}
                >
                  🖨️ Print List
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this saved plan?")) {
                      localStorage.removeItem('nutrichef_saved_plan');
                      setSavedPlan(null);
                      setStep('home');
                    }
                  }}
                >
                  🗑️ Delete Saved Plan
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setStep('setup');
                  }}
                >
                  Create New Plan 🔄
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', padding: '1.5rem 0', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        NutriChef AI Meal App © 2026. Made with Google Gemini API.
      </footer>

      {/* Gemini API Key Configuration Modal Removed */}

      {/* Substitutes Picker Modal */}
      {subModalOpen && subTargetIng && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>
                Substitutes for {subTargetIng.name}
              </h3>
              <button className="modal-close" onClick={() => {
                setSubModalOpen(false);
                setSubTargetIng(null);
              }}>×</button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Swapping ingredient in recipe <strong>{subTargetIng.mealName}</strong>. Choose a suitable replacement below:
            </p>

            {isLoadingSubstitutes ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
                <div className="loader-ring" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '3.5rem' }}>
                  Asking AI for culinary replacements...
                </div>
              </div>
            ) : (
              <div className="substitute-list">
                {substituteOptions.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>
                    No substitutes found.
                  </div>
                ) : (
                  substituteOptions.map((option, idx) => (
                    <div 
                      key={idx}
                      className="substitute-option-card"
                      onClick={() => applySubstitute(option)}
                    >
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {option.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                          {option.note}
                        </div>
                      </div>
                      <span className="ingredient-price" style={{ flexShrink: 0 }}>
                        ₹{option.estimatedCost}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setSubModalOpen(false);
                  setSubTargetIng(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
