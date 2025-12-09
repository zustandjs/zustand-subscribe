# `zustand-subscribe`

Utilities for subscribing to a Zustand store.

## Usage

```sh
npm i zustand-subscribe
```

```ts
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand-subscribe'

interface Book {
  title: string
}

const bookStore = createStore<Book>(() => ({
  title: 'Default title'
}))

const unsubscribe = subscribeWithSelector(
  bookStore,
  (book) => book.title,
  (nextTitle, nextBook, prevBook) => {
    console.log('Book title changed!', nextTitle)
  },
)
```

Once subscribed to a slice, any changes to that slice will trigger the subscription function:

```ts
bookStore.setState(() => ({ title: 'Next title'}))

// "Book title changed! Next title"
```
