# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
1. First obvious step - separate reusable code to separate function (so we create `getHash` function)
2. Separate hash algorithm and digest encoding to constants, not critical here, it's better to avoid using literals in code
3. Then we simplify logic of the function itself. rewrite it in more functional style, removing mutability. It depends on projects conventions what style to use.
4. I thought about splitting it even further (more functions), but I'm not sure whether it will improve readability or make it worse.
5. Sequential nature of this function pushed me to think about implementing it as Promises (kinda JS monads), but again, to make one function looks perfect, I should create even more code, which, in general will make readability harder, especialy for junior developers
