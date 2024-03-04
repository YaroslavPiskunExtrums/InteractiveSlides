/**
 * This error is designed to hold safe, user-friendly messages
 * don't put autogenerated messages inside
 * */
export class FriendlyError extends Error {
  constructor(message: string) {
    super(message)
  }

  toString() {
    return this.message
  }

  toSystemString() {
    // TODO: Stringify to regular format
  }
}