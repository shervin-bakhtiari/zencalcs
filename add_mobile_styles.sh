#!/bin/bash

files=(
    "roi-calculator.html"
    "debt-payoff.html"
    "savings-calculator.html"
    "investment-calculator.html"
    "budget-calculator.html"
    "salary-calculator.html"
    "retirement-calculator.html"
)

echo "Adding mobile responsive styles for search box..."

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        # Add mobile styles after .logo { height: 35px; }
        sed -i '' '/\.logo { height: 35px; }/a\
            .search-box { min-width: 180px; padding: 6px 12px; }\
            .search-box svg { width: 18px; height: 18px; }\
            .search-box input { font-size: 0.9em; }
' "$file"
        echo "  ✓ $file updated"
    else
        echo "  ✗ $file not found"
    fi
done

echo "Mobile styles update complete!"
