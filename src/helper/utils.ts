/**
 * Executes asynchronous functions in parallel for each item in an array.
 *
 * @param {T[]} arr - An array of items to process.
 * @param {(item: T) => Promise<R>} fn - An asynchronous function to be executed for each item.
 * @returns {Promise<R[]>} A promise that resolves to an array of results from each function.
 * @throws {Error} If any of the asynchronous functions throw an error.
 *
 * @template T - The type of items in the input array.
 * @template R - The type of the result returned by the asynchronous function.
 */

export const doInParallel = async <T, R>(
  arr: T[],
  fn: (item: T) => Promise<R>
): Promise<R[]> =>
  Promise.all(
    arr.map(
      (item) =>
        new Promise<R>(async (resolve, reject) => {
          try {
            resolve(await fn(item));
          } catch (e) {
            reject(e);
          }
        })
    )
  );
