#!/usr/bin/env python3
"""
Script to update all calculator HTML files with the new design
"""
import os
import re

# List of all calculator HTML files to update
calculator_files = [
    'mortgage-calculator.html',
    'loan-calculator.html',
    'compound-interest.html',
    'retirement-calculator.html',
    'salary-calculator.html',
    'budget-calculator.html',
    'investment-calculator.html',
    'savings-calculator.html',
    'debt-payoff.html',
    'roi-calculator.html'
]

def update_colors(content):
    """Update color palette in the CSS"""
    # Update body background color is already correct #F9FAFB

    # Update navbar colors
    content = re.sub(r'\.navbar\s*\{\s*background:\s*white;', '.navbar { background: #FFFFFF;', content)

    # Update text colors
    content = re.sub(r'color:\s*#1E293B;', 'color: #111827;', content)
    content = re.sub(r'color:\s*#64748B;', 'color: #6B7280;', content)
    content = re.sub(r'color:\s*#475569;', 'color: #4B5563;', content)

    # Update primary blue color
    content = re.sub(r'#3B82F6', '#2563EB', content)

    # Update border colors
    content = re.sub(r'border:\s*2px\s+solid\s+#E2E8F0', 'border: 2px solid #E5E7EB', content)
    content = re.sub(r'border:\s*1px\s+solid\s+#E2E8F0', 'border: 1px solid #E5E7EB', content)
    content = re.sub(r'border-bottom:\s*1px\s+solid\s+#E2E8F0', 'border-bottom: 1px solid #E5E7EB', content)
    content = re.sub(r'background:\s*#E2E8F0', 'background: #E5E7EB', content)

    # Update card backgrounds
    content = re.sub(r'background:\s*white;', 'background: #FFFFFF;', content)

    return content

def update_search_icon_to_box(content):
    """Replace search icon emoji with search box"""
    # Update CSS for search box
    old_search_css = r'/\* Search Icon \*/\s*\.search-icon \{[^}]+\}\s*\.search-icon:hover \{[^}]+\}'

    new_search_css = '''/* Search Box */
        .search-box { display: flex; align-items: center; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px 16px; min-width: 250px; transition: all 0.3s ease; }
        .search-box:hover { border-color: #2563EB; }
        .search-box:focus-within { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .search-box svg { width: 20px; height: 20px; color: #6B7280; margin-right: 10px; }
        .search-box input { border: none; outline: none; background: transparent; flex: 1; color: #111827; font-size: 0.95em; }
        .search-box input::placeholder { color: #D1D5DB; }'''

    content = re.sub(old_search_css, new_search_css, content, flags=re.DOTALL)

    # Update HTML for search box
    old_search_html = r'<div class="search-icon" onclick="openSearchInMenu\(\)">🔍</div>'

    new_search_html = '''<div class="search-box" onclick="openSearchInMenu()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search Calculator" readonly onclick="openSearchInMenu()">
                </div>'''

    content = re.sub(old_search_html, new_search_html, content)

    return content

def remove_category_emojis(content):
    """Remove emojis from category headers"""
    content = re.sub(r'<div class="category-header">💰 Financial</div>', '<div class="category-header">Financial</div>', content)
    content = re.sub(r'<div class="category-header">💪 Fitness & Health</div>', '<div class="category-header">Fitness & Health</div>', content)
    content = re.sub(r'<div class="category-header">🔢 Math</div>', '<div class="category-header">Math</div>', content)
    content = re.sub(r'<div class="category-header">🔧 Other</div>', '<div class="category-header">Other</div>', content)

    return content

def update_mobile_responsive(content):
    """Update mobile responsive styles"""
    # Add search box responsive styles
    mobile_css = r'@media \(max-width: 768px\) \{[^}]+\.mobile-menu-content[^}]+\}'

    # Find the mobile section and update it
    content = re.sub(
        r'(\.logo \{ height: 35px; \})',
        r'''\1
            .search-box { min-width: 180px; padding: 6px 12px; }
            .search-box svg { width: 18px; height: 18px; }
            .search-box input { font-size: 0.9em; }''',
        content
    )

    return content

def process_file(filepath):
    """Process a single HTML file"""
    print(f"Processing {filepath}...")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply all transformations
        content = update_colors(content)
        content = update_search_icon_to_box(content)
        content = remove_category_emojis(content)
        content = update_mobile_responsive(content)

        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✓ Successfully updated {filepath}")
        return True

    except Exception as e:
        print(f"✗ Error processing {filepath}: {str(e)}")
        return False

def main():
    """Main function to process all files"""
    print("Starting design update for all calculator pages...")
    print("=" * 60)

    success_count = 0
    fail_count = 0

    for filename in calculator_files:
        if os.path.exists(filename):
            if process_file(filename):
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"✗ File not found: {filename}")
            fail_count += 1

    print("=" * 60)
    print(f"Update complete!")
    print(f"Successfully updated: {success_count} files")
    print(f"Failed: {fail_count} files")

if __name__ == "__main__":
    main()
