#!/usr/bin/env python3
"""
Script to update all calculator pages with new color theme and features
"""
import re
import os

# Color mappings - old color to new color
COLOR_MAPPINGS = {
    # Body and main text
    r'background:\s*#F9FAFB': 'background: #F8F9FA',
    r'color:\s*#111827': 'color: #2D3748',

    # Primary blue to teal
    r'#2563EB': '#2C5F6F',
    r'rgba\(37,\s*99,\s*235': 'rgba(44, 95, 111',

    # Hover backgrounds
    r'background:\s*#EFF6FF': 'background: #E0F2F1',
    r'#F9FAFB': '#F8F9FA',

    # Button gradients (blue to warm accent)
    r'linear-gradient\(135deg,\s*#2563EB\s+0%,\s*#2563EB\s+100%\)': 'linear-gradient(135deg, #E89B6F 0%, #F4A460 100%)',
    r'box-shadow:\s*0\s+4px\s+15px\s+rgba\(37,\s*99,\s*235,\s*0\.4\)': 'box-shadow: 0 4px 15px rgba(232, 155, 111, 0.4)',
    r'box-shadow:\s*0\s+6px\s+20px\s+rgba\(37,\s*99,\s*235,\s*0\.5\)': 'box-shadow: 0 6px 20px rgba(232, 155, 111, 0.5)',

    # Key insight backgrounds
    r'background:\s*linear-gradient\(135deg,\s*#2563EB\s+0%,\s*#2563EB\s+100%\);': 'background: linear-gradient(135deg, #2C5F6F 0%, #1F4A56 100%);',
    r'box-shadow:\s*0\s+4px\s+20px\s+rgba\(37,\s*99,\s*235,\s*0\.3\)': 'box-shadow: 0 4px 20px rgba(44, 95, 111, 0.3)',

    # Border colors
    r'border-left:\s*5px\s+solid\s+#2563EB': 'border-left: 5px solid #2C5F6F',
    r'border-left:\s*4px\s+solid\s+#2563EB': 'border-left: 4px solid #2C5F6F',
    r'border-color:\s*#1E40AF': 'border-color: #1F4A56',
}

# Chart color replacements for category colors
CHART_COLOR_MAPPINGS = {
    # Old chart colors to new palette
    r"'#60A5FA'": "'#5FA8D3'",  # Soft Blue
    r"'#10B981'": "'#6B9080'",  # Sage (positive)
    r"'#F59E0B'": "'#E89B6F'",  # Coral
    r"'#EF4444'": "'#F4A460'",  # Peach
    r"'#DC2626'": "'#D47B7B'",  # Muted red
    r"'#991B1B'": "'#C4627B'",  # Deeper muted red

    # Background colors in arrays
    r'\[\'#60A5FA\',\s*\'#10B981\',\s*\'#F59E0B\',\s*\'#EF4444\',\s*\'#DC2626\',\s*\'#991B1B\'\]':
        "['#5FA8D3', '#6B9080', '#E89B6F', '#F4A460', '#D47B7B', '#C4627B']",
}

# Smooth scroll code to add
SCROLL_CODE = """
            // Smooth scroll to results
            setTimeout(() => {
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

"""

def update_colors(content):
    """Apply color theme updates"""
    for old_pattern, new_value in COLOR_MAPPINGS.items():
        content = re.sub(old_pattern, new_value, content)
    return content

def update_chart_colors(content):
    """Update chart colors to new palette"""
    for old_pattern, new_value in CHART_COLOR_MAPPINGS.items():
        content = re.sub(old_pattern, new_value, content)
    return content

def add_smooth_scroll(content):
    """Add smooth scroll animation after results display"""
    # Look for pattern: resultDiv.style.display = 'block';
    # And add scroll code after it if not already present

    if 'scrollIntoView' in content:
        return content  # Already has scroll

    pattern = r"(resultDiv\.style\.display\s*=\s*['\"]block['\"];)\s*\n"
    replacement = r"\1\n" + SCROLL_CODE
    content = re.sub(pattern, replacement, content)

    return content

def process_file(filepath):
    """Process a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Apply updates
        content = update_colors(content)
        content = update_chart_colors(content)
        content = add_smooth_scroll(content)

        # Only write if changes were made
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
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'bmi-calculator.html']

    print(f"Found {len(html_files)} HTML files to update (excluding bmi-calculator.html)")

    updated = 0
    for filename in sorted(html_files):
        if process_file(filename):
            print(f"✓ Updated: {filename}")
            updated += 1
        else:
            print(f"- No changes: {filename}")

    print(f"\nCompleted: {updated}/{len(html_files)} files updated")

if __name__ == '__main__':
    main()
