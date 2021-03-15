---
title: "Reactive Controller Pattern: Using custom React Hooks to separate the Business Logic from the View"
date: "2021-03-15"
draft: true
path: "/blog/reactive-controller-pattern"
---

Ever had to design a web application for mobile and desktop in React? What happened once you realized that the layouts should be different enough rendering the usual [CSS media-queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries) insufficient or too hard to work with?
<!-- end_excerpt -->
I, too, have recently found myself in a similar situation. I decided I would tackle this problem by creating two different components (and respective sub-trees) for mobile and desktop designs.

```jsx
const DesktopVersion = () => (
    <BigComponent>
        <Button />
        <Button />
        <Button />
    </BigComponent>
);

const MobileVersion = () => (
    <SmallComponent>
        <HamburgerMenu>
            <Option />
            <Option />
            <Option />
        </HamburgerMenu>
    </SmallComponent>
);
```

Obviously, there needs to be a way to select which one to render, based on the device width. Since I was using [MaterialUI](https://material-ui.com/), I used its `useMediaQuery` hook for this purpose, but I'm certain you can find other implementation around the web as well. I wrapped it in a custom `useMobile` hook, that returns true if the width is mobile-sized.

```jsx
const useMobile = () => 
    useMediaQuery((theme) => theme.breakpoints.only("xs"));

const MyPage = () => (
    <>
        { useMobile() ? <MobileVersion/> : <DesktopVersion/> }
    </>
);
```

This was the first step. From here, the app was not only responsive. It was *reactive*. It reacted to the device width changes and rendered the appropriate sub-tree.

TODO duplicated logic example
pattern img and explanation

---

Currently, I am working on a React design pattern that helps build multiple client interfaces (Desktop and Mobile) where the layout is completely different and CSS media-queries are not enough. You can expect a post on this soon!

*Never stop learning*

See you later,
<br>
Angelo








