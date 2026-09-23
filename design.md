# DESIGN.md — MealMentor AI

## App Identity

- **Name**: MealMentor AI
- **Tagline**: Your AI-Powered Clinical Dietitian
- **Category**: Health & Nutrition (Healthify-style)
- **Platform**: Mobile (Android / iOS)
- **Visual Inspiration**: Healthify, HealthifyMe, MyFitnessPal — premium Indian health-tech aesthetic

---

## Iconography System

All icons throughout the app use a **consistent outlined stroke icon set** (Lucide, Phosphor, or SF Symbols style). NO emojis are used anywhere in the interface — not in badges, cards, labels, buttons, navigation, or status indicators. Every visual element is a proper vector UI icon rendered at 1.5px–2px stroke weight, optically aligned to the design grid.

- **Icon size small**: 16px (inline labels, status dots)
- **Icon size default**: 20px (list row leading icons, chip icons)
- **Icon size medium**: 24px (nav bar, app bar actions, card headers)
- **Icon size large**: 28–32px (onboarding card leading icons)
- **Icon size hero**: 48px (empty states, upload zones, splash)
- **Icon color default**: `#1A1A1A` (on light surfaces)
- **Icon color muted**: `#6B7280` (secondary/inactive)
- **Icon color active**: `#005C55` (selected, primary actions)
- **Icon color on-dark**: `#FFFFFF` (on emerald/dark surfaces)
- **Style**: Outlined stroke, rounded line caps, 2px stroke weight, no fill unless active state

---

## Design System Tokens

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | `#005C55` | CTAs, active states, progress fills, nav highlights |
| Primary Light | `#E0F2F1` | Chip backgrounds, subtle tints, card accents |
| Primary Dark | `#003D38` | Header gradients, status bar |
| Secondary | `#FF6B35` | Calorie rings, warnings, streak badges |
| Accent Gold | `#FFB800` | Fat macro ring, premium badges |
| Accent Purple | `#7C4DFF` | Carb macro ring, AI chat bubbles |
| Accent Blue | `#2196F3` | Protein macro ring, water tracker |
| Surface | `#FFFFFF` | Card backgrounds |
| Background | `#F5F7F5` | Screen backgrounds (very light sage) |
| Text Primary | `#1A1A1A` | Headlines, body text |
| Text Secondary | `#6B7280` | Captions, labels, placeholders |
| Text Tertiary | `#9CA3AF` | Disabled text |
| Success | `#22C55E` | Positive feedback, completed states |
| Error | `#EF4444` | Error states, required fields |
| Divider | `rgba(0, 0, 0, 0.06)` | Subtle line separators |

### Typography

| Level | Font | Weight | Size |
|---|---|---|---|
| Display | Plus Jakarta Sans | 800 | 32px |
| Headline | Plus Jakarta Sans | 700 | 24px |
| Title | Plus Jakarta Sans | 700 | 20px |
| Subtitle | Plus Jakarta Sans | 600 | 16px |
| Body | Inter | 400 | 15px |
| Body Bold | Inter | 600 | 15px |
| Caption | Inter | 500 | 13px |
| Overline | Inter | 700 | 11px, uppercase, 1.2px letter-spacing |

### Corner Radius

| Element | Radius |
|---|---|
| Full-width buttons | 16px |
| Cards | 20px |
| Chips / Tags | 24px (pill) |
| Input fields | 14px |
| Bottom sheet | 28px top-left, 28px top-right |
| Avatar circles | 50% |

### Elevation & Shadows

- Cards: `0 2px 12px rgba(0, 0, 0, 0.06)`
- Floating buttons: `0 8px 24px rgba(0, 92, 85, 0.25)`
- Bottom nav: `0 -4px 20px rgba(0, 0, 0, 0.06)`
- **NO grey border outlines on any element — use shadows only**

### Spacing Scale

- `4px` micro gap
- `8px` tight
- `12px` compact
- `16px` default
- `20px` comfortable
- `24px` section gap
- `32px` large section

---

## Global Component Patterns

### Bottom Navigation Bar (5 tabs)
- Height: 64px + safe area inset
- Background: white with top shadow (no top border line)
- Icons: 24x24, outlined stroke when inactive, filled when active
- Active tab: Primary color icon + label, inactive: `#9CA3AF`
- Tabs: **Home** (house outline icon), **Scan** (camera outline icon, center prominent), **Meals** (utensils outline icon), **AI Chat** (sparkle outline icon), **Profile** (user-circle outline icon)

### Top App Bar
- Height: 56px
- Left: chevron-left icon or menu icon
- Center: screen title (Subtitle weight)
- Right: contextual action icons (bell, settings, etc.)
- Background: white, no bottom border line, subtle shadow

### Primary Button
- Full width, 56px height, 16px radius
- Background: linear gradient `#005C55` to `#00796B`
- Text: white, 16px, 700 weight
- Shadow: `0 8px 24px rgba(0, 92, 85, 0.3)`
- No border, no outline

### Secondary Button
- Full width, 56px height, 16px radius
- Background: `#E0F2F1`
- Text: `#005C55`, 16px, 600 weight
- No border, no outline

### Input Field
- Height: 56px, 14px radius
- Background: `#F5F7F5`
- Placeholder: `#9CA3AF`
- Focus state: 2px solid `#005C55` border
- Label above: Caption style
- No grey border in default state
- Leading icon: 20px, `#6B7280`, outlined stroke

### Card Component
- Background: white
- Radius: 20px
- Shadow: `0 2px 12px rgba(0, 0, 0, 0.06)`
- Padding: 20px
- **No border/outline ever**

### Selectable Option Card (for onboarding)
- Default: white card, shadow, no border
- Selected: `#E0F2F1` background, left 3px solid `#005C55` accent bar, subtle green shadow
- Left icon: 28px outlined stroke icon in `#005C55`, no emoji
- Title: Subtitle weight
- Description (optional): Caption style, `#6B7280`

---

## Screen Specifications

---

### Screen 1: Welcome / Splash

- Full screen
- Background: deep emerald gradient (`#003D38` to `#005C55` to `#00796B`)
- Center: App logo (stylized leaf + fork vector icon in white, 64px), clean geometric design
- Below logo: "MealMentor AI" in Display size, white
- Below name: "Your AI-Powered Clinical Dietitian" in Body, `rgba(255,255,255,0.7)`
- Bottom: "Get Started" primary button (white text on semi-transparent white background) + "Already have an account? Log In" text link
- Decorative: subtle abstract organic curve shapes in `rgba(255,255,255,0.05)` layered in background, no emojis

---

### Screen 2: Login

- Background: `#F5F7F5`
- Top: 80px spacing, then "Welcome Back" in Headline
- Below: "Sign in to continue your health journey" in Body, `#6B7280`
- 24px gap
- **Email input field** with mail outline icon left
- 12px gap
- **Password input field** with lock outline icon left, eye/eye-off toggle icon right
- 8px gap, right-aligned "Forgot Password?" text link in Caption, Primary color
- 24px gap
- **"Sign In" primary button**, full width
- 20px gap
- Horizontal divider line with "or continue with" centered label
- 16px gap
- **Google Sign-In button**: white card, Google "G" logo left, "Continue with Google" text, full width, 56px height, 16px radius, shadow, no border
- Bottom: "Don't have an account? **Register**" centered, Body style

---

### Screen 3: Register

- Background: `#F5F7F5`
- Top: 60px spacing, then "Create Account" in Headline
- Below: "Start your personalized nutrition journey" in Body, `#6B7280`
- 24px gap
- **Full Name input** with user outline icon
- 12px gap
- **Email input** with mail outline icon
- 12px gap
- **Phone Number input** with phone outline icon, "+91" country code prefix chip
- 12px gap
- **Password input** with lock outline icon, eye toggle icon, strength indicator bar below (4 segments: red to orange to yellow to green)
- 24px gap
- **"Create Account" primary button**, full width
- 16px gap
- Horizontal divider with "or sign up with"
- 16px gap
- **Google Sign-Up button** (same style as login)
- Bottom: "Already have an account? **Sign In**" centered

---

### Screen 4: OTP Verification

- Background: `#F5F7F5`
- Top: 60px, then circular emerald icon (56px) with mail outline icon inside (28px, white)
- 20px gap
- "Verify Your Email" in Headline, centered
- "We've sent a 6-digit code to" in Body, `#6B7280`, centered
- Email address in Body Bold, `#005C55`, centered
- 32px gap
- **6 individual digit boxes** in a row, each 52x56px, 14px radius, `#F5F7F5` background, focused box gets `#005C55` border
- 24px gap
- **"Verify & Continue" primary button**, full width
- 16px gap
- "Didn't receive the code? **Resend**" centered, with 30s countdown timer

---

### Screen 5: Onboarding Step 1 — Health Objective

- Top: emerald capsule badge with crosshair/target outline icon (16px) + "HEALTH OBJECTIVE" text (Overline style, `#005C55` on `#E0F2F1`)
- Below badge: smooth 11-segment progress bar (segment 1 filled with Primary, rest `#E8ECEB`)
- 20px gap
- "What are you looking for?" in Headline
- "Choose your primary health goal" in Caption, `#6B7280`
- 20px gap
- **6 Selectable Option Cards** in vertical list, each with a 28px outlined icon on left:
  - Scale/trending-down icon + "Weight Loss" — "Shed extra kilos healthily"
  - Dumbbell icon + "Muscle Gain" — "Build lean muscle mass"
  - Activity/heart-pulse icon + "Diabetes Control" — "Manage Type 2 Diabetes"
  - Flower/leaf icon + "PCOS / Hormonal Balance" — "Balance hormones naturally"
  - Heart icon + "Heart Health" — "Lower cholesterol & BP"
  - Sparkles icon + "General Wellness" — "Eat cleaner, feel better"
- Bottom sticky: **"Continue" primary button** + "Skip" text link below

---

### Screen 6: Onboarding Step 2 — Activity Level

- Progress bar: 2/11 segments filled
- Badge: zap/bolt outline icon (16px) + "ACTIVITY LEVEL"
- "How active are you?" in Headline
- "This helps us calculate your daily calorie needs" in Caption
- **4 Selectable Option Cards** with 28px outlined icons:
  - Armchair/sofa icon + "Sedentary" — "Little or no exercise, desk job"
  - Footprints/walking icon + "Lightly Active" — "Light exercise 1-3 days/week"
  - Running-person icon + "Moderately Active" — "Moderate exercise 3-5 days/week"
  - Flame icon + "Very Active" — "Hard exercise 6-7 days/week"
- Bottom sticky: "Continue" button

---

### Screen 7: Onboarding Step 3 — Regional Diet

- Progress bar: 3/11
- Badge: map-pin outline icon (16px) + "REGIONAL DIET"
- "Where are you from?" in Headline
- "We'll customize meals to your regional cuisine" in Caption
- **Horizontal scrollable chip row** for quick filters: All, North, South, West, East
- **6 Selectable Option Cards** with 28px outlined icons:
  - Wheat icon + "North Indian" — "Roti, dal, paneer, rajma"
  - Leaf/rice icon + "South Indian" — "Rice, sambar, rasam, dosa"
  - Utensils icon + "Gujarati / Maharashtrian" — "Thepla, poha, vada pav"
  - Fish icon + "Bengali" — "Fish curry, rice, mishti"
  - Sprout/seedling icon + "Jain / Sattvic" — "No onion, garlic, root vegetables"
  - Globe icon + "Continental / Mixed" — "Flexible international cuisine"
- Bottom sticky: "Continue" button

---

### Screen 8: Onboarding Step 4 — Age

- Progress bar: 4/11
- Badge: calendar outline icon (16px) + "CHRONOLOGICAL AGE"
- "What's your age?" in Headline
- Center: **Large number input** (Display size, 64px, centered, `#1A1A1A`)
- Below number: "years" label in Caption
- Flanking the number: circular **minus** and **plus** stepper buttons (48px, `#E0F2F1` background, `#005C55` minus/plus icons)
- Below steppers: **Preset age chips** in a row: 18, 25, 30, 35, 40, 50
- Bottom sticky: "Continue" button

---

### Screen 9: Onboarding Step 5 — Height

- Progress bar: 5/11
- Badge: ruler outline icon (16px) + "HEIGHT METRIC"
- "How tall are you?" in Headline
- Toggle: **cm / ft** switch pill (selected = filled Primary, unselected = `#E8ECEB`)
- Center: **Large number input** (Display size)
- Below: "cm" or "ft" label
- Minus and plus stepper buttons
- **Preset chips**: 150, 160, 165, 170, 175, 180 cm
- Bottom sticky: "Continue" button

---

### Screen 10: Onboarding Step 6 — Biological Sex

- Progress bar: 6/11
- Badge: DNA/helix outline icon (16px) + "BIOLOGICAL SEX"
- "What's your biological sex?" in Headline
- "This affects your metabolic rate calculations" in Caption
- **2 large Selectable Cards** side by side:
  - Left: Male silhouette outline icon (48px) + "Male" label below
  - Right: Female silhouette outline icon (48px) + "Female" label below
- Each card: 160px tall, centered icon, title below
- Bottom sticky: "Continue" button

---

### Screen 11: Onboarding Step 7 — Weight & BMI

- Progress bar: 7/11
- Badge: scale/weight outline icon (16px) + "WEIGHT & BMI"
- "What's your current weight?" in Headline
- Toggle: **kg / lbs** switch pill
- Center: **Large number input** (Display size)
- Minus and plus stepper buttons
- **Preset chips**: 50, 60, 65, 70, 75, 80, 90 kg
- 24px gap
- **BMI Result Card**: emerald-tinted card showing calculated BMI value (Title size), category label ("Normal", "Overweight", etc.), and a horizontal BMI scale bar with indicator dot
- Bottom sticky: "Continue" button

---

### Screen 12: Onboarding Step 8 — Medical Conditions

- Progress bar: 8/11
- Badge: stethoscope outline icon (16px) + "CLINICAL CONDITIONS"
- "Any medical conditions we should be aware of?" in Headline
- "Select all that apply" in Caption
- **Multi-select Selectable Cards** with 28px outlined icons and a checkbox circle on the right:
  - Droplet icon + "Type 2 Diabetes"
  - Pill/capsule icon + "Hypertension"
  - Heart-pulse icon + "Heart Disease"
  - Shield icon + "Thyroid Disorder"
  - Flower icon + "PCOS / PCOD"
  - Beaker icon + "Cholesterol Issues"
  - Brain icon + "Anxiety / Stress"
  - Check-circle icon + "None of the above"
- Each card has a checkbox circle on the right, filled green with checkmark when selected
- Bottom sticky: "Continue" button

---

### Screen 13: Onboarding Step 9 — Target Weight & Goal Setting

- Progress bar: 9/11
- Badge: target/crosshair outline icon (16px) + "YOUR TARGET"
- "What's your target weight?" in Headline
- Center: **Large number input** (Display size) for target weight
- Minus and plus stepper buttons
- 24px gap
- **Hero Target Card**: emerald gradient card showing:
  - "Weight to lose/gain: X kg" in white
  - "Recommended pace: 0.5 kg/week" in semi-transparent white
  - "Estimated timeline: ~X weeks" in white, Title size
- Bottom sticky: "Continue" button

---

### Screen 14: Onboarding Step 10 — AI Setup Loading

- Progress bar: 10/11
- Badge: sparkle outline icon (16px) + "AI NUTRITION SETUP"
- "Setting up your personalized plan..." in Headline, centered
- Center: **Animated loading ring** (emerald gradient spinner, 80px)
- Below spinner: sequential status messages appearing one by one with fade-in, each prefixed with a small checkmark icon (16px, `#22C55E`):
  - "Analyzing your health profile..."
  - "Calculating daily calorie target..."
  - "Building meal recommendations..."
  - "Configuring AI dietitian..."
- 24px gap
- **Nutrition Blueprint Card**: white card showing calculated results:
  - Daily Calorie Target: "1,850 kcal" (Display size, Primary color)
  - Macro split row: 3 mini pills — Protein "92g", Carbs "210g", Fat "62g"
  - Below: "Based on your BMR of 1,620 kcal + activity factor"
- Auto-advances to next step after 3 seconds, or user taps "Continue"

---

### Screen 15: Onboarding Step 11 — Upload Lab Report

- Progress bar: 11/11 (fully filled)
- Badge: file-text outline icon (16px) + "MEDICAL LAB REPORT"
- "Upload your latest lab report" in Headline
- "Share your blood work for deeper health insights (optional)" in Caption
- 24px gap
- **Upload area**: large dashed-border card (200px tall), centered:
  - Cloud-upload outline icon (48px, `#005C55`)
  - "Tap to upload PDF" in Subtitle
  - "Supports PDF up to 10 MB" in Caption, `#9CA3AF`
- When file selected, the card transforms to show:
  - File-text icon + filename + file size
  - Circular green checkmark badge icon
  - "Remove" text link
- 24px gap
- **"Complete Setup" primary button**
- "Skip for now" text link below button

---

### Screen 16: Dashboard (Home)

- **Top section**: No separate app bar. Instead, a greeting area:
  - Left: "Good Morning, [Name]" in Title
  - Right: bell outline icon (24px) + profile avatar (40px circle)
- 16px gap
- **Daily Calorie Card**: large emerald gradient card (200px tall):
  - Center: large circular progress ring (120px diameter) showing calories consumed vs target
  - Inside ring: consumed number (Display size, white), "/ 1,850 kcal" below (Caption, semi-white)
  - Below ring: date "Today, 18 Sep" in Caption
  - Bottom row inside card: 3 mini macro rings side by side:
    - Protein ring (blue) with "42g / 92g"
    - Carbs ring (purple) with "98g / 210g"
    - Fat ring (gold) with "28g / 62g"
- 16px gap
- **Quick Actions Row**: horizontal scroll of action chips, each with a small 16px outlined icon:
  - Camera icon + "Scan Meal"
  - Droplet icon + "Log Water"
  - Edit/pencil icon + "Add Manually"
  - Bar-chart icon + "View Report"
- 16px gap
- **Today's Meals Section**: "Today's Meals" title with "See All >" link
  - Vertical list of meal slot cards:
    - **Breakfast card**: meal name, photo thumbnail (60x60, rounded), calories, time logged — or empty state with "+" button and "Add Breakfast" prompt
    - **Lunch card**: same pattern
    - **Dinner card**: same pattern
    - **Snacks card**: same pattern
- 16px gap
- **Water Tracker Card**: white card with:
  - Droplet outline icon (24px, `#2196F3`) + "Hydration" title
  - Row of 8 water glass vector icons, filled glasses in blue, empty in `#E8ECEB`
  - "4 / 8 glasses" counter with plus and minus icon buttons
- 16px gap
- **AI Insight Card**: white card with sparkle outline icon (24px, `#7C4DFF`):
  - "AI Insight" title
  - "You're 380 kcal under your protein target. Try adding a serving of paneer or 2 boiled eggs to your dinner." in Body
  - "Ask AI Dietitian" + arrow-right icon, action link in Primary color
- Bottom: Tab navigation bar

---

### Screen 17: Food Scan (Camera)

- Full screen camera viewfinder occupying top 65% of screen
- Viewfinder overlay: rounded corner frame guide (subtle white border, 280x280, centered)
- Top bar overlay (semi-transparent black gradient):
  - Left: chevron-left icon (white)
  - Center: "Scan Your Meal" in Subtitle, white
  - Right: flash/zap toggle icon (white)
- Bottom 35%: white bottom sheet with rounded top corners (28px radius):
  - **Shutter button**: centered, 72px circle, white border, emerald fill, camera outline icon inside
  - Left of shutter: **Gallery button** (48px, `#F5F7F5` circle, image/photo outline icon)
  - Right of shutter: **History button** (48px, `#F5F7F5` circle, clock outline icon)
  - Below buttons: "Point your camera at the food plate" in Caption, centered
- **After photo capture** — bottom sheet expands to show:
  - Captured thumbnail (full width, 120px, rounded top)
  - "Identified: Dal Tadka with Rotis" in Title, editable with pencil outline icon
  - **Portion size chips**: `0.5x`, `1.0x` (selected), `1.5x`, `2.0x`
  - **Macro breakdown row**: Calories "385 kcal", Protein "12g", Carbs "48g", Fat "14g"
  - **Meal type chips**: Breakfast, Lunch (selected), Dinner, Snacks
  - **"Confirm & Log" primary button**

---

### Screen 18: Meal History

- Top app bar: "Meal Diary" title
- **Search bar**: rounded input with search outline icon, placeholder "Search meals..."
- 12px gap
- **Date navigation**: chevron-left icon, "Today, 18 Sep 2026" centered, chevron-right icon
- 16px gap
- **Day summary card**: white card with:
  - "1,280 / 1,850 kcal" in Title
  - Horizontal progress bar (emerald fill)
  - Macro row: P: 42g, C: 98g, F: 28g
- 16px gap
- **Meal groups** (expandable sections), each with a small outlined icon (20px):
  - Sunrise outline icon + **Breakfast** — chevron, total "320 kcal"
    - Individual meal item rows: photo thumbnail (48px), meal name, calories, time
  - Sun outline icon + **Lunch** — same pattern
  - Moon outline icon + **Dinner** — same pattern
  - Cookie outline icon + **Snacks** — same pattern
- Each meal row is swipeable to reveal "Edit" (blue, pencil icon) and "Delete" (red, trash icon) actions
- FAB button (bottom right): plus icon with emerald gradient, shadow

---

### Screen 19: AI Dietitian Chat

- Top app bar: sparkle outline icon + "AI Dietitian" title + green status dot (8px circle)
- Chat area (scrollable):
  - **AI welcome message** (left-aligned, emerald-tinted bubble, 16px radius):
    - "Hello! I'm your personal AI dietitian. I can help with meal plans, nutrition questions, and health advice tailored to your profile. What would you like to know?"
  - **User message** (right-aligned, Primary colored bubble, white text)
  - **AI response** (left-aligned, includes formatted text, bullet points, food suggestions — no emojis, use clean typography only)
  - **Typing indicator**: 3 animated dots in emerald bubble
- **Quick suggestion chips** above input (horizontal scroll):
  - "What should I eat for dinner?"
  - "Am I eating enough protein?"
  - "Low-calorie snack ideas"
  - "Meal plan for this week"
- **Input area** (bottom, sticky):
  - White card background, top shadow
  - Text input with "Ask me anything about nutrition..." placeholder
  - Right: circular send button (emerald fill, arrow-up outline icon in white)

---

### Screen 20: Profile

- **Profile hero card** (top, emerald gradient background):
  - Profile photo (80px circle, white border) centered
  - Name in Title, white
  - Email in Caption, semi-white
  - "Edit Profile" pill button (semi-transparent white, pencil icon 16px)
- 16px gap on `#F5F7F5` background
- **Health Stats Row**: 3 mini stat cards side by side:
  - "BMI" — "23.4" — "Normal" (green dot indicator)
  - "Weight" — "68 kg" — small trending-down arrow icon + "2.3 kg" (green text)
  - "Streak" — "12" — flame outline icon (16px) + "days"
- 16px gap
- **Goal Card**: white card:
  - Current goal title + target outline icon
  - "Target: 62 kg" — progress bar — "Current: 68 kg"
  - "Pace: 0.5 kg/week"
- 16px gap
- **Menu sections** (list of tappable rows, each with a 20px outlined icon left and chevron-right icon right):
  - **Health Data**:
    - Bar-chart outline icon + "Health Analytics"
    - File-text outline icon + "Lab Reports"
  - **Preferences**:
    - Utensils outline icon + "Diet Preferences"
    - Target outline icon + "Update Goals"
    - Stethoscope outline icon + "Medical Conditions"
  - **Account**:
    - Bell outline icon + "Notifications"
    - Lock outline icon + "Privacy & Security"
    - Help-circle outline icon + "Help & Support"
    - Log-out outline icon + "Sign Out" (red text)

---

### Screen 21: Upload Health Reports

- Top app bar: "Lab Reports" title
- **Upload section** (top card):
  - Dashed upload area (same style as onboarding step 11)
  - Cloud-upload outline icon (48px) + "Upload Blood Work PDF" title
  - Supported formats note
- 16px gap
- **Previous Reports** section title
- List of uploaded report cards, each showing:
  - File-text outline icon + report name ("Blood Work — Aug 2026")
  - Upload date + file size
  - Right: eye outline icon ("View") and trash outline icon ("Delete")
  - Status badge: checkmark-circle icon + "Analyzed" (green) or clock icon + "Processing" (amber)
- 16px gap
- **Key Markers Section** (if a report is analyzed):
  - "Key Health Markers" title
  - Grid of marker cards (2 columns):
    - Each card: marker name, value, small colored status dot (6px circle: green/yellow/red), normal range text below
    - E.g., "HbA1c — 6.2%" with green dot, "Cholesterol — 210 mg/dL" with yellow dot, "Vitamin D — 18 ng/mL" with red dot

---

### Screen 22: Health Analytics

- Top app bar: "Analytics" title
- **Time range selector**: chip row — "Week", "Month" (selected), "3 Months", "6 Months"
- 16px gap
- **Calorie Trend Chart Card**: white card with line chart
  - X-axis: dates, Y-axis: calories
  - Line: emerald gradient
  - Target line: dashed orange
  - Dots on data points
- 16px gap
- **Weight Trend Chart Card**: white card with area chart
  - Gradient fill under the line (light emerald)
  - Start weight and current weight labels
- 16px gap
- **Macro Breakdown Card**: white card
  - Donut chart (3 segments: blue protein, purple carbs, gold fat)
  - Legend with percentages
  - "Average daily: P 86g / C 195g / F 58g"
- 16px gap
- **Nutrition Score Card**: white card
  - Large circular score (0-100) with gradient ring
  - Score number in Display size
  - "Your Nutrition Score" below
  - 4 sub-metrics: Diet Variety, Consistency, Macro Balance, Hydration — each with small progress bar

---

## Interaction Patterns

- **Transitions**: Smooth slide-left for forward navigation, slide-right for back
- **Loading states**: Skeleton shimmer placeholders (not spinners) for content loading
- **Empty states**: Clean minimal vector illustrations with "No data yet" message and CTA button
- **Pull to refresh**: Emerald colored refresh indicator
- **Haptic feedback**: Subtle vibration on button presses and successful actions
- **Micro-animations**:
  - Progress rings animate from 0 to current value on screen load
  - Cards have subtle scale-up on press (0.98 to 1.0)
  - Onboarding transitions slide smoothly between steps
  - Water glasses fill with a wave animation

---

## Key Design Rules

1. **ZERO emojis anywhere** — Use proper outlined stroke vector icons (Lucide/Phosphor/SF Symbols style) for all visual indicators, badges, card icons, navigation, and status markers. The app must look like a premium, minimal, production-grade product — not a chat message.
2. **ZERO grey borders or outlines** — Cards and buttons use shadow elevation only
3. **Premium whitespace** — generous padding, never cramped
4. **Consistent emerald accent** — Primary `#005C55` used as the anchor color everywhere
5. **Indian-first content** — All food examples use Indian dishes (dal, roti, paneer, dosa, biryani)
6. **Accessible contrast** — All text meets WCAG AA on its background
7. **Mobile-first** — Designed for 390x844 viewport (iPhone 14 / equivalent Android)
8. **Dark mode ready** — All tokens have dark mode counterparts (not designed here, but structured for it)
9. **Minimal & Rich** — Every screen should feel clean, breathable, and high-end. Avoid visual clutter, decorative noise, or playful elements. The interface should feel like a premium clinical wellness product.
