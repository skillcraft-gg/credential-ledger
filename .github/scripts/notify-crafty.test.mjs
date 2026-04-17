import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { signPayload } from './notify-crafty.mjs'

describe('notify-crafty signing', () => {
  test('creates a deterministic sha256 hmac signature', () => {
    const signature = signPayload('top-secret', '{"hello":"world"}')
    assert.equal(signature, 'b0c5e0dfac98355531e006bb94cc20b4e035f40b56175e6c21818e796ee9c2fc')
  })
})
