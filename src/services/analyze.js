import Anthropic from '@anthropic-ai/sdk';
import { COMPANY_SYSTEM_PROMPT, COMPANY_USER_TEMPLATE } from '../prompts/companyAnalysisPrompt';
import { IDEA_SYSTEM_PROMPT, IDEA_USER_TEMPLATE } from '../prompts/ideaAnalysisPrompt';
import { collectAll } from './dataCollectors';

function makeClient(apiKey) {
  const key = apiKey || import.meta.env.VITE_ANTHROPIC_KEY;
  if (!key) throw new Error('No Anthropic API key. Add your key in Settings or set VITE_ANTHROPIC_KEY.');
  return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
}

function extractJson(text) {
  const trimmed = text.trim();
  // Strip markdown fences if model ignores the "no fences" instruction
  const stripped = trimmed.startsWith('```')
    ? trimmed.replace(/^```[^\n]*\n?/, '').replace(/\n?```\s*$/, '').trim()
    : trimmed;
  try {
    return JSON.parse(stripped);
  } catch {
    // Fallback: find the outermost JSON object
    const match = stripped.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new SyntaxError('No JSON object found in response');
  }
}

async function callClaude(system, user, apiKey) {
  const client = makeClient(apiKey);
  try {
    // Stream to avoid request timeouts on large JSON outputs
    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      // Cache the large, stable system prompt across calls (~90% cheaper on repeat requests)
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: user }],
    });

    const message = await stream.finalMessage();

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock) return { ok: false, error: 'No text in response', raw: '' };

    try {
      return { ok: true, data: extractJson(textBlock.text) };
    } catch (e) {
      return { ok: false, error: `JSON parse failed: ${e.message}`, raw: textBlock.text };
    }
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { ok: false, error: 'Invalid API key. Check your key in Settings.' };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, error: 'Rate limit reached. Please wait a moment and try again.' };
    }
    if (error instanceof Anthropic.BadRequestError) {
      return { ok: false, error: `Bad request: ${error.message}` };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, error: `API error ${error.status}: ${error.message}` };
    }
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function analyzeCompany({ target, domain, userCompany, filters, apiKey }) {
  const context = await collectAll(domain, { isLocal: filters?.scope === 'local' });
  const userMsg = COMPANY_USER_TEMPLATE({
    target,
    domain,
    userCompany,
    filterScope: filters?.scope !== 'all' ? filters?.scope : null,
    filterCountry: filters?.filterCountry ?? null,
    filterLanguage: filters?.filterLanguage ?? null,
    filterMaxSize: filters?.filterMaxSize ?? null,
    ...context,
  });
  return callClaude(COMPANY_SYSTEM_PROMPT, userMsg, apiKey);
}

export async function analyzeIdea({ ideaText, targetGeo, targetCustomer, stage, apiKey }) {
  const context = await collectAll(null, { ideaQuery: ideaText });
  const userMsg = IDEA_USER_TEMPLATE({ ideaText, targetGeo, targetCustomer, stage, ...context });
  return callClaude(IDEA_SYSTEM_PROMPT, userMsg, apiKey);
}
