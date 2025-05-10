# Adapting Sanity Visual Editing for your framework

**Our main gripe with Sanity Visual Editing**

We will make this very clear: The Sanity team remains the best we've experienced. We've had bug reports solved in a handful of hours. That type of extreme responsiveness and killer product keep us staunch supporters of their work, we have no intetion of changing platforms, even with the issues we sometimes face. But it feels like a disservice to them to keep quiet as implementing, one of their more impressive features is incredibly difficult outside of mainstream use.

Sanity Visual Editing is an awesome feature that we were psyched to see be released but the main implementation was in React. We don't use React for a number of reasons so we waited for the other implementations, all good, thats what you sign up for when you use Nuxt primarily. When Nuxt 3's version came out, we tried again and again to wrap our head around it and implement. Docs led us in circles with almost no examples online, deprecated packages, hours and hours spent in vain as we still couldn't get it functional anywhere except NextJS. So, we dug into the actual codebases of how these implementations worked. Abstraction upon abstraction made it a wild goose chase. 

But why bother? Just use NextJS and all is good! No. We do very boutique work that inolves writing functionality from scratch to make it as performant as possible (WebGL, Threejs and animation often demand this). The lightest, simplest implementations of everything is what we value. Framework ease-of-use libraries can often detract from this. Occams Razor.

So we've written this guide on adapting Sanity Visual Editing to a framework in hopes that these implementations can be revisited, particularly for Nuxt and Solid (which doesn't exist at the time of writing, but will once you've read this article) and made into composable sets of utilities that are thoroughly explained, not abstraction-ridden libraries that require a lot of "well hope this works...". 

## Taking Svelte's example.
Svelte was the newest implementation of Visual Editing. We copied this as our base since it had all the pieces you would need to implement this in _not_ react.

## Understanding the billion moving pieces
Visual editing is a shit load of different things that work together, they boil down to these: 

1. @sanity/core-loader that creates content sourcemaps and behind the scenes stuff
2. Pair of server routes to communicate with the studio
3. Store to keep track of enabled/disabled
4. Preview-specific Token

## Building the thing

### `@sanity/core-loader`

Repo: https://www.npmjs.com/package/@sanity/core-loader
Purpose: 
