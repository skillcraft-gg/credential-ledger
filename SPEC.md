# Credentials Registry Specification

## Purpose

The credentials repository defines credential rules and manages credential issuance.

Published site:

skillcraft.gg/credentials (rendered by skillcraft-gg.github.io)

Source of truth:

The credentials definitions in this repository.

Deployment model:

/credentials content is generated from this source during Pages builds.

---

## Identifier Format

/

Example:

skillcraft-gg/practitioner-threat-model-l1

---

## Credential Definition

Example:

```yaml
id: skillcraft-gg/practitioner-threat-model-l1
name: Threat Model I
requirements:
  skill: blairhudson/threat-model
  min_commits: 3

Example loadout credential:

id: skillcraft-gg/loadout-secure-dev-l1
requirements:
  loadout: blairhudson/secure-dev
  min_commits: 5


⸻

Claim Submission

skillcraft claim <credential>

CLI creates a GitHub issue.

⸻

Claim Payload

claimant:
  github: blairhudson
credential: skillcraft-gg/loadout-secure-dev-l1
sources:
  - repo: https://github.com/blairhudson/project-a
    commits:
      - a1b2c3


⸻

Claim Verification

GitHub Actions verify:
	•	commit existence
	•	proof objects
	•	skill identifiers
	•	loadout context if required

⸻

Credential Issuance

Credentials written to:

issued/users/<github>/<credential>.yaml

Example:

definition: skillcraft-gg/loadout-secure-dev-l1
subject:
  github: blairhudson
issued_at: 2026-03-15


⸻

Profiles

Developer pages generated from issued credentials.

Example:

/credentials/users/blairhudson
