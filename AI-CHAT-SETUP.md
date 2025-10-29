# ZenCalcs AI Chat Assistant - Setup Guide

This guide will help you set up the AI Chat Assistant feature for ZenCalcs.

## Overview

The AI Chat Assistant uses:
- **Frontend**: Vanilla JavaScript (no build tools needed)
- **Backend**: Netlify Serverless Functions
- **AI**: Anthropic Claude API (claude-sonnet-4-5-20250929)

## Prerequisites

1. A Netlify account (free tier works)
2. An Anthropic API key ([Get one here](https://console.anthropic.com/))
3. Your site deployed to Netlify

## Setup Instructions

### 1. Install Dependencies for Netlify Functions

The Netlify Functions need the Anthropic SDK. Netlify will automatically install dependencies when it detects a `package.json` file in the functions directory.

The `netlify/functions/package.json` file has already been created with the required dependencies:
```json
{
  "name": "zencalcs-functions",
  "version": "1.0.0",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.1"
  }
}
```

### 2. Configure Netlify

#### Update netlify.toml

Your existing `netlify.toml` should include the functions directory. Add or update it:

```toml
[build]
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
```

### 3. Set Up Environment Variables

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add the following:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (starts with `sk-ant-`)
   - **Scopes**: Select both "Same value for all deploy contexts" or set different keys for production/preview

### 4. Deploy to Netlify

#### Option A: Push to Git (Recommended)

If your site is connected to Git:

```bash
git add .
git commit -m "Add AI Chat Assistant feature"
git push
```

Netlify will automatically deploy and install the function dependencies.

#### Option B: Manual Deploy

1. Drag and drop your project folder to Netlify dashboard
2. Or use Netlify CLI:

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 5. Add Chat to Other Pages

The chat has been added to `index.html`. To add it to other calculator pages, add these two lines before the closing `</body>` tag:

```html
<!-- AI Chat Assistant -->
<link rel="stylesheet" href="css/ai-chat.css">
<script src="js/ai-chat.js"></script>
```

You can copy this from `ai-chat-snippet.html`.

### 6. Local Testing (Optional)

To test the function locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Install function dependencies
cd netlify/functions
npm install
cd ../..

# Start local dev server
netlify dev
```

Then visit `http://localhost:8888` to test the chat.

## File Structure

```
Live/
├── netlify/
│   └── functions/
│       ├── package.json          # Function dependencies
│       └── ai-chat.js            # Serverless function
├── css/
│   └── ai-chat.css               # Chat UI styles
├── js/
│   └── ai-chat.js                # Chat UI logic
├── ai-chat-snippet.html          # HTML snippet for integration
├── index.html                    # Updated with chat
└── netlify.toml                  # Netlify configuration
```

## How It Works

1. **User clicks the chat button** (bottom-right corner)
2. **Chat modal opens** with welcome message and suggestions
3. **User types a calculation question** (e.g., "Calculate mortgage payment for $600k at 5.3% for 25 years")
4. **Frontend sends request** to `/.netlify/functions/ai-chat`
5. **Netlify function receives request** and calls Claude API
6. **Claude analyzes the question**, extracts parameters, and performs calculations
7. **Response is formatted** and sent back to the frontend
8. **Chat displays the result** with explanations

## Available Calculations

The AI assistant can handle **ALL** calculator types available on ZenCalcs:

### Financial Calculators
- Mortgage, Loan, Auto Loan payments
- Compound Interest, Investment Growth
- Retirement Planning, Savings Goals
- ROI, Budget, Debt Payoff
- Amortization, Salary conversions
- Inflation adjustments

### Health & Fitness Calculators
- BMI (Body Mass Index)
- BMR (Basal Metabolic Rate)
- Body Fat percentage
- Calorie needs (TDEE)
- Macro calculations
- Ideal Weight, Body Type
- Pace calculations

### Math & Science Calculators
- Percentages
- Fractions
- Square Roots, Exponents
- Logarithms
- Scientific calculations
- Trigonometry
- Standard Deviation
- Algebra (equations, quadratic)
- Triangle geometry

### Pregnancy Calculators
- Due Date calculations
- Pregnancy week tracking

### Other Features
- Random number generation
- And any other mathematical calculation!

**The AI uses Claude's natural reasoning** to handle any calculation - no hardcoded functions needed!

## Customization

### Change Chat Colors

Edit `css/ai-chat.css` and modify the gradient colors:
```css
background: linear-gradient(135deg, #2C5F6F 0%, #1E40AF 100%);
```

### Change AI Model

Edit `netlify/functions/ai-chat.js` line ~192:
```javascript
model: 'claude-sonnet-4-5-20250929',
```

Available models:
- `claude-sonnet-4-5-20250929` (recommended - best balance)
- `claude-opus-4-20250514` (most capable, higher cost)
- `claude-3-5-haiku-20241022` (faster, lower cost)

### Adjust Response Length

Edit `netlify/functions/ai-chat.js` line ~194:
```javascript
max_tokens: 2048,
```

Increase for more detailed responses, decrease for faster/cheaper responses.

### Customize System Prompt

The system prompt in `netlify/functions/ai-chat.js` tells Claude about all available calculators. If you add new calculator pages to ZenCalcs, update the `SYSTEM_PROMPT` constant to include them.

## Troubleshooting

### Chat button not appearing
- Check browser console for errors
- Verify `css/ai-chat.css` and `js/ai-chat.js` are loaded
- Check that the files are in the correct directories

### "API key not configured" error
- Verify you added `ANTHROPIC_API_KEY` in Netlify dashboard
- Redeploy your site after adding the environment variable

### Function errors
- Check Netlify Functions logs in dashboard
- Verify the API key is valid
- Check that dependencies installed correctly

### Network errors
- Check browser console for CORS errors
- Verify the function endpoint is `/.netlify/functions/ai-chat`

## Cost Estimates

**Netlify Functions**:
- Free tier: 125,000 requests/month
- Likely sufficient for most use cases

**Anthropic API**:
- Claude Sonnet 4.5: ~$3 per million input tokens, ~$15 per million output tokens
- Average chat: ~500 tokens total
- Estimate: $0.005-0.01 per conversation
- 1000 conversations ≈ $5-10

## Support

For issues:
1. Check Netlify Functions logs in dashboard
2. Check browser console for frontend errors
3. Verify API key is correct and has credits

## License

Same as ZenCalcs project.
