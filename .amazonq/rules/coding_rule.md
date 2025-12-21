# Coding Rules

- Use TypeScript only
- Create components for reusability
- Avoid type "any"
- Always create interfaces for request and response with postfix "Request" and "Response"
- Always create interfaces and there files with "I" prefix in the name.
- Manage all response interfaces in the "contracts" folder
- Do not write API calls inside React components. All API calls must be placed inside the src/api/ folder, wrapped in reusable service functions
- Use Redux and Redux-Thunk only when truly necessary. Avoid unnecessary global state management as it can affect performance and increase application complexity
- Use HTTP-only cookies for authentication. Never store sensitive tokens (JWT, refresh token) in localStorage or sessionStorage
- Avoid hard-coded strings in components. Maintain reusable string constants inside a central constants/ folder
- Always follow coding best practices. Write clean, maintainable, testable, and scalable code
- Write code with security in mind. Validate inputs, sanitize outputs, secure API calls, and avoid storing sensitive data on the client side
- Follow the project_structure.md guidelines for folder structure, naming conventions, and architectural patterns
- Use path alias @/ for all imports from src folder instead of relative paths (../../../). Example: @/api/axiosClient instead of ../../../api/axiosClient
- Always try to use Shadcn UI components for consistent design system
- Always try to use TanStack DataTables wherever tables are needed
- Avoid writing console.log anywhere in the code. console.error is allowed for error logging
