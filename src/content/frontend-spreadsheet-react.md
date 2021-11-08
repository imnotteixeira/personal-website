---
title: "Creating an efficient spreadsheet application in React"
date: "2021-11-08"
draft: true
path: "/blog/react-spreadsheet"
---

It's 2021, and if you work in front of a computer, in some form or another, you probably have seen a spreadsheet with data and formulas *and a giant grid*. In general, giant things and browsers do not go well together, but we can at least try. It might be worth a good blog post...
<!-- end_excerpt -->

## Requirements

As with any spreadsheet, we want a grid that can take values. For starters, we can assume the values will only be strings or numbers (which can be in floating point format). These values may be directly inserted --- i.e., inserted directly by the user --- or computed by the application, via the calculation based on a specified formula which can depend on multiple other values.

### Scoping

This can get out of hand pretty quick, so I'll start putting some early limits. The built-in function set will be small, as this is intended to be a proof-of-concept, and not a fully fledged application.

Let's start with the following:

* **EQUALS**: Copies the value from the referenced cell
* **SUM**: Sums the values from **n** cells 
* **SUBTRACT**: Subtracts the values from **n** cells
* **MULTIPLY**: Multiplies the values from **n** cells
* **DIVIDE**: Divides the value of a referenced cell over the value of another referenced cell
* **AND**: Boolean AND between **n** referenced cells' values
* **OR**: Boolean OR between **n** referenced cells' values
* **NOT**: Boolean NOT of a referenced cell's value (or Boolean function expression)
* **AVG**: Returns the average value among a set of referenced cells' values (this is especially to implement a function that depends necessarily on an array of values)

* Cells can represent a function that is composed of multiple other functions. 
* Functions must specify the allowed inputs, so that there is the possibility of input validation

### Technology

The goal for this project is to have a client-side spreadsheet, so it must at least compile to HTML/Javascript in the end. I'm choosing React with Typescript because that's what I'm most comfortable with right now, and I don't want to learn yet another JS framework...

## The challenge

Well, making a spreadsheet as a normal desktop application is already hard-work. Sure, it's easy to make something that will work on a 10x10 grid, heck, even 100x100 is not the hardest problem to solve. If you want it to *scale*, that's the real challenge, especially on the browser.

For this, we can divide the main challenge into smaller challenges, such as:

* How to efficiently update cells when a dependency updates?
* How to render the spreadsheet smoothly, especially when there are **way too many rows**?
* How to reference cells? How should be dependencies among cells be stored?
* How to update dependent cells' values on dependency update?
* How to express and parse Function expressions?