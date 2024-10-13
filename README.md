# Browsercast

Shakespeare wrote sonnets;
we write PowerPoint
A lot of people blame PowerPoint for bad presentations,
but that's like blaming fountain pens for bad poetry.
The real problem with tools like PowerPoint is that they aren't web-friendly.
When you export a slideshow to present on the web,
what you actually get is a bunch of images.
There's no text,
just pixels arranged in the shapes of letters;
no hyperlinks;
and nothing search engines or disability aids can read.
What's worse,
if you want something people can replay,
you have to make a screencast.
These are just as opaque to search engines and disability aids,
and probably several times larger than the original slides.

[Browsercast][site] is our solution to this problem.
It plays snippets of audio in your browser as you move through your slides.
"View Source", links, CSS, screen readers, and search work as they should
because it's all still web-native HTML.
What's more,
since it's just text and audio,
it's a fraction of the size of a video,
which makes it ideal for mobile devices.

This prototype uses 5kb of JavaScript and 1.5kb of CSS,
and is available under [an open source license](./LICENSE.md).
If you'd like to help make it better,
please see [the contributors' guide](./CONTRIBUTING.md)
and the [Code of Conduct](./CONDUCT.md).

## Next Steps

1.  The first challenge is to find a better way to manage replay.
    If the `audio` element on the first slide doesn't display controls,
    browsers refuse to play any of the sound clips
    because the user hasn't interacted with the page.
    (Try removing `control=true` from the first `audio` element
    and then check the error messages in browser's console log to confirm this.)
    This behavior prevents pop-up audio ads,
    but in this case it makes for a poor user experience.

2.  Second, we need a better way to manage the audio clips themselves.
    It's easiest for a person to record their presentation as a single audio file,
    but the `audio` elements in the slides would then need start and end time markers,
    which are annoying to find and copy into the browsercast file.
    On the other hand,
    splitting one file into a couple of dozens short clips
    or recording the presentation in a couple of dozen bursts
    is equally annoying.

3.  This prototype replays narration every time a slide comes into view,
    which means the audience hears a clip repeated
    when the presenter backs up to a previous slide.
    The JavaScript could keep track of which clips have already played
    and not replay them unless asked to,
    but should that be controlled by hot keys?
    Or should the audio control on the first slide be repeated on subsequent slides?
    Or should we approach this problem in some other way entirely?

4.  The [snap-scroll technique][snap-scroll] for presenting slides
    does not behave gracefully when a slide is too tall to fit on the screen.
    We would like to clip slides to fit the viewport
    and to report clipped slides to authors as they are developing slideshows,
    but need ways to implement and present this.

5.  Finally [sic],
    we need to think about captioning and internationalization.
    Transcripts in different languages can easily be added to slides in hidden elements;
    how should the accompanying audio clips be added,
    and how should users indicate which set of clips they want to hear?

## Acknowledgments

*Our thanks to David Seifried,
Jeremy Banks,
David Wolever,
Gabriel Ivanica,
and Rémi Emonet for their work on Version 1,
and to Yihui Xie for inventing the [snap-scroll technique][snap-scroll].*

[site]: https://gvwilson.github.io/browsercast/
[snap-scroll]: https://yihui.org/en/2023/09/snap-slides/
