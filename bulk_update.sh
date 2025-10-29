#!/bin/bash

# List of files to update
files=(
    "loan-calculator.html"
    "compound-interest.html"
    "retirement-calculator.html"
    "salary-calculator.html"
    "budget-calculator.html"
    "investment-calculator.html"
    "savings-calculator.html"
    "debt-payoff.html"
    "roi-calculator.html"
)

echo "Starting bulk update of calculator pages..."

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."

        # Update colors
        sed -i '' 's/#3B82F6/#2563EB/g' "$file"
        sed -i '' 's/color: #1E293B/color: #111827/g' "$file"
        sed -i '' 's/color: #64748B/color: #6B7280/g' "$file"
        sed -i '' 's/color: #475569/color: #4B5563/g' "$file"
        sed -i '' 's/#E2E8F0/#E5E7EB/g' "$file"

        # Remove emojis from category headers
        sed -i '' 's/<div class="category-header">💰 Financial<\/div>/<div class="category-header">Financial<\/div>/g' "$file"
        sed -i '' 's/<div class="category-header">💪 Fitness & Health<\/div>/<div class="category-header">Fitness \& Health<\/div>/g' "$file"
        sed -i '' 's/<div class="category-header">🔢 Math<\/div>/<div class="category-header">Math<\/div>/g' "$file"
        sed -i '' 's/<div class="category-header">🔧 Other<\/div>/<div class="category-header">Other<\/div>/g' "$file"

        echo "  ✓ $file updated"
    else
        echo "  ✗ $file not found"
    fi
done

echo "Bulk update complete!"
