#!/bin/bash

# Files that still need search box HTML update
files=(
    "roi-calculator.html"
    "debt-payoff.html"
    "savings-calculator.html"
    "investment-calculator.html"
    "budget-calculator.html"
    "salary-calculator.html"
    "retirement-calculator.html"
)

search_icon_old='<div class="search-icon" onclick="openSearchInMenu()">🔍<\/div>'

search_box_new='<div class="search-box" onclick="openSearchInMenu()">\
                    <svg xmlns="http:\/\/www.w3.org\/2000\/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" \/>\
                    <\/svg>\
                    <input type="text" placeholder="Search Calculator" readonly onclick="openSearchInMenu()">\
                <\/div>'

echo "Updating search icon to search box in HTML..."

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        # Use perl for multi-line replacement
        perl -i -pe "s/$search_icon_old/$search_box_new/g" "$file"
        echo "  ✓ $file updated"
    else
        echo "  ✗ $file not found"
    fi
done

echo "Search HTML update complete!"
