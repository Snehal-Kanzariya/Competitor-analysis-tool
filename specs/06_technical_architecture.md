# Technical Architecture

## AI Model
- **Model**: Claude 3 (specifically Claude 3 Opus or Sonnet from the "Pro" subscription context).
- **Integration**: Use the Anthropic API (`anthropic` Python/Node package).
- **API Key Management**: Use `.env` file to store `ANTHROPIC_API_KEY`.
- **Reasoning**: Claude's strong reasoning capabilities and long context window are ideal for analyzing complex competitor data.

## Implementation Language
- **Language**: TypeScript/Node.js (preferred due to environment availability).
- **Runtime**: Node.js v22+.
- **Package Manager**: npm.

## Agent Structure
- **Entry Point**: `src/index.ts` (or `index.js`).
- **dependencies**:
  - `@anthropic-ai/sdk`: For Claude integration.
  - `dotenv`: For environment variable management.

## Workflow
1.  **Input**: User provides company/product name.
2.  **Process**:
    -   Identify competitors (using search API or LLM knowledge).
    -   Extract data (using scraping or search APIs).
    -   Analyze data (using Claude).
3.  **Output**: Markdown report following `05_output_format.md`.
