#!/usr/bin/env python3
"""
Fix button colors to use warm accent gradient
"""
import re
import os

def fix_buttons(content):
    """Replace teal button gradients with warm accent colors"""

    # Fix the calculate button gradient
    content = re.sub(
        r'background:\s*linear-gradient\(135deg,\s*#2C5F6F\s+0%,\s*#2C5F6F\s+100%\)',
        'background: linear-gradient(135deg, #E89B6F 0%, #F4A460 100%)',
        content
    )

    # Fix button shadows to use warm colors
    content = re.sub(
        r'box-shadow:\s*0\s+4px\s+15px\s+rgba\(44,\s*95,\s*111,\s*0\.4\)',
        'box-shadow: 0 4px 15px rgba(232, 155, 111, 0.4)',
        content
    )

    content = re.sub(
        r'box-shadow:\s*0\s+6px\s+20px\s+rgba\(44,\s*95,\s*111,\s*0\.5\)',
        'box-shadow: 0 6px 20px rgba(232, 155, 111, 0.5)',
        content
    )

    return content

def process_file(filepath):
    """Process a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_buttons(content)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]

    updated = 0
    for filename in sorted(html_files):
        if process_file(filename):
            print(f"✓ Fixed buttons: {filename}")
            updated += 1

    print(f"\nCompleted: {updated}/{len(html_files)} files updated")

if __name__ == '__main__':
    main()
