#!/usr/bin/env python3
"""
Fix label colors that should remain as gray
"""
import re
import os

def fix_labels(content):
    """Revert label colors from warm gray back to original gray"""

    # Fix category headers and other labels
    content = content.replace('color: #8B8589;', 'color: #6B7280;')

    # Fix in inline styles
    content = content.replace('color:#8B8589', 'color:#6B7280')

    return content

def process_file(filepath):
    """Process a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_labels(content)

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
            print(f"✓ Fixed labels: {filename}")
            updated += 1

    print(f"\nCompleted: {updated}/{len(html_files)} files updated")

if __name__ == '__main__':
    main()
