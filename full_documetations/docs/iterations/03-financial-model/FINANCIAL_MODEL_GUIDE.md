# 📘 HOW TO USE THE FINANCIAL MODEL

## Quick Start Guide for Google Sheets / Excel

---

## 📥 IMPORT TO GOOGLE SHEETS

### Method 1: Direct Import
1. Open Google Sheets (sheets.google.com)
2. Click **File → Import**
3. Select **Upload** tab
4. Choose `FINANCIAL_MODEL.csv`
5. Select:
   - **Import location:** Create new spreadsheet
   - **Separator type:** Comma
   - **Convert text to numbers:** Yes
6. Click **Import data**

### Method 2: Drag & Drop
1. Open Google Drive (drive.google.com)
2. Drag `FINANCIAL_MODEL.csv` to your Drive
3. Right-click the file → **Open with → Google Sheets**
4. File will open as a spreadsheet

---

## 📥 IMPORT TO EXCEL

### Method 1: Open Directly
1. Double-click `FINANCIAL_MODEL.csv`
2. Excel will open it automatically
3. To save as Excel format:
   - **File → Save As**
   - Choose **Excel Workbook (.xlsx)**

### Method 2: Import Wizard
1. Open Excel
2. Click **Data → From Text/CSV**
3. Select `FINANCIAL_MODEL.csv`
4. Click **Import**
5. Verify delimiter is **Comma**
6. Click **Load**

---

## 🔧 SETTING UP FORMULAS

The CSV contains data and some calculations, but for a fully interactive model, you'll want to add formulas. Here's how:

### Key Formulas to Add

**1. Monthly Recurring Revenue (MRR)**
```
=Paying_Customers * ARPU
```
Example in Google Sheets:
```
=B10*$D$5
```

**2. Annual Recurring Revenue (ARR)**
```
=MRR * 12
```

**3. Customer Acquisition Cost (CAC)**
```
=Marketing_Spend / New_Customers
```

**4. Lifetime Value (LTV)**
```
=ARPU * Customer_Lifetime_Months * Gross_Margin
```

**5. Monthly Churn**
```
=Churned_Customers / Total_Customers
```

**6. Net New MRR**
```
=New_MRR - Churned_MRR
```

---

## 📊 UNDERSTANDING THE SECTIONS

### Section 1: Assumptions (Rows 1-100)
**What it is:** All the input variables that drive the model  
**Key areas:**
- Pricing tiers
- Customer growth rates
- Team size & salaries
- Infrastructure costs
- Marketing budgets

**How to use:**
- ✏️ Edit these to see impact on outcomes
- 🔒 These are your "input cells"
- 📈 Changes here cascade through entire model

### Section 2: Monthly Projections (Rows 105-165)
**What it is:** Month-by-month forecast for 60 months  
**Key metrics:**
- New customers each month
- Total customers (cumulative)
- MRR growth
- Churn rates

**How to use:**
- 📊 Visualize with charts
- 🔍 Spot trends and inflection points
- ⚠️ Identify cash-out months

### Section 3: Annual Summary (Rows 170-195)
**What it is:** High-level view of each year  
**Key metrics:**
- ARR (annual recurring revenue)
- Customer count
- Growth rates YoY

**How to use:**
- 📋 Quick reference for board meetings
- 📈 Compare year-over-year performance
- 🎯 Track against milestones

### Section 4: Cost Structure (Rows 200-260)
**What it is:** Detailed breakdown of all expenses  
**Categories:**
- Personnel (salaries by role)
- Infrastructure (cloud, tools)
- AI API costs
- Marketing & sales
- G&A

**How to use:**
- 💰 Identify largest cost drivers
- ✂️ Model cost-cutting scenarios
- 📊 Calculate burn rate

### Section 5: P&L Statement (Rows 265-285)
**What it is:** Income statement showing profitability  
**Key lines:**
- Revenue
- Cost of Revenue
- Gross Profit
- Operating Expenses
- EBITDA
- Net Income

**How to use:**
- 💵 See if/when company is profitable
- 📉 Track margin improvements
- 🎯 Set profitability targets

### Section 6: Unit Economics (Rows 290-310)
**What it is:** Per-customer metrics  
**Key metrics:**
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- LTV:CAC ratio
- Payback period

**How to use:**
- 🎯 Optimize marketing efficiency
- 📊 Compare to SaaS benchmarks
- 💡 Identify product-market fit

### Section 7: Cash Flow (Rows 315-330)
**What it is:** Cash in, cash out, runway  
**Key metrics:**
- Operating cash flow
- Ending cash balance
- Runway (months)

**How to use:**
- 🚨 Know when you'll run out of money
- 💰 Plan fundraising timing
- ⚠️ Avoid cash-out scenarios

---

## 🎨 CREATING VISUALIZATIONS

### Recommended Charts

**1. MRR Growth Over Time**
- Chart type: Line chart
- X-axis: Month
- Y-axis: MRR
- Purpose: Show revenue trajectory

**2. Customer Acquisition**
- Chart type: Stacked area chart
- X-axis: Month
- Y-axis: Customers
- Series: Free vs Paying
- Purpose: Visualize customer mix

**3. Unit Economics**
- Chart type: Combo chart (bars + line)
- X-axis: Year
- Y-axis 1: CAC & LTV (bars)
- Y-axis 2: LTV:CAC ratio (line)
- Purpose: Track efficiency

**4. Cash Runway**
- Chart type: Waterfall chart
- X-axis: Year
- Y-axis: Cash balance
- Purpose: Show burn rate and runway

**5. Cost Breakdown**
- Chart type: Stacked bar chart
- X-axis: Year
- Y-axis: Costs
- Series: Personnel, Marketing, Infrastructure, etc.
- Purpose: Identify cost drivers

---

## 🔄 SCENARIO MODELING

### How to Create Scenarios

**Step 1: Duplicate the sheet**
- Right-click sheet tab → Duplicate
- Name it "Scenario 2: Optimistic" or similar

**Step 2: Change key assumptions**
Examples:
- Increase ARPU from $35 → $45 (+29%)
- Reduce churn from 3.5% → 2.5% monthly
- Decrease CAC by 20%
- Hire 5 fewer people

**Step 3: Compare results**
- Create a summary sheet
- Pull key metrics from each scenario
- See which changes have biggest impact

### Pre-Built Scenarios to Try

**Scenario 1: Base Case**
- Current assumptions (already in model)
- Result: Requires $30M funding, not profitable in 5 years

**Scenario 2: Optimistic**
- ARPU: $35 → $45 (+29%)
- Churn: 3.5% → 2.5% monthly
- Result: Break-even Month 40, reduces funding need

**Scenario 3: Lean/Profitable**
- Team size: Cut by 50% (11 → 6 people Year 1)
- Marketing: Cut by 60% ($190K → $76K)
- Growth: Slower (1,500 customers Year 1 vs 2,693)
- Result: Break-even Month 24, no Series A needed

**Scenario 4: Enterprise Focus**
- ARPU: $35 → $65 (more enterprise customers)
- CAC: $71 → $120 (higher touch sales)
- LTV: $1,001 → $1,850
- Result: Better unit economics, easier to fundraise

---

## 📏 BENCHMARKING

### SaaS Metrics Benchmarks

Compare your Bubble Gum metrics to industry standards:

| Metric | Bubble Gum | SaaS Benchmark | Status |
|--------|------------|----------------|--------|
| **Gross Margin** | 71-82% | 70-80% | ✅ Good |
| **LTV:CAC** | 14x (Year 1) | 3x+ | ✅ Excellent |
| **Payback Period** | 2 months | <12 months | ✅ Excellent |
| **Annual Churn** | 35% | 10-20% | 🔴 High |
| **NRR** | N/A | 100-130% | ⚠️ Track this |
| **Magic Number** | N/A | 0.75+ | ⚠️ Calculate |

### Key Ratios to Watch

**Rule of 40**
```
Growth Rate (%) + Profit Margin (%) ≥ 40%
```
Bubble Gum Year 2: 285% growth + (-820%) margin = -535% ❌  
*(Not applicable for early-stage; aim for this at scale)*

**CAC Payback**
```
Should be < 12 months
```
Bubble Gum: 2-3 months ✅ Excellent

**Revenue Per Employee**
```
SaaS benchmark: $100K-$200K
```
Bubble Gum Year 1: $7.7K / employee 🔴  
*(Low because of early stage; improves over time)*

---

## 🚨 WARNING SIGNS TO WATCH

### Red Flags

**1. Cash Runway < 6 Months**
- Action: Start fundraising immediately
- Bubble Gum: Happens Month 12 (Year 1)

**2. LTV:CAC < 3x**
- Action: Reduce CAC or increase ARPU
- Bubble Gum: Happens Year 4-5

**3. Monthly Churn > 5%**
- Action: Improve onboarding, customer success
- Bubble Gum: Currently 3.5% (borderline)

**4. Gross Margin < 70%**
- Action: Reduce COGS, increase prices
- Bubble Gum: 71-82% ✅ Good

**5. Negative Cash Flow with No Funding Plan**
- Action: Cut costs or secure funding ASAP
- Bubble Gum: Need Series A by Month 18

---

## 💡 PRO TIPS

### Making the Model Your Own

**1. Update with Actual Data**
- Replace projections with actuals as you get real data
- Track variance (actual vs forecast)
- Adjust future months based on trends

**2. Add Sensitivity Tables**
- Use Excel's Data Tables feature
- Show impact of ±20% changes to key variables
- Example: What if ARPU is $30 vs $40?

**3. Build Driver-Based Forecasts**
- Don't just forecast revenue
- Forecast the drivers (customers, ARPU, churn)
- Revenue = f(customers, ARPU, churn)

**4. Automate with Scripts**
- Google Sheets: Apps Script
- Excel: VBA or Power Query
- Pull data from Stripe, Google Analytics, etc.

**5. Share with Board/Investors**
- Export key metrics to slides
- Create a one-page dashboard
- Update monthly and share

---

## 🔗 INTEGRATING WITH REAL DATA

### Data Sources to Connect

**Stripe (Revenue)**
- Export MRR, churn, ARPU
- Compare to forecast
- Adjust pricing assumptions

**Google Analytics (Traffic)**
- Visitor → signup conversion
- Use to forecast customer growth
- Optimize marketing spend

**Your CRM (Sales)**
- Track CAC by channel
- Measure conversion rates
- Forecast new customers

**QuickBooks/Xero (Costs)**
- Pull actual expenses
- Compare to budget
- Identify overruns

---

## ❓ FREQUENTLY ASKED QUESTIONS

**Q: Why is the company not profitable in 5 years?**  
A: SaaS companies prioritize growth over profitability early. To break even faster, choose Scenario 3 (Lean/Profitable).

**Q: How accurate is this model?**  
A: It's a forecast, not a guarantee. Actual results will vary. Update monthly with real data.

**Q: Should I aim for the metrics in this model?**  
A: Use as a starting point. Adjust based on your market, competition, and resources.

**Q: What if I can't raise Series A?**  
A: Implement Scenario 3 (cost cuts) by Month 12 to extend runway and reach profitability.

**Q: How do I share this with investors?**  
A: Create a summary deck. Show key metrics (ARR, customers, burn) on 1-2 slides. Offer full model as backup.

**Q: Can I change the assumptions?**  
A: Yes! That's the point. Model YOUR business, not generic Bubble Gum.

---

## 📚 ADDITIONAL RESOURCES

### Recommended Reading
- "SaaS Metrics 2.0" by David Skok
- "Financial Modeling for Startups" by Damodaran
- "The SaaS CFO" newsletter

### Tools to Complement This Model
- **Baremetrics:** Stripe metrics dashboard
- **ChartMogul:** Subscription analytics
- **ProfitWell:** Free SaaS metrics
- **Causal:** Visual financial modeling tool

### Formulas Reference
- **MRR:** Paying Customers × ARPU
- **ARR:** MRR × 12
- **CAC:** Marketing Spend ÷ New Customers
- **LTV:** ARPU × Lifetime (months) × Gross Margin
- **LTV:CAC:** LTV ÷ CAC
- **Churn:** Churned Customers ÷ Total Customers
- **Burn Rate:** Monthly Expenses - Monthly Revenue

---

## ✅ NEXT STEPS

1. **Import the CSV** into Google Sheets or Excel
2. **Review assumptions** (Section 1)
3. **Create charts** for key metrics
4. **Run scenarios** (optimistic, pessimistic, base)
5. **Compare to actuals** (once you have real data)
6. **Share with team** and get feedback
7. **Update monthly** as the business evolves

---

**Questions or Issues?**  
Refer to the `FINANCIAL_MODEL_SUMMARY.md` for detailed explanations of each section and metric.

**Last Updated:** November 1, 2025  
**Model Version:** 1.0

---

*Happy modeling! Remember: All models are wrong, but some are useful. Use this as a guide, not gospel.*