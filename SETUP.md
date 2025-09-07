# Setup Guide

## Quick Setup

```bash
# 1. Clone as your project base
git clone <this-repo> my-project && cd my-project
rm -rf .git && git init

# 2. Setup environment
cp .env.example .env  # Add your API keys
npm install

# 3. Test setup
npm test

# 4. Start building
npx ngen  # Create AI-planned project
```

## Required API Keys

Edit `.env` with:
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **GITHUB_TOKEN**: Create at [GitHub Settings > Tokens](https://github.com/settings/tokens) (needs `repo`, `workflow` scopes)
- **GITHUB_OWNER**: Your GitHub username

## Troubleshooting

**GitHub Token Error (403):**
- Ensure token has `repo` and `workflow` scopes
- Check token isn't expired
- Verify GITHUB_OWNER matches your username

**API Key Issues:**
- Verify GEMINI_API_KEY is correct
- Check API quotas/billing

**For complete documentation: [docs/README.md](docs/README.md)**