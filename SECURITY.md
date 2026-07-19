# Security

## Principles

- This repository publishes a **static** architecture portfolio. There is no backend, database, authentication system, CMS, form processor, or analytics service by default.
- **Never commit secrets**: API tokens, personal access tokens, private keys, `.env` files with credentials, or Cloudflare tokens.
- **Never commit** the `private-interview/` directory. It is listed in `.gitignore` and is for local interview preparation only.
- Do not publish phone numbers, undisclosed employer names, or proprietary system diagrams without an explicit configuration change.

## Cloudflare tokens

If you use optional Cloudflare DNS automation:

1. Create a **scoped** API token with minimum permissions (Zone Read, DNS Edit) for the `michaelandrewhood.com` zone only.
2. Provide it only via the environment variable `CLOUDFLARE_API_TOKEN`.
3. Do **not** paste the token into source code, commit messages, screenshots, or issue trackers.
4. Do **not** log the token. The bootstrap script is written to avoid printing credentials.
5. Rotate the token if it is ever exposed.

## GitHub authentication

Use GitHub CLI (`gh auth login`). Prefer the official browser/device flow. Do not embed personal access tokens in scripts or the repository.

## Employer confidentiality

The public site anonymizes the current healthcare employer by default via `src/data/profile.ts`:

- `showCurrentEmployerName` (default `false`)
- `currentEmployerDisplayName` for the public label

Enable disclosure only when authorized.

## Reporting issues

If you discover a security concern related to this site or its deployment automation (for example, accidental secret exposure), contact the repository owner privately via the email address published on the site and rotate any affected credentials immediately.
