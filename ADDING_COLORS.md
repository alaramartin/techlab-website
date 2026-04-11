# Adding New Colors to the System

If you need to add new colors to the color system, follow these steps:

## Step 1: Add to globals.css

Open `app/globals.css` and add your new variable in the `:root` selector:

```css
:root {
  /* ... existing colors ... */
  --bg-primary: #0D0D0D;
  --bg-card: #16213E;
  --color-pink: #da82a2ff;
  --color-pink-soft: #d8a1aeff;
  --color-gold: #e3c378ff;
  --color-gold-dark: #c2a22eff;
  --text-main: #FFFFFF;
  --text-secondary: #CFCFCF;
  --text-muted: #cfacacff;
  
  /* NEW COLOR - Add here */
  --color-accent: #00FF00;
}
```

## Step 2: Use in Components

### Simple text color:
```tsx
<p style={{ color: 'var(--color-accent)' }}>
  Accented text
</p>
```

### Background color:
```tsx
<div style={{ backgroundColor: 'var(--color-accent)' }}>
  Content
</div>
```

### With hover effect:
```tsx
<button
  style={{ backgroundColor: 'var(--color-accent)' }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gold)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
>
  Hover state
</button>
```

## Step 3: Edit with Color Picker

1. Go to `app/globals.css`
2. Find your new variable: `--color-accent: #00FF00;`
3. Hover over the hex code and click the color square
4. Choose your preferred color
5. Save the file - all components using that variable will update instantly!

## Naming Convention

Use clear, descriptive names:

- `--bg-*` for backgrounds (`--bg-primary`, `--bg-card`, `--bg-secondary`)
- `--color-*` for accent colors (`--color-pink`, `--color-gold`)
- `--text-*` for text colors (`--text-main`, `--text-secondary`)
- `--border-*` for border colors (`--border-light`, `--border-dark`)

## Example: Adding an Accent Color

```css
/* In globals.css */
:root {
  /* ... existing ... */
  --color-highlight: #e089a2ff;
}

/* In a component (e.g., page.tsx) */
<div
  style={{
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--color-highlight)',
    borderWidth: '2px'
  }}
>
  Highlighted card
</div>
```

## Quick Reference: All Colors in Use

✅ **Already defined and in use:**
- `--bg-primary` - Used in gallery fade edges
- `--bg-card` - Used in cards and sections
- `--color-pink` - Used for borders and accents
- `--color-pink-soft` - Used for section headers
- `--color-gold` - Used for titles and buttons
- `--color-gold-dark` - Used for hover states
- `--text-main` - Used for primary text
- `--text-secondary` - Used for secondary text
- `--text-muted` - Used for helper text

**To add more:** Follow the steps above!

