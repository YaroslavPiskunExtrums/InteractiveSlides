import { jest } from '@jest/globals'

jest.useFakeTimers()

describe('Utils', () => {
  describe('Simple', () => {
    test('One', async () => {
      expect(1).toEqual(1)
    })
  })
})
