---
title: "Creating an efficient spreadsheet application for the browser with React"
startDate: "2021-11-08"
date: "2021-11-08"
draft: true
path: "/blog/react-spreadsheet"
todo: ["dependency management", "cell function grammar definition - update code, still incomplete grammar", "https://nearley.js.org/docs/how-to-grammar-good"]
---


It's 2021, and if you work in front of a computer, in some form or another, you probably have seen a spreadsheet with data and formulas *and a giant grid*. In general, giant things and browsers do not go well together, but we can at least try. It might be worth a good blog post...
<!-- end_excerpt -->

## Requirements

As with any spreadsheet, we want a grid that can take values. For starters, we can assume the values will only be strings or numbers (which can be in floating point format). These values may be directly inserted --- i.e., inserted directly by the user --- or computed by the application, via the calculation based on a specified formula which can depend on multiple other values.

### Scoping

This can get out of hand pretty quick, so I'll start putting some early limits. The built-in function set will be small, as this is intended to be a proof-of-concept, and not a fully fledged application.

Let's start with the following:

* **REF**: Copies the value from the referenced cell
* **SUM**: Sums the values from **n** cells 
* **SUBTRACT**: Subtracts the values from **n** cells
* **MULTIPLY**: Multiplies the values from **n** cells
* **DIVIDE**: Divides the value of a referenced cell over the value of another referenced cell
* **EQUALS**: Compares 2 referenced cells' values, and returns true if they are the same value 
* **AND**: Boolean AND between **n** referenced cells' values
* **OR**: Boolean OR between **n** referenced cells' values
* **NOT**: Boolean NOT of a referenced cell's value (or Boolean function expression)
* **AVG**: Returns the average value among a set of referenced cells' values (this is here especially to require the implementation of a function that depends necessarily on an array of values)

* Cells can represent a function that is composed of multiple other functions. 
* Functions must specify the allowed inputs, so that there is the possibility of input validation

### Technology

The goal for this project is to have a client-side spreadsheet, so it must at least compile to HTML/Javascript in the end. I'm choosing React with Typescript because that's what I'm most comfortable with right now, and I don't want to learn yet another JS framework...

## The challenge

Making a spreadsheet as a normal desktop application is already hard-work. Sure, it's easy to make something that will work on a 10x10 grid, heck, even 100x100 is not the hardest problem to solve. If you want it to *scale*, that's the real challenge, especially on the browser.

For this, we can divide the main challenge into smaller challenges, such as:

* How to efficiently update cells when a dependency updates?
* How to express and parse Function expressions?
* How to render the spreadsheet smoothly, especially when there are **way too many cells**?
* How to reference cells? How should be dependencies among cells be stored?
* How to update dependent cells' values on dependency update?

From here on out, I'm dedicating a section to each challenge, in order to fully explore each problem, please proceed with the scrolling...

## Part 1: Dependency Management

In this section, we will explore the ways through which we can make cells update based on their dependencies, corresponding to the given cell function expression.

The way I see it, there are 2 main ideas:

* **Idea 1**: _Dependents_ register themselves in some sort of registry, and when _dependencies_ update, they query the registry and notify all their _dependents_ so that they update their values;
* **Idea 2**: _Dependents_ are not notified when a _dependency_ changes. Instead, they poll for changes in the _dependencies_. For this, each cell must have its dependency tree pre-computed, so that we only query the relevant values;

We must not forget the main challenge: We must support spreadsheets as big as possible, and to do that on the browser, we need to be clever... It might not be a good idea updating every cell when some dependency updates, especially if the change won't be **visible**.

In contrast, every cell polling for changes might not be the most efficient computation work either. If the polling interval is big (updates are checked for less frequently), the spreadsheet won't seem responsive and fluid; If, on the contrary, the polling interval is low (updates are checked for frequently), the spreadsheet will update fluidly, but most of the polling will result in no updates, while straining our precious browser resources.

In theory, we could (and should) only poll for the cells that are visible on the screen, and for which the updates will actually be impactful, but in any case, I don't feel like polling is the way to go, since the usual spreadsheet 1) does not mutate all (or most of the) cells many times over a short time period and 2) it would mean unnecessary calls were being made most of the time.

Let's stick with **Idea 1** for now. How do dependents get notified, and which cells should we notify?

### Notifying Updates
(something with observer pattern or similar)

### Optimizing notifications
(We should only notify cells which will cause visual impact. need to compute the tree of dependencies, because even if one cell is not visible, it might need to be computed if a visible cell depends on it)

## Part 2: Defining Functions

Now that we know what to do when a dependency updates, we need to know how to get the dependencies of each cell, and how to compute the resulting value.

We can start by defining every cell value to be _empty_ or the result of a **CellFunction**. A CellFunction can be a direct --- _or immediate_ --- value (e.g., 1, 2, 10, "a", "hello", true, false) or a combination of **CellFunctions**, which in turn can be an immediate value, or a combination of further **CellFunctions**. 

The most important aspect of a CellFunction, is that it can represent the value of another cell. When this is the case, we know that it will be a dependency of the cell defining the CellFunction.

Example of a CellFunction:

```js
// Returns `true` if the cell A1 has a value of -1, and `false` otherwise

EQUALS(
    // CellFunction SUM with two CellFunction arguments. 
    // First one is immediate type, 
    // Second one is a reference to other cell
    SUM(1, REF(A1)), 
    0
)
```

### Executing CellFunctions - How to compute the cell's value?

A CellFunction, as you probably agree, needs to result in a tangible value (or some error value, in case of errors 👀). For that to happen, we need to 1) know how to parse the CellFunction, and 2) how to compute the result.

#### How to parse CellFunctions?

For parsing expressions we'll need to define our grammar. This is gonna be interesting... One of the most used npm packages for this seems to be [nearley](https://nearley.js.org/), with around 10x the downloads of similar packages such as [ohm](https://github.com/harc/ohm), [pegjs](https://github.com/pegjs/pegjs), or [jison](https://github.com/zaach/jison). Since I don't know much about this area, I'm following the [trends](https://www.npmtrends.com/nearley-vs-ohm-js-vs-parsimmon-vs-peg-parser-vs-pegjs-vs-jison) and there seems to exist good documentation related with nearley, so that's nice.

> I actually looked at the trends, you can do so for any npm package(s) here: https://www.npmtrends.com/

Keep in mind that I know nothing(*) about defining grammars, but still, that's nothing a good documentation deep-dive and some trial and error can't fix. This to say that it probably won't be the best grammar definition you'll ever see, especially if you know your grammars. But still, I'll be happy if it can parse our functions!

... or so I thought. Turns out grammars are not that simple, so I had to pivot. Thankfully, I found [Parsimmon](https://github.com/jneen/parsimmon), which let me code the grammar in a more beginner-friendly way, completely in JavaScript (with TypeScript compatibility!). That's what I've used. You can learn more in the dedicated blog post about it: 
## TODO: LINK GRAMMAR BLOG POST HERE

_(*) almost nothing_ 
