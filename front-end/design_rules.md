# Design Rules for Resume Skill Extractor

## Color Palette: Pastel & Soft

### Light Mode
- **Primary (Pastel Indigo):** #C7D2FE

### Dark Mode
- **Background:** `#18181B` (deep dark, main background)
- **Card/Section:** `#232326` (dark gray, cards and containers)
- **Primary Accent:** `#A5B4FC` (Tailwind indigo-200, headings, highlights)
- **Text:** `#E5E7EB` (Tailwind gray-200, main text)
- **Border:** `#232326` (matches card background, subtle separation)

### Usage
- **Background:** Page backgrounds
- **Card/Section:** Cards, containers, modals
- **Primary Accent:** App name, headings, feature highlights
- **Text:** Main and secondary text
- **Border:** Card and section separation

#### Example (Home Page)
- Main background: `bg-[#F9FAFB]` (light), `dark:bg-[#18181B]` (dark)
- Card/section: `bg-white` (light), `dark:bg-[#232326]` (dark)
- Headings: `text-indigo-500` (light), `dark:text-indigo-200` (dark)
- Text: `text-gray-700` (light), `dark:text-gray-200` (dark)
- Border: `border-gray-200` (light), `dark:border-[#232326]` (dark)

## Button Styles
- **Primary Action:** Primary accent background, dark text, rounded, shadow, bold. Dark mode: lighter indigo, dark text.
- **Accent Action:** Primary accent background, dark text, rounded, shadow, bold. Dark mode: lighter accent, dark text.
- **Danger/Sign Out:** Primary accent text for sign out, underline or bold for emphasis. Hover states deepen color.

## Layout & Typography
- **Surface:** Use `bg-[#F9FAFB] dark:bg-[#18181B]` for main backgrounds and cards. Use `bg-[#232326]` for secondary surfaces in dark mode.
- **Text:** Use `text-gray-700 dark:text-gray-200` for headings and primary text. Use `text-gray-500 dark:text-gray-300` for secondary text.
- **Headings:** Bold, large, and colored with primary accent for emphasis.
- **Headings:** Bold, large, and colored with pastel primary/accent for emphasis.
- **Transitions:** Use `transition-colors duration-200` for smooth color changes.
- **Font:** Use Roboto (`font-roboto`) as the default font for all text, headings, and buttons.

## Accessibility
- Ensure high contrast between text and background in both modes.
- All interactive elements must have visible focus and hover states.
- All text must be readable in both light and dark modes.

## Dark/Light Mode
- All backgrounds, text, and buttons must adapt using Tailwind's `dark:` classes.
- No hardcoded gradients or colors outside the palette.

## Consistency
- Use the pastel palette for all components, pages, and buttons.
- Maintain the same color logic for similar actions (e.g., all primary actions are pastel indigo, all accents are pastel sky, all sign outs are pastel rose).
- Use Roboto font site-wide.

---

_Last updated: 2025-04-16_
