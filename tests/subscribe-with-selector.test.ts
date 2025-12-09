import { vi, it, expect } from 'vitest'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from '../src/index.js'

interface Book {
  title: string
  author: {
    firstName: string
    lastName: string
  }
}

it('calls the subscription when the subscribed slice changes', () => {
  const store = createStore<Book>(() => ({
    title: 'Default',
    author: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

  const subscription = vi.fn()
  subscribeWithSelector(store, (book) => book.title, subscription)

  expect(subscription).not.toHaveBeenCalled()

  store.setState(() => ({ title: 'First' }))
  expect(subscription).toHaveBeenCalledWith(
    'First',
    {
      title: 'First',
      author: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
    {
      title: 'Default',
      author: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  )
  expect(subscription).toHaveBeenCalledOnce()

  store.setState(() => ({ title: 'Second' }))
  expect(subscription).toHaveBeenCalledWith(
    'Second',
    {
      title: 'Second',
      author: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
    {
      title: 'First',
      author: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  )
  expect(subscription).toHaveBeenCalledTimes(2)
})

it('supports subscribing to nested slices', () => {
  const store = createStore<Book>(() => ({
    title: 'Default',
    author: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

  const subscription = vi.fn()
  subscribeWithSelector(store, (book) => book.author.firstName, subscription)

  expect(subscription).not.toHaveBeenCalled()

  store.setState(() => ({ author: { firstName: 'Jane', lastName: 'Doe' } }))
  expect(subscription).toHaveBeenCalledWith(
    'Jane',
    {
      title: 'Default',
      author: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    },
    {
      title: 'Default',
      author: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  )
  expect(subscription).toHaveBeenCalledTimes(1)
})

it('ignores updates to unrelated slices', () => {
  const store = createStore<Book>(() => ({
    title: 'Default',
    author: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

  const subscription = vi.fn()
  subscribeWithSelector(store, (book) => book.title, subscription)

  expect(subscription).not.toHaveBeenCalled()

  store.setState(() => ({ author: { firstName: 'Jane', lastName: 'Doe' } }))
  expect(subscription).not.toHaveBeenCalled()
})

it('returns the unsubscribe function', () => {
  const store = createStore<Book>(() => ({
    title: 'Default',
    author: {
      firstName: 'John',
      lastName: 'Doe',
    },
  }))

  const subscription = vi.fn()
  const unsubscribe = subscribeWithSelector(
    store,
    (book) => book.title,
    subscription,
  )
  const target = { unsubscribe }
  vi.spyOn(target, 'unsubscribe')

  expect(subscription).not.toHaveBeenCalled()
  expect(target.unsubscribe).not.toHaveBeenCalled()

  store.setState(() => ({ title: 'First' }))
  expect(subscription).toHaveBeenCalledWith(
    'First',
    {
      title: 'First',
      author: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
    {
      title: 'Default',
      author: {
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  )
  expect(subscription).toHaveBeenCalledOnce()

  target.unsubscribe()

  store.setState(() => ({ title: 'Second' }))
  store.setState(() => ({ title: 'Third' }))
  expect(subscription).toHaveBeenCalledOnce()
})
