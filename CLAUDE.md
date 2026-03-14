# CLAUDE.md

## Intro

**RoleMark** is an AI-powered SaaS application that helps job seekers optimize their resumes for specific roles. It provides resume scoring, tailoring, cover letter generation, and rich text editing with AI assistance.

**Tagline:** Every role deserves the right resume

### Core Features
- **AI Resume Scoring**: Upload resume (PDF) and job description to get compatibility score with detailed feedback (free tier)
- **Resume Tailoring**: Generate role-specific resume versions optimized for ATS systems (paid feature)
- **Cover Letter Generation**: AI-powered cover letters with tone customization (paid feature)
- **Rich Text Editor**: Tiptap-based WYSIWYG editor with inline AI assistance
- **Version Management**: Track and manage multiple versions of resumes
- **Company Organization**: Organize job applications by target companies
- **Command Bar**: Spotlight-style search (Cmd+K) for quick navigation
- **PDF Export**: Export tailored resumes to PDF format

### Business Model
- **Free Tier**: 1 resume upload + AI scoring (limited usage)
- **One-time Purchases**: $4.99 (resume) / $2.99 (cover letter) / $6.99 (bundle)
- **Subscriptions**: $12.99/mo or $99.99/yr (unlimited features)

## Documentation

- **Project Overview**: See `docs/ROLEMARK_PROJECT_SPEC.md` for comprehensive technical documentation
- **Quick Start**: See `README.md` for setup instructions and API reference
- **Dependencies**: See `package.json` for project dependencies and scripts
- **Database Schema**: See `/scripts/` directory for SQL migration files
- **Configuration**: See `components.json`, `tsconfig.json`, `next.config.mjs` for project configuration

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
- Update CLAUDE.md if adding new development workflows or tips