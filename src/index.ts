import type { StoreApi } from 'zustand/vanilla'

/**
 * Subscribe to a slice of the store.
 *
 * @param store A Zustand store to subscribe to.
 * @param selector A slice to subscribe to.
 * @param subscription A function to call upon change.
 * @returns The unsubscribe function.
 *
 * @example
 * const unsubscribe = subscribeWithSelector(
 *   bookStore,
 *   (book) => book.title,
 *   (nextTitle) => handle(nextTitle),
 * )
 */
export function subscribeWithSelector<State, Slice>(
  store: StoreApi<State>,
  selector: (state: State) => Slice,
  subscription: (
    slice: Slice,
    nextState: State,
    prevState: State,
  ) => void | Promise<void>,
): () => void {
  return store.subscribe((nextState, prevState) => {
    const prevSlice = selector(prevState)
    const nextSlice = selector(nextState)

    if (!Object.is(prevSlice, nextSlice)) {
      subscription(nextSlice, nextState, prevState)
    }
  })
}
