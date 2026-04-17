#!/usr/bin/env node
import crypto from 'node:crypto'
import fs from 'node:fs/promises'

const WEBHOOK_URL = process.env.CRAFTY_WEBHOOK_URL
const WEBHOOK_SECRET = process.env.CRAFTY_WEBHOOK_SECRET
const DELIVERY_ID = process.env.CRAFTY_WEBHOOK_DELIVERY_ID || `credential-ledger-${Date.now()}`

if (process.argv[1] && process.argv[1] === new URL(import.meta.url).pathname) {
  const payloadPath = process.argv[2]
  if (!payloadPath) {
    throw new Error('Usage: node .github/scripts/notify-crafty.mjs <payload.json>')
  }

  await notifyCraftyFromFile(payloadPath)
}

export async function notifyCraftyFromFile(payloadPath) {
  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    process.stdout.write('Crafty webhook is not configured. Skipping notification.\n')
    return { skipped: true }
  }

  const rawPayload = await fs.readFile(payloadPath, 'utf8')
  const payload = JSON.parse(rawPayload)
  validatePayload(payload)

  const signature = signPayload(WEBHOOK_SECRET, rawPayload)
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-skillcraft-delivery-id': DELIVERY_ID,
      'x-skillcraft-signature-256': `sha256=${signature}`,
    },
    body: rawPayload,
  })

  if (!response.ok) {
    throw new Error(`Crafty webhook failed with ${response.status}: ${await response.text()}`)
  }

  process.stdout.write(`Crafty webhook delivered with status ${response.status}.\n`)
  return { skipped: false, status: response.status }
}

export function signPayload(secret, rawPayload) {
  return crypto.createHmac('sha256', secret).update(rawPayload).digest('hex')
}

function validatePayload(payload) {
  const required = ['github_login', 'credential_id', 'credential_name', 'claim_id', 'issued_at', 'source_commits']
  for (const key of required) {
    if (payload?.[key] === undefined || payload?.[key] === null || payload?.[key] === '') {
      throw new Error(`Crafty payload is missing ${key}`)
    }
  }

  if (!Array.isArray(payload.source_commits)) {
    throw new Error('Crafty payload source_commits must be an array')
  }
}
