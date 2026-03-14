# AGENTS.md

## Dev environment tips
- Use `pnpm dev` to start the Next.js development server on localhost:3000
- Run `pnpm install` to add new dependencies from package.json
- Use `pnpm lint` to check ESLint and TypeScript errors across the project
- Check the name field in package.json to confirm the project name
- Environment variables go in `.env.local` - see README.md for required vars

## Testing instructions
- Run `pnpm lint` to check for ESLint and TypeScript errors
- Run `pnpm build` to ensure the project builds successfully for production
- No automated tests are currently configured - focus on linting and build checks
- After changing imports or moving files, run `pnpm lint` to verify no errors
- Fix any lint or build errors before committing

## PR instructions
- Title format: [rolemark] <Title>
- Always run `pnpm lint` and `pnpm build` before committing
- Ensure all environment variables are properly configured for local testing
- Test authentication flow and payment integration if modified
- Update AGENTS.md if adding new development workflows or tips
- See docs/ROLEMARK_PROJECT_SPEC.md for comprehensive project documentation
