# TechLab Color System

## CSS Variables (defined in `app/globals.css`)

All colors are defined as CSS variables in the `:root` selector. You can edit them easily in VS Code with the color picker.

### Color Palette

```css
:root {
  /* Background Colors */
  --bg-primary: #0D0D0D;      /* Pure black, main background */
  --bg-card: #16213E;         /* Dark blue, card backgrounds */
  
  /* Primary Colors */
  --color-pink: #FF4D8D;      /* Primary pink, borders & accents */
  --color-pink-soft: #FF85A1; /* Softer pink, secondary headers */
  --color-gold: #FFD166;      /* Gold, titles & buttons */
  --color-gold-dark: #F4A261; /* Darker gold, hover states */
  
  /* Text Colors */
  --text-main: #FFFFFF;       /* Primary text, white */
  --text-secondary: #CFCFCF;  /* Secondary text, light gray */
  --text-muted: #8A8A8A;      /* Muted text, medium gray */
}
```

## How to Use

### In `style` prop (Inline Styles)
```tsx
<h1 style={{ color: 'var(--color-gold)' }}>
  Title
</h1>

<div style={{ backgroundColor: 'var(--bg-card)' }}>
  Card content
</div>
```

### With Event Handlers
```tsx
<button
  style={{ backgroundColor: 'var(--color-gold)' }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gold-dark)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
>
  Hover me
</button>
```

## Color Usage Guide

| Variable | Use Case | Example |
|----------|----------|---------|
| `--bg-primary` | Main page background, fade edges | Gallery fade overlay |
| `--bg-card` | Card backgrounds, sections | Gallery item cards |
| `--color-pink` | Primary borders, default state | Card borders, underlines |
| `--color-pink-soft` | Section headers, subtle accents | "About This Gallery" heading |
| `--color-gold` | Titles, buttons, important text | Page titles, "Learn More" buttons |
| `--color-gold-dark` | Hover states, active state | Button hover effect |
| `--text-main` | Primary body text | Card descriptions |
| `--text-secondary` | Secondary text, muted content | Image placeholder text |
| `--text-muted` | Very muted content | Helper text, timestamps |

## Editing Colors in VS Code

1. Open `app/globals.css`
2. Find the color variable you want to change (e.g., `--color-gold: #FFD166`)
3. Hover over the hex code (e.g., `#FFD166`)
4. Click the color square that appears
5. Use the color picker to choose a new color
6. All components using that variable will automatically update!

## Files Using CSS Variables

- `app/globals.css` - Variable definitions
- `app/page.tsx` - HomePage (carousel arrows, titles, dots)
- `app/gallery/page.tsx` - Gallery page (all colors)
- `app/components/NavBar.tsx` - Navigation links (colors on hover)

## Example: Changing the Primary Pink

1. Go to `app/globals.css`
2. Find `--color-pink: #e180a3ff;`
3. Click the pink square next to it
4. Choose a new color (e.g., `#FF1493`)
5. All gallery card borders will instantly update!

## Tips

- **Consistency**: Always use variables instead of hardcoded colors
- **Easy Updates**: Want to rebrand? Change one variable and the whole site updates
- **Hover States**: Use `--color-gold-dark` for hover effects on gold buttons
- **Accessibility**: Keep good contrast between `--text-main` and backgrounds

