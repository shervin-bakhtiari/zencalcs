#!/usr/bin/env python3
"""
Update navigation links to point to new calculator pages
"""
import os
import re

# Navigation link updates - from placeholder to actual pages
NAV_UPDATES = {
    '<a href="#" class="mobile-menu-item placeholder">Auto Loan Calculator</a>':
        '<a href="auto-loan-calculator.html" class="mobile-menu-item">Auto Loan Calculator</a>',

    '<a href="#" class="mobile-menu-item placeholder">Payment Calculator</a>':
        '<a href="payment-calculator.html" class="mobile-menu-item">Payment Calculator</a>',

    '<a href="#" class="mobile-menu-item placeholder">Amortization Calculator</a>':
        '<a href="amortization-calculator.html" class="mobile-menu-item">Amortization Calculator</a>',

    '<a href="#" class="mobile-menu-item placeholder">Inflation Calculator</a>':
        '<a href="inflation-calculator.html" class="mobile-menu-item">Inflation Calculator</a>',
}

def update_navigation(content):
    """Update navigation links from placeholders to actual pages"""
    for old_link, new_link in NAV_UPDATES.items():
        content = content.replace(old_link, new_link)
    return content

def process_file(filepath):
    """Process a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = update_navigation(content)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    # Get all HTML files in current directory
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]

    print(f"Found {len(html_files)} HTML files to update")

    updated = 0
    for filename in sorted(html_files):
        if process_file(filename):
            print(f"✓ Updated navigation: {filename}")
            updated += 1
        else:
            print(f"- No changes needed: {filename}")

    print(f"\nCompleted: {updated}/{len(html_files)} files updated")

if __name__ == '__main__':
    main()
