"""
================================================================================
COMPOST QUALITY ANALYSIS SYSTEM - FLASK BACKEND API
================================================================================
Full-stack web application backend with integrated ML model
Author: Your Name
Date: December 29, 2025
Version: 1.0
================================================================================
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# INITIALIZE FLASK APP
# ============================================================================

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# ============================================================================
# LOAD AND TRAIN MODEL
# ============================================================================

print("\n" + "="*80)
print("LOADING DATASETS AND TRAINING MODEL")
print("="*80)

# Load datasets
print("📁 Loading datasets...")
df_compost = pd.read_csv('dtl.csv')
df_plants = pd.read_csv('plant.csv')

print(f"✓ Compost data: {df_compost.shape[0]} samples")
print(f"✓ Plant data: {df_plants.shape[0]} species")

# Define features
FEATURE_NAMES = [
    'Temperature', 'MC(%)', 'pH', 'C/N Ratio', 'Ammonia(mg/kg)',
    'Nitrate(mg/kg)', 'TN(%)', 'TOC(%)', 'EC(ms/cm)', 'OM(%)',
    'T Value', 'GI(%)'
]
TARGET = 'Score'

# Prepare data
print("\n🔧 Preparing training data...")
X = df_compost[FEATURE_NAMES].copy()
y = df_compost[TARGET].copy()

# Handle missing values
X = X.fillna(X.mean())
y = y.fillna(y.mean())

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
print("📊 Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
print("🤖 Training Random Forest model...")
model = RandomForestRegressor(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
test_r2 = r2_score(y_test, y_pred)
test_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
test_mae = mean_absolute_error(y_test, y_pred)

print("\n📈 Model Performance:")
print(f"  R² Score: {test_r2:.4f}")
print(f"  RMSE: {test_rmse:.4f}")
print(f"  MAE: {test_mae:.4f}")

# ============================================================================
# COMPOST ANALYSIS SYSTEM CLASS
# ============================================================================

class CompostAnalysisSystem:
    """Complete system with compost analysis and plant suitability"""

    def __init__(self, model, scaler, plants_df, feature_names):
        self.model = model
        self.scaler = scaler
        self.plants_df = plants_df
        self.feature_names = feature_names

    def predict_score(self, compost_params):
        """Predict compost quality score"""
        X = pd.DataFrame([compost_params])[self.feature_names]
        X_scaled = self.scaler.transform(X)
        score = self.model.predict(X_scaled)[0]
        return float(max(0, min(100, score)))

    def classify_stage(self, score):
        """Classify maturity stage"""
        if score < 35:
            return "Initial"
        elif score < 50:
            return "Active"
        elif score < 65:
            return "Stabilization"
        else:
            return "Mature"

    def estimate_days_to_maturity(self, score):
        """Estimate days to full maturity"""
        target_score = 70
        if score >= target_score:
            return 0
        elif score >= 65:
            return int(2 + (target_score - score) * 0.4)
        elif score >= 60:
            return int(4 + (65 - score) * 0.6)
        elif score >= 50:
            return int(8 + (60 - score) * 0.8)
        elif score >= 40:
            return int(12 + (50 - score) * 1.0)
        else:
            days = int(15 + (40 - score) * 0.8)
            return min(days, 25)

    def generate_plant_specific_suggestions(self, params, plant_name, plant_data, is_suitable):
        """Generate plant-specific growth impact suggestions"""
        suggestions = []

        # pH impact
        if params['pH'] >= plant_data['Min pH'] and params['pH'] <= plant_data['Max pH']:
            ph_status = "✓ OPTIMAL"
            ph_impact = f"pH {params['pH']:.1f} is perfect for {plant_name}. Supports nutrient availability, microbial activity, and root development."
        elif params['pH'] < plant_data['Min pH']:
            ph_status = "⚠ LOW"
            ph_impact = f"pH {params['pH']:.1f} is too acidic. {plant_name} needs {plant_data['Min pH']:.1f}-{plant_data['Max pH']:.1f}. Reduces nutrient uptake."
        else:
            ph_status = "⚠ HIGH"
            ph_impact = f"pH {params['pH']:.1f} is too alkaline. {plant_name} prefers {plant_data['Min pH']:.1f}-{plant_data['Max pH']:.1f}. Causes nutrient lockup."
        suggestions.append(f"pH: {ph_status} - {ph_impact}")

        # GI impact
        if params['GI(%)'] >= plant_data['Min GI(%)']:
            gi_status = "✓ SAFE"
            if params['GI(%)'] >= 85:
                gi_impact = f"GI {params['GI(%)']:.0f}% is excellent. Strong seed germination (85%+), vigorous seedling, robust early growth."
            else:
                gi_impact = f"GI {params['GI(%)']:.0f}% meets minimum. Acceptable germination but some slower initial growth."
        else:
            gi_status = "✗ TOXIC"
            gi_impact = f"GI {params['GI(%)']:.0f}% is too low. Phytotoxic - severely inhibits seed germination and damages seedling roots."
        suggestions.append(f"Germination Index: {gi_status} - {gi_impact}")

        # TN impact
        if params['TN(%)'] >= plant_data['Min TN(%)']:
            tn_status = "✓ ADEQUATE"
            if params['TN(%)'] >= 2.0:
                tn_impact = f"TN {params['TN(%)']:.2f}% is high. Excellent vegetative growth, dark foliage, strong shoots."
            else:
                tn_impact = f"TN {params['TN(%)']:.2f}% meets requirement. Normal vegetative growth throughout season."
        else:
            tn_status = "✗ DEFICIENT"
            tn_impact = f"TN {params['TN(%)']:.2f}% is low. Nitrogen deficiency - stunted growth, yellowing, reduced yields."
        suggestions.append(f"Total Nitrogen: {tn_status} - {tn_impact}")

        # OM impact
        if params['OM(%)'] >= plant_data['Min OM(%)']:
            om_status = "✓ GOOD"
            if params['OM(%)'] >= 60:
                om_impact = f"OM {params['OM(%)']:.0f}% is excellent. Superior water retention, slow nutrient release, strong root structure."
            else:
                om_impact = f"OM {params['OM(%)']:.0f}% is adequate. Moderate water retention and nutrient buffering."
        else:
            om_status = "✗ LOW"
            om_impact = f"OM {params['OM(%)']:.0f}% is low. Poor water retention, limited nutrients, weak soil structure."
        suggestions.append(f"Organic Matter: {om_status} - {om_impact}")

        # C/N impact
        if params['C/N Ratio'] <= plant_data['Max C/N']:
            cn_status = "✓ BALANCED"
            cn_impact = f"C/N ratio {params['C/N Ratio']:.1f} is ideal. Quick nitrogen release supports vegetative growth."
        else:
            cn_status = "⚠ IMBALANCED"
            cn_impact = f"C/N ratio {params['C/N Ratio']:.1f} is high. Slow nitrogen release delays initial growth."
        suggestions.append(f"C/N Ratio: {cn_status} - {cn_impact}")

        # EC impact
        if params['EC(ms/cm)'] <= plant_data['Max EC']:
            ec_status = "✓ SAFE"
            if params['EC(ms/cm)'] <= 2.5:
                ec_impact = f"EC {params['EC(ms/cm)']:.1f} is very low. Optimal root water uptake, no salt stress."
            else:
                ec_impact = f"EC {params['EC(ms/cm)']:.1f} is acceptable. Low-moderate salt won't hinder growth."
        else:
            ec_status = "✗ SALINE"
            ec_impact = f"EC {params['EC(ms/cm)']:.1f} is too high. Salt stress - reduced water uptake, wilting, leaf burn."
        suggestions.append(f"Electrical Conductivity: {ec_status} - {ec_impact}")

        # Growth potential summary
        suggestions.append("\n" + "="*80)
        if is_suitable:
            suggestions.append(f"🌱 GROWTH POTENTIAL FOR {plant_name.upper()}: EXCELLENT")
            suggestions.append("  • Seedling: Fast germination and robust root establishment")
            suggestions.append("  • Vegetative: Vigorous shoot growth and healthy foliage")
            suggestions.append("  • Reproductive: Good flowering/fruiting with minimal stress")
            suggestions.append("  • Harvest: High-quality yields with optimal nutrients")
        else:
            suggestions.append(f"🌱 GROWTH POTENTIAL FOR {plant_name.upper()}: LIMITED")
            suggestions.append("  • Early growth may be slower")
            suggestions.append("  • Nutrient availability or toxicity issues")
            suggestions.append("  • May need amendments between growth stages")
            suggestions.append("  • Lower yields than optimized compost")
        suggestions.append("="*80)

        return suggestions

    def get_plant_growth_profile(self, plant_name):
        """Get growth characteristics for plants"""
        growth_profiles = {
            'Pineapple': {
                'growth_rate': 'Slow to Medium',
                'time_to_harvest_days': '400-600',
                'advantages': ['Perennial crop - 3-4 years yield', 'Drought tolerant', 'Acid soil tolerant', 'Low maintenance'],
                'disadvantages': ['Very long maturation', 'Requires well-draining soil', 'Sensitive to waterlogging', 'Slow initial growth'],
                'yield_potential': '40-50 tons/hectare'
            },
            'Jackfruit': {
                'growth_rate': 'Medium',
                'time_to_harvest_days': '2-3 years',
                'advantages': ['Large fruit yield', 'Tolerates poor soils', 'Climate resilient', 'Long productive life (20-40 years)'],
                'disadvantages': ['High water requirement', 'Fruit rot in wet climate', 'Large canopy needs space'],
                'yield_potential': '20-30 tons/hectare'
            },
            'Sapota (Chikoo)': {
                'growth_rate': 'Slow',
                'time_to_harvest_days': '3-4 years',
                'advantages': ['Highly nutritious', 'Drought resistant', 'Long productive life (40+ years)', 'Good market value'],
                'disadvantages': ['3-4 years before fruiting', 'Fruit cracking in rains', 'Needs regular pruning'],
                'yield_potential': '15-25 tons/hectare'
            },
            'Custard Apple': {
                'growth_rate': 'Medium',
                'time_to_harvest_days': '2-3 years',
                'advantages': ['Excellent taste', 'Heat and drought tolerant', 'Quick maturity'],
                'disadvantages': ['Needs hand pollination', 'Fruit drop in unsuitable conditions', 'Moderate pest pressure'],
                'yield_potential': '10-15 tons/hectare'
            },
            'Watermelon': {
                'growth_rate': 'Fast',
                'time_to_harvest_days': '70-100',
                'advantages': ['Quick harvest', 'High water content', 'Good market demand', 'Flexible spacing'],
                'disadvantages': ['Requires consistent irrigation', 'High nitrogen demand', 'Fungal disease risk', 'Short shelf life'],
                'yield_potential': '25-35 tons/hectare'
            },
            'Muskmelon': {
                'growth_rate': 'Fast',
                'time_to_harvest_days': '80-120',
                'advantages': ['Premium price', 'High sugar with quality compost', 'Good export potential', 'Vine covers quickly'],
                'disadvantages': ['Requires excellent drainage', 'High nitrogen boost needed', 'Powdery mildew susceptible', 'Salt stress sensitive'],
                'yield_potential': '20-30 tons/hectare'
            },
            'Brinjal (Eggplant)': {
                'growth_rate': 'Medium',
                'time_to_harvest_days': '60-90',
                'advantages': ['Long season (8-10 months)', 'Continuous harvesting', 'High market demand', 'Multiple harvests'],
                'disadvantages': ['Borer susceptible', 'Requires consistent watering', 'Heavy feeder'],
                'yield_potential': '30-40 tons/hectare'
            },
            'Bottle Gourd': {
                'growth_rate': 'Fast',
                'time_to_harvest_days': '60-70',
                'advantages': ['High productivity', 'Prolific fruiting', 'Vertical farming suitable', 'Long shelf life'],
                'disadvantages': ['Needs strong support', 'Powdery mildew risk', 'Quality drops in extreme heat'],
                'yield_potential': '25-35 tons/hectare'
            },
            'Drumstick (Moringa)': {
                'growth_rate': 'Fast',
                'time_to_harvest_days': '9 months',
                'advantages': ['Super nutritious', 'Nitrogen-fixing tree', 'Low input', 'Multiple harvests/year'],
                'disadvantages': ['Frost sensitive', 'Pods become fibrous', 'Needs pruning', 'Leaf quality in dry season'],
                'yield_potential': '40-50 tons/hectare'
            },
            'Amaranth': {
                'growth_rate': 'Fast',
                'time_to_harvest_days': '40-50',
                'advantages': ['Rapid growth', 'Multiple cycles/year', 'Highly nutritious', 'Excellent soil builder'],
                'disadvantages': ['Leaves toughen if mature', 'Damping off risk', 'Requires high nitrogen'],
                'yield_potential': '20-25 tons/hectare'
            },
        }

        return growth_profiles.get(plant_name, {
            'growth_rate': 'Variable',
            'time_to_harvest_days': 'Consult extension',
            'advantages': ['Check local variety data'],
            'disadvantages': ['Variety specific'],
            'yield_potential': 'Varies by conditions'
        })

    def analyze_plant_suitability_detailed(self, params):
        """Plant suitability analysis with growth impact"""
        suitable = []
        conditional = []
        not_suitable = []

        for _, plant in self.plants_df.iterrows():
            plant_type = plant['Plant Type']
            plant_name = plant['Plant Name']

            # Check all parameters
            checks = {
                'pH': plant['Min pH'] <= params['pH'] <= plant['Max pH'],
                'C/N': params['C/N Ratio'] <= plant['Max C/N'],
                'GI': params['GI(%)'] >= plant['Min GI(%)'],
                'EC': params['EC(ms/cm)'] <= plant['Max EC'],
                'TN': params['TN(%)'] >= plant['Min TN(%)'],
                'OM': params['OM(%)'] >= plant['Min OM(%)']
            }

            match_pct = (sum(checks.values()) / len(checks)) * 100
            growth_profile = self.get_plant_growth_profile(plant_name)

            # Generate failure reasons
            reasons = []
            if not checks['pH']:
                if params['pH'] < plant['Min pH']:
                    reasons.append(f"pH too low ({params['pH']:.1f}, needs ≥{plant['Min pH']:.1f})")
                else:
                    reasons.append(f"pH too high ({params['pH']:.1f}, needs ≤{plant['Max pH']:.1f})")
            if not checks['GI']:
                reasons.append(f"Phytotoxic - GI {params['GI(%)']:.0f}% (needs ≥{plant['Min GI(%)']:.0f}%)")
            if not checks['C/N']:
                reasons.append(f"C/N ratio high ({params['C/N Ratio']:.1f}, needs ≤{plant['Max C/N']:.0f})")
            if not checks['EC']:
                reasons.append(f"Salt high ({params['EC(ms/cm)']:.1f} ms/cm, needs ≤{plant['Max EC']:.1f})")
            if not checks['TN']:
                reasons.append(f"Nitrogen low ({params['TN(%)']:.2f}%, needs ≥{plant['Min TN(%)']:.2f}%)")
            if not checks['OM']:
                reasons.append(f"OM low ({params['OM(%)']:.0f}%, needs ≥{plant['Min OM(%)']:.0f}%)")

            plant_suggestions = self.generate_plant_specific_suggestions(
                params, plant_name, plant, is_suitable=(match_pct >= 90)
            )

            # Categorize plants
            if match_pct >= 90:
                suitable.append({
                    "Plant_Type": plant_type,
                    "Plant_Name": plant_name,
                    "Usage_Advice": "Safe for immediate use. All parameters optimal.",
                    "Growth_Rate": growth_profile['growth_rate'],
                    "Time_to_Harvest": growth_profile['time_to_harvest_days'],
                    "Advantages": growth_profile['advantages'],
                    "Disadvantages": growth_profile['disadvantages'],
                    "Yield_Potential": growth_profile['yield_potential'],
                    "Compost_Impact_on_Growth": plant_suggestions
                })
            elif match_pct >= 65:
                critical_failures = [r for r in reasons if 'Phytotoxic' in r or 'Salt' in r]
                when_to_use = "After maturation" if critical_failures else "After amendments"

                conditional.append({
                    "Plant_Type": plant_type,
                    "Plant_Name": plant_name,
                    "Reason": "; ".join(reasons[:2]),
                    "When_to_Use": when_to_use,
                    "Growth_Rate": growth_profile['growth_rate'],
                    "Time_to_Harvest": growth_profile['time_to_harvest_days'],
                    "Advantages": growth_profile['advantages'],
                    "Disadvantages": growth_profile['disadvantages'],
                    "Yield_Potential": growth_profile['yield_potential'],
                    "Compost_Impact_on_Growth": plant_suggestions
                })
            else:
                not_suitable.append({
                    "Plant_Type": plant_type,
                    "Plant_Name": plant_name,
                    "Reason": reasons[0] if reasons else "Multiple constraints"
                })

        return {
            "Suitable_Plants_For_Use": suitable,
            "Conditionally_Usable_Plants": conditional,
            "Not_Suitable_Plants": not_suitable
        }

    def generate_compost_improvements(self, params, score):
        """Generate improvement suggestions"""
        suggestions = []

        # Temperature
        temp = params['Temperature']
        if temp > 55 or temp < 20:
            status = "High" if temp > 55 else "Low"
            priority = "High" if temp > 55 else "Medium"
            action = [
                f"Turn pile immediately to dissipate heat" if temp > 55 else f"Add nitrogen-rich greens (grass, manure)",
                "Monitor temperature daily with compost thermometer",
                "Ensure moisture 50-60% for microbial activity",
                "Increase pile size if too small" if temp < 20 else "Reduce pile size or spread material",
                f"Target 20-40°C within 3-5 days" if temp > 55 else "Insulate with straw or cover with tarp",
                "Maintain weekly turning schedule"
            ]
            suggestions.append({
                "Parameter": "Temperature",
                "Current": f"{temp:.1f}°C",
                "Status": status,
                "Priority": priority,
                "Actions": action
            })

        # Moisture Content
        mc = params['MC(%)']
        if mc > 65 or mc < 40:
            status = "High" if mc > 65 else "Low"
            priority = "High" if mc > 70 or mc < 35 else "Medium"
            action = [
                f"Add dry materials (sawdust, leaves)" if mc > 65 else f"Water pile evenly",
                "Turn pile to improve aeration",
                "Check drainage system" if mc > 65 else "Use sprayer for uniform distribution",
                "Target 50-60% moisture content",
                "Monitor moisture twice weekly",
                "Re-check after 24 hours and adjust"
            ]
            suggestions.append({
                "Parameter": "MC(%)",
                "Current": f"{mc:.1f}%",
                "Status": status,
                "Priority": priority,
                "Actions": action
            })

        # pH
        ph = params['pH']
        if ph < 6.5 or ph > 8.5:
            status = "Low" if ph < 6.5 else "High"
            action = [
                f"Add lime (2-3 kg/m³)" if ph < 6.5 else f"Add sulfur (1 kg/m³)",
                "Mix thoroughly during turning",
                "Wait 3-5 days before re-testing",
                f"Target pH 6.5-8.0",
                "Monitor weekly as changes occur slowly",
                "Avoid over-correction"
            ]
            suggestions.append({
                "Parameter": "pH",
                "Current": f"{ph:.1f}",
                "Status": status,
                "Priority": "High" if ph < 6.0 or ph > 9.0 else "Medium",
                "Actions": action
            })

        # C/N Ratio
        cn = params['C/N Ratio']
        if cn > 30 or cn < 15:
            status = "High" if cn > 30 else "Low"
            action = [
                f"Add nitrogen-rich greens" if cn > 30 else f"Add dry carbon materials",
                "Mix 1 part nitrogen to 2-3 parts carbon by volume",
                "Blood meal or feather meal boost" if cn > 30 else "Shred materials for faster decomposition",
                "Turn thoroughly after 48 hours",
                f"Expect C/N {20}-{25}:1 within 7-10 days" if cn > 30 else "Target C/N 25-30:1 within one week",
                "Monitor for ammonia smell"
            ]
            suggestions.append({
                "Parameter": "C/N Ratio",
                "Current": f"{cn:.1f}:1",
                "Status": status,
                "Priority": "High" if cn > 35 or cn < 12 else "Medium",
                "Actions": action
            })

        # Germination Index
        gi = params['GI(%)']
        if gi < 80:
            status = "Low"
            action = [
                f"Continue composting for {15 if gi < 50 else 7}-{20 if gi < 50 else 12} more days",
                "Turn pile weekly for aerobic conditions",
                "Maintain 50-60% moisture consistently",
                "DO NOT use if GI < 50 - phytotoxic" if gi < 50 else "Wait for GI to reach 80%+",
                "Test weekly using cress seed bioassay",
                "Add mature compost inoculant" if gi < 50 else "Monitor temperature cooling"
            ]
            suggestions.append({
                "Parameter": "GI(%)",
                "Current": f"{gi:.0f}%",
                "Status": status,
                "Priority": "High" if gi < 50 else "Medium",
                "Actions": action
            })

        # Electrical Conductivity
        ec = params['EC(ms/cm)']
        if ec > 4:
            action = [
                "Leach with water - excess salts present",
                "Apply 2-3 volumes water per compost volume",
                "Blend 1:1 with low-EC material (peat, coir)",
                "Spread in thin layer, irrigate repeatedly",
                "Re-test EC after treatment - target <4.0 ms/cm",
                "Use only salt-tolerant species if EC remains high"
            ]
            suggestions.append({
                "Parameter": "EC(ms/cm)",
                "Current": f"{ec:.1f}",
                "Status": "High",
                "Priority": "High" if ec > 5 else "Medium",
                "Actions": action
            })

        # Sort by priority
        suggestions.sort(key=lambda x: {"High": 0, "Medium": 1}.get(x.get('Priority', 'Medium'), 2))
        return suggestions[:6]

    def generate_overall_recommendation(self, score, stage, params, plant_analysis):
        """Generate practical recommendation"""
        suitable_count = len(plant_analysis['Suitable_Plants_For_Use'])
        conditional_count = len(plant_analysis['Conditionally_Usable_Plants'])
        days = self.estimate_days_to_maturity(score)

        if score >= 70:
            recommendation = f"Mature and high-quality (Score: {score:.1f}). Ready for {suitable_count} plant species. Apply 2-3 inches around plants."
        elif score >= 60:
            recommendation = f"Late-stage maturation (Score: {score:.1f}). Safe for {suitable_count} plants now, {conditional_count} more after {days} days."
        elif score >= 50:
            recommendation = f"Further processing needed (Score: {score:.1f}). Suitable for {suitable_count} hardy species. {days} more days for broad use."
        else:
            recommendation = f"Immature (Score: {score:.1f}). DO NOT use - phytotoxic. {days} more days minimum."

        if params['GI(%)'] < 80:
            recommendation += f" WARNING: GI {params['GI(%)']:.0f}% - toxicity risk."
        if params['EC(ms/cm)'] > 4:
            recommendation += f" WARNING: EC {params['EC(ms/cm)']:.1f} - salt stress risk."

        return recommendation

    def analyze_complete(self, compost_params):
        """Complete analysis - all results"""
        score = self.predict_score(compost_params)
        stage = self.classify_stage(score)
        days = self.estimate_days_to_maturity(score)

        compost_improvements = self.generate_compost_improvements(compost_params, score)
        plant_analysis = self.analyze_plant_suitability_detailed(compost_params)
        overall_rec = self.generate_overall_recommendation(score, stage, compost_params, plant_analysis)

        return {
            "Compost_Quality_Assessment": {
                "Predicted_Score": round(score, 2),
                "Maturity_Stage": stage,
                "Days_to_Maturity": days,
                "Quality_Status": "Excellent" if score >= 70 else "Good" if score >= 60 else "Fair" if score >= 50 else "Poor",
                "Improvement_Summary": f"{len(compost_improvements)} parameters need adjustment" if compost_improvements else "All parameters optimal",
                "Overall_Recommendation": overall_rec,
                "Parameter_Improvements": compost_improvements
            },
            "Plant_Usability_Guide": {
                "Suitable_Plants_For_Use": plant_analysis['Suitable_Plants_For_Use'],
                "Conditionally_Usable_Plants": plant_analysis['Conditionally_Usable_Plants'],
                "Not_Suitable_Plants": plant_analysis['Not_Suitable_Plants']
            }
        }


# Initialize the analysis system
print("\n🔧 Initializing analysis system...")
analysis_system = CompostAnalysisSystem(model, scaler, df_plants, FEATURE_NAMES)
print("✓ Analysis system ready")

# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze compost parameters"""
    try:
        data = request.json
        
        # Validate required parameters
        for param in FEATURE_NAMES:
            if param not in data:
                return jsonify({"error": f"Missing parameter: {param}"}), 400
        
        # Convert to proper types
        params = {key: float(data[key]) for key in FEATURE_NAMES}
        
        # Run analysis
        result = analysis_system.analyze_complete(params)
        
        return jsonify(result)
    
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter value: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Analysis error: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model": "Random Forest Regressor",
        "model_performance": {
            "r2_score": round(test_r2, 4),
            "rmse": round(test_rmse, 4),
            "mae": round(test_mae, 4)
        },
        "plants_loaded": len(df_plants),
        "training_samples": len(df_compost)
    })

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*80)
    print("🌱 COMPOST QUALITY ANALYSIS SYSTEM - API SERVER")
    print("="*80)
    print(f"✓ Model trained with {len(df_compost)} samples")
    print(f"✓ Plant database loaded with {len(df_plants)} species")
    print("✓ Server starting on http://localhost:5000")
    print("="*80 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
