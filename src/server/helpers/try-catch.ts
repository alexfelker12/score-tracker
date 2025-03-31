//* from: https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b?permalink_comment_id=5456333#gistcomment-5456333
// type Success<T> = {
//   data: T;
//   error: null;
// };

// type Failure<E> = {
//   data: null;
//   error: E;
// };

// type Result<T, E = Error> = Success<T> | Failure<E>;

// // Function overload signatures
// export const tryCatch = <T, E = Error>(
//   arg: Promise<T> | (() => T),
// ): Result<T, E> | Promise<Result<T, E>> => {
//   if (typeof arg === "function") {
//     try {
//       const data = (arg as () => T)();
//       return { data, error: null };
//     } catch (error) {
//       return { data: null, error: error as E };
//     }
//   }

//   return (arg as Promise<T>)
//     .then((data) => ({ data, error: null }))
//     .catch((error) => ({ data: null, error: error as E }));
// };


//* from: https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b?permalink_comment_id=5458062#gistcomment-5458062
type Success<T> = {
  data: T;
  error?: never;
};

type Failure<E> = {
  data?: never;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

type MaybePromise<T> = T | Promise<T>;

export function tryCatch<T, E = Error>(
  arg: Promise<T> | (() => MaybePromise<T>)
): Result<T, E> | Promise<Result<T, E>> {
  if (typeof arg === 'function') {
    try {
      const result = arg();

      return result instanceof Promise ? tryCatch(result) : { data: result };
    } catch (error) {
      return { error: error as E };
    }
  }

  return arg
    .then((data) => ({ data }))
    .catch((error) => ({ error: error as E }));
}
