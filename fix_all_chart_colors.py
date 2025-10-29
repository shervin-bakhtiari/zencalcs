#!/usr/bin/env python3
"""
Comprehensive chart color updates
"""
import re
import os

# All color mappings for charts
CHART_COLORS = {
    # Old blues to new palette
    '#93C5FD': '#5FA8D3',  # Light blue to Soft Blue
    '#60A5FA': '#5FA8D3',  # Blue to Soft Blue
    '#3B82F6': '#2C5F6F',  # Primary blue to Teal
    '#2563EB': '#2C5F6F',  # Blue to Teal
    '#1E40AF': '#1F4A56',  # Dark blue to Dark Teal

    # Greens
    '#10B981': '#6B9080',  # Green to Sage
    '#34D399': '#6B9080',  # Light green to Sage

    # Oranges/Reds
    '#F59E0B': '#E89B6F',  # Orange to Coral
    '#FBBF24': '#F4A460',  # Yellow-orange to Peach
    '#EF4444': '#F4A460',  # Red to Peach
    '#DC2626': '#D47B7B',  # Dark red to Muted red
    '#991B1B': '#C4627B',  # Darker red to Deeper muted red

    # Purples
    '#8B5CF6': '#9B8EBF',  # Purple to Lavender
    '#A78BFA': '#9B8EBF',  # Light purple to Lavender

    # Grays
    '#6B7280': '#8B8589',  # Gray to Warm Gray (for data series only, not labels)
}

def update_chart_colors(content):
    """Update all chart colors"""

    for old_color, new_color in CHART_COLORS.items():
        # Handle single quotes
        content = content.replace(f"'{old_color}'", f"'{new_color}'")
        content = content.replace(f'"{old_color}"', f'"{new_color}"')

        # Handle direct color assignments
        content = content.replace(f': {old_color}', f': {new_color}')
        content = content.replace(f':{old_color}', f':{new_color}')

        # Handle rgba/rgb conversions
        if old_color == '#2563EB':
            content = content.replace('rgba(37, 99, 235', 'rgba(44, 95, 111')
        elif old_color == '#3B82F6':
            content = content.replace('rgba(59, 130, 246', 'rgba(44, 95, 111')

    return content

def process_file(filepath):
    """Process a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = update_chart_colors(content)

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
            print(f"✓ Updated chart colors: {filename}")
            updated += 1

    print(f"\nCompleted: {updated}/{len(html_files)} files updated")

if __name__ == '__main__':
    main()
