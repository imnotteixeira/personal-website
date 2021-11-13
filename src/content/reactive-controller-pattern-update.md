---
title: "Reactive Controller Pattern: The chaos in returning Components from React Hooks"
date: "2021-03-20"
draft: false
path: "/blog/reactive-controller-pattern-update"
---

[[hidden]]
| Solving the problem of infinite re-renders when returning Components from React Hooks
<!-- end_excerpt -->

[[info | INFO]]
| This is based on the previous post [Reactive Controller Pattern: Using custom React Hooks to separate the Business Logic from the View](/blog/reactive-controller-pattern).
| <br><br>
| I highly recommend you to read it before this if you haven't yet, in order to get **_context_**.

As you might recall from the previous post, the `useComponentController` hook had the following API:

```js{numberLines: true}
const {ContextProvider, ...data} = useComponentController(
    SpecificComponentController, 
    params, 
    SpecificComponentControllerContext
);
```

You give it the controller that handles the logic, based on the params, and a React.Context, and it would give you data based on the controller return value, as well as a ready-for-use Context Provider, for the React.Context you pass the hook.

This was great since, in theory, when you used this hook, you just needed to have a tree like this:

```js{numberLines: true}
const MyComponent = () => {
    const {ContextProvider} = useComponentController(
        SpecificComponentController, 
        params, 
        SpecificComponentControllerContext
    );

    return (
        <ContextProvider>
            <your specific ui tree>
        </ContextProvider>
    )
}
```

Simple plug-and-play, right?

No, let's dive into its actual behavior.

## The problematic implementation

Let's recall `useComponentController` implementation:

```js{numberLines: true}
const useComponentController = (controller, params, Context) => {

    const { 
        // The controller can pass options to tweak behavior,
        // such as setting the value of the context
        controllerOptions, 
        ...controllerOutput 
    } = controller(params);

    const ContextProvider = ({ children }) => (
        <Context.Provider value={controllerOptions?.context || {}}>
            {children}
        </Context.Provider>
    );

    ContextProvider.propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node,
        ]),
    };

    return {
        ...controllerOutput,
        ContextProvider,
    };
};
```

As you can see, when calling this hook, it would instantiate a Provider of the given context, and inject it with the required props, so that it would already have the required state, namely the data from the controller, and return it as `ContextProvider`.

Here's the thing: what do you think will happen each time this hook is called? Let's analyze the code: On line 10, it assigns the variable `ContextProvider` a function. Remember that this is done every time the hook is called, so each time a new function is created, with a different reference. It's essentially a different thing every time!

This is a key point, since if every time the hook is called, a different `ContextProvider` is returned (and keep in mind that it will still be different even if the `value` of the provider is the same, since it will have a new reference).

If a different Provider is returned, and due to the [reconciliation phase](https://reactjs.org/docs/reconciliation.html) rules, that whole subtree will be re-rendered. And what happens when the re-render occurs? That's right, `useComponentController` is called again, which triggers another render, which will invoke the hook again, and so on...

#### Reusing the reference

All this would be fine if the Hook didn't return a new function instance every time; no re-render would occur.

Well, React has a built-in hook for memoizing functions: [useCallback()](https://reactjs.org/docs/hooks-reference.html#usecallback). It receives a function and an array of dependencies and only creates a new function instance if the dependencies change.

Although this seems promising, we want it to update when we have a new value for the context (i.e., `controllerOptions.context` changes). However, this will still be problematic because when the value is updated, a new instance of the Provider will be created, it won't just update the `value` and the problem persists.

## The solution: Returning a class instead of an instance

So far, we've noticed that returning a modified provider component won't work because it will change every time. So, we need to follow the alternative which is to return what we will want to render, and with which props, and have the component create the custom Provider instead of creating it in the hook.

```js{numberLines: true}
const useComponentController(controller, params, Context) => {

    const { controllerOptions, ...controllerOutput } = controller(params);

    return {
        ...controllerOutput,
        ContextProvider: Context.Provider,
        contextProviderProps: { 
            value: controllerOptions?.initialValue || {} 
        },
    };
};
```

As you can see, the hook now returns the instance of the Provider (which will depend on the React.Context type provided), as well as the props that Provider should have, which will be its value, containing data that the controller decides to pass.

This involves changing the usage, so that the Components that call the `useComponentController` must render the Provider, with the received props as well, instead of simply `<ContextProvider>`

```js{numberLines: true}
const MyComponent = () => {
    const { 
        ContextProvider, 
        contextProviderProps
    } = useComponentController(
        SpecificComponentController, 
        params, 
        SpecificComponentControllerContext
    );

    return (
        <ContextProvider {...contextProviderProps}>
            <your specific ui tree>
        </ContextProvider>
    )
}
```
By having the hook return the type of the provider, instead of an actual function, it won't change on every call, and a full re-render won't happen. Only the `contextProviderProps` will change, making the UI update accordingly!

This was a clear example of how React can force you to learn about JavaScript theory itself, since this *reference* behavior was the root of it all. I could not solve it without knowing how references and JavaScript object comparison worked. 

And that's it! I hope this was helpful to you, and I'll certainly experiment more with this pattern and improve it in the future.

If you liked it or have suggestions, contact me on twitter ([@ateixeira_dev](https://twitter.com/ateixeira_dev)) or email me at <a href="mailto:imnotteixeira@gmail.com">imnotteixeira@gmail.com</a>

---

*Never stop learning*

See you later,
<br>
Angelo








