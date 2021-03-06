---
title: "Event delegation and web performance"
date: 2018-04-12T10:30:00-04:00
draft: false
categories:
- Code
- JavaScript
- Web Performance
---

After yesterday's article on [adding hover and focus support to our star-based rating system](/showing-star-based-ratings-on-hover-or-focus-with-vanilla-javascript/), Reader Scott Knight emailed me with a question about [event delegation](/checking-event-target-selectors-with-event-bubbling-in-vanilla-javascript/) and web performance (shared with permission).

> I have a bit of a noob question in regards to bubbling and performance. With the `mouseover` event, is this bit of code below getting run continuously with every mouse movement even though it returns unless one of the variables get set? Does this have a performance issue with a `mouseover` type event vs. a `click` event?

Great question, Scott!

If you're trying to listen to an event on a single item, attaching your listener directly to that element is better for performance. Once you start listening on multiple elements, though, event delegation is better.

Every event listener takes up space in browser memory, and the more of them you run, the slower and laggier your site or app can become.

For events that fire constantly (and `mouseover` is actually quite sensible compared to, for example, `scroll` or `resize`), you can [use event debouncing to prevent it from firing too often](/event-listener-performance-with-vanilla-js/).

Event delegation (or bubbling) also keeps code more DRY, allowing you to write a single event listener for as many items as you have on the page. You can even add elements or remove them dynamically after the script has loaded and it still works.

Hope that helps!