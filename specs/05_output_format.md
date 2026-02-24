# Output Format Specification

## Purpose
This document defines the exact structure of the agent’s output.

All outputs must follow this format strictly.
No additional sections are allowed.

## Output structure

The agent must return:

1. Metadata
2. Competitor list
3. Competitor comparison table
4. Analysis summary
5. Identified gaps and differentiation areas

## 1. Metadata

Includes:
- Input company name
- Industry or category
- Date of analysis
- Data confidence level (High / Medium / Low)

## 2. Competitor list

For each competitor:
- Name
- Website URL
- Competitor type (Direct / Indirect / Alternative)

## 3. Competitor comparison table

Each competitor must include:
- Core value proposition (1–2 lines)
- Key features (bullet list)
- Pricing model (Free / Paid / Custom / Unknown)
- Target customer type

## 4. Analysis summary

A concise paragraph covering:
- Overall market positioning
- Common patterns across competitors
- Major differences in approach

## 5. Gaps and differentiation opportunities

The agent must list:
- 3 observable gaps in the market
- Each gap must be based on collected data
- No speculative or future-looking statements

## Enforcement rules

- Missing data must be labeled as "Unknown"
- The agent must never invent values
- If fewer than 3 competitors exist, state it clearly
