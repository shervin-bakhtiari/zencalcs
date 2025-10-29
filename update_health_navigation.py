#!/usr/bin/env python3
"""
Update navigation links to point to new Health calculator pages
"""
import os

# Navigation link updates - from placeholder to actual pages
NAV_UPDATES = {
    '<a href="#" class="mobile-menu-item placeholder">Ideal Weight Calculator</a>':
        '<a href="ideal-weight-calculator.html" class="mobile-menu-item">Ideal Weight Calculator</a>',

    '<a href="#" class="mobile-menu-item placeholder">Pace Calculator</a>':
        '<a href="pace-calculator.html" class="mobile-menu-item">Pace Calculator</a>',

    '<a href="#" class="mobile-menu-item placeholder">Pregnancy Calculator</a>':
        '<a href="pregnancy-calculator.html" class="mobile-menu-item">Pregnancy Calculator</a>',

    '<a href="#" class="mobile-menu-item placeholder">Due Date Calculator</a>':
        '<a href="due-date-calculator.html" class="mobile-menu-item">Due Date Calculator</a>',

    '<a href="#" class="mobile-menu-item placeholder">Body Type Calculator</a>':
        '<a href="body-type-calculator.html" class="mobile-menu-item">Body Type Calculator</a>',
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
