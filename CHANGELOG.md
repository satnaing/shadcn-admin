## v1.0.1 (2024-12-14)

### Fix

- merge two button components into one (#60)
- loading all tabler-icon chunks in dev mode (#59)
- display menu dropdown when sidebar collapsed (#58)
- update spacing & alignment in dialogs/drawers
- update border & transition of sticky columns in user table
- update heading alignment to left in user dialogs
- add height and scroll area in user mutation dialogs
- update `/dashboard` route to just `/`
- **build**: replace require with import in tailwind.config.js

### Refactor

- remove unnecessary layout-backup file

## v1.0.0 (2024-12-09)

### BREAKING CHANGE

- Restructured the entire folder
hierarchy to adopt a feature-based structure. This
change improves code modularity and maintainability
but introduces breaking changes.

### Feat

- implement task dialogs
- implement user invite dialog
- implement users CRUD
- implement global command/search
- implement custom sidebar trigger
- implement coming-soon page

### Fix

- uncontrolled issue in account setting
- card layout issue in app integrations page
- remove form reset logic from useEffect in task import
- update JSX types due to react 19
- prevent card stretch in filtered app layout
- layout wrap issue in tasks page on mobile
- update user column hover and selected colors
- add setTimeout in user dialog closing
- layout shift issue in dropdown modal
- z-axis overflow issue in header
- stretch search bar only in mobile
- language dropdown issue in account setting
- update overflow contents with scroll area

### Refactor

- update layouts and extract common layout
- reorganize project to feature-based structure

## v1.0.0-beta.5 (2024-11-11)

### Feat

- add multiple language support (#37)

### Fix

- ensure site syncs with system theme changes (#49)
- recent sales responsive on ipad view (#40)

## v1.0.0-beta.4 (2024-09-22)

### Feat

- upgrade theme button to theme dropdown (#33)
- **a11y**: add "Skip to Main" button to improve keyboard navigation (#27)

### Fix

- optimize onComplete/onIncomplete invocation (#32)
- solve asChild attribute issue in custom button (#31)
- improve custom Button component (#28)

## v1.0.0-beta.3 (2024-08-25)

### Feat

- implement chat page (#21)
- add 401 error page (#12)
- implement apps page
- add otp page

### Fix

- prevent focus zoom on mobile devices (#20)
- resolve eslint script issue (#18)
- **a11y**: update default aria-label of each pin-input
- resolve OTP paste issue in multi-digit pin-input
- update layouts and solve overflow issues (#11)
- sync pin inputs programmatically

## v1.0.0-beta.2 (2024-03-18)

### Feat

- implement custom pin-input component (#2)

## v1.0.0-beta.1 (2024-02-08)

### Feat

- update theme-color meta tag when theme is updated
- add coming soon page in broken pages
- implement tasks table and page
- add remaining settings pages
- add example error page for settings
- update general error page to be more flexible
- implement settings layout and settings profile page
- add error pages
- add password-input custom component
- add sign-up page
- add forgot-password page
- add box sign in page
- add email + password sign in page
- make sidebar responsive and accessible
- add tailwind prettier plugin
- make sidebar collapsed state in local storage
- add check current active nav hook
- add loader component ui
- update dropdown nav by default if child is active
- add main-panel in dashboard
- **ui**: add dark mode
- **ui**: implement side nav ui

### Fix

- update incorrect overflow side nav height
- exclude shadcn components from linting and remove unused props
- solve text overflow issue when nav text is long
- replace nav with dropdown in mobile topnav
- make sidebar scrollable when overflow
- update nav link keys
- **ui**: update label style

### Refactor

- move password-input component into custom component dir
- add custom button component
- extract redundant codes into layout component
- update react-router to use new api for routing
- update main panel layout
- update major layouts and styling
- update main panel to be responsive
- update sidebar collapsed state to false in mobile
- update sidebar logo and title
- **ui**: remove unnecessary spacing
- remove unused files
