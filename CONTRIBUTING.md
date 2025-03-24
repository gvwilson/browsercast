# Contributor's Guide

The most recent version of Browsercast lives in `./v2` 
> Note: the demonstration in `./v2` uses handwritten HTML.
> In practice,
> we expect that most browsercasts will be generated from Markdown by a template engine.

## Feature Details

### Slides
Each slide is separated by `<hr/>` elements after all of the slide's content. This allows 
the slides to be generated properly. Audio snippets in each slide are automatically played
when a user navigates to it for the first time.

The current active slide is the only slide visible from the entire presentation on the
main screen. This means that navigation to the next/previous slides are done by adding and 
removing the `active` class name on each slide container. This is done to avoid any 
scrolling inconsistencies. This approach was inspired by [remark].

All of the logic and styling for this feature can be found in 
`./v2/slides.css` and `./v2/slides.js`. 

**Problems with smooth scrolling:**
- Snap scroll aligned properly to the top of the slide when Browsercast only had the slides, 
however, once the slide navigation bar was added, the slides would scroll too far vertically 
on some devices. The issue was exacerbated when the autoplay button was added. This led us to 
assume the bug was caused by the way the browser was calculating the snap point and causing 
alignment issues that varied across devices and potentially browsers.
- The issue seemed to only happen with keyboard button navigation (up and down arrow) because 
when scrolling using a trackpad/mouse wheel, the scrolling would behave properly. We suspect 
this is because the browser handles both events differently.
- Many attempts were made to fix the issue. Such attempts included:
        - Disabling snapscroll when any manual scrolling was done. This caused a reliance on timeouts to wait for the scroll to finish which is device and browser dependent and therefore, unreliable.
        - Manually calculating the top of the slide's offset and inserting it into scrollIntoView() or scrollTo() functions. This did not change the snap point at all.
        - Adding a scroll-top-margin to the css file. This only fixed the issue when scrolling down but not up.
        - Keeping snap scroll but overriding only the keyboard events for the up and down arrow. Since previous attempts to do manual calculations didn't work, this also didn't fix the issue.

As a result, we have opted for the slides to snap into view to eliminate the dependencies on the calculation of the snap point.


### Audio Playback Bar

To add an audio element to a slide, a custom Shadow DOM element "audio-controls" is used 
in place of the regular audio element. The audio playback bar icons and inspiration was 
taken from the following [project] by Before Semicolon.

The structure of the audio playback bar in each slide should follow this format to ensure 
proper handling (where "xxx.mp3" should be the actual audio file):

```
<div class="controls-container">
    <audio-controls src="xxx.mp3"></audio-controls>
</div>
```

All of the logic and styling for this feature can be found in 
`./v2/audio.css` and `./v2/audio.js`. 

Things to improve/fix:
- Currently, the audio playback bar may cover any content on the bottom of the slide. 
One way to fix this would be to make the playback bar collapsible as shown by the 
preliminary sketches in `./design/feature1-and-2-d.png`.
- Captions are currently non-functional. The idea was to either make it a toggle button 
that only supports one language or open to a menu that can support multiple languages. 
Manually written or AI-generated scripts from a slide's audio can be used to generate 
captions.

### Slide Navigation Bar

On the left of the screen the slide navigation bar shows all the thumbnails of the slides 
in the current presentation and allows for quicker navigation. 

The thumbnail generation was inspired and taken from [remark].

When generating the HTML version for any presentation, the following code snippet is 
needed as the first element in the body to ensure proper handling:

```
<div class="preview-all" id="slide-navigation-container">
    <div class="preview-slider"></div>
    <div class="toggle-btn open" id="toggle"> <span></span> </div>
</div>
```

All of the logic and styling for this feature can be found in 
`./v2/preview.css` and `./v2/preview.js`. 

Things to improve/fix:
- Currently, the css styling for the slide numbers to the left of the page may not work 
well with slides in the triple digits or more. Proper handling of this case should be 
done to avoid this.
- When the user is navigating through the slides, the slide navigation bar will highlight 
and move the current active slide to the top of the bar. Instead, we can move the 
thumbnail into view only if the thumbnail is outside the view of the current visible 
portion of the navigation bar.


### Autoplay

On the top right of the screen, there is an autoplay toggle button which allows user to 
enter a "viewing mode" and watch the presentation without the other elements obstructing 
the view. 

When generating the HTML version for any presentation, the following code snippet is 
needed as the first element in the body to ensure proper handling:

```
<div id="autoplay-container">
    <label class="autoplay-btn">
        <div class="autoplay-btn-wrapper">
            <input type="checkbox" id="btn-toggle" name="btn-toggle" />
            <span class="autoplay-text"> Autoplay </span>
            <span class="slider"></span>
        </div>
    </label>
</div>
```

All of the logic and styling for this feature can be found in 
`./v2/autoplay.css` and `./v2/autoplay.js`. 

The autoplay feature is accompanied by a UI hiding mechanic similar to Youtube's 
videoplayer. The slide navigation bar and audio playback bar fade out of view when 
autoplay is first turned on and can be brought back into view by any mouse hovering 
movement. After a few seconds, it will fade back out unless the user pauses the audio. 
Then, the elements will remain in view until the audio is played again. 

Manual movement is not restricted while autoplay is on, even when the elements are faded 
out. The user can navigate to previous or later slides through the arrow keys, scrolling 
or the slide navigation bar. 

If a slide has audio, it will move to the next slide only after the audio ends. Similarly, 
the user can still manually interact with the audio playback bar and jump through the 
audio if needed.

Things to improve/fix:
- When you first toggle autoplay on, the first slide will remain in view for 6 seconds, 
then any subsequent slide with no audio will take 3 seconds before moving on. Instead of 
a short, fixed interval in the code, the ability to customize or set a longer interval may 
be more useful and practical.
- When the user comes back to the slide during autoplay, the audio will always play from 
the beginning. Instead, the audio could "remember" the point it was at before the user 
changed slides and replay from there. 
- When autoplay is off, the audio "remembers" if it has already been played and will not 
automatically play if encountered again. However, when autoplay is turned on and then 
turned off, when you encounter that same audio element again, it will reset as if it has 
never been played before (then it will "remember" again). This behavior may or may not be 
desirable and should be noted.

[remark]: https://github.com/gnab/remark
[project]: https://github.com/beforesemicolon/BFS-Projects/tree/audio-player-tag


## Useful Resources

[This post][snap-scroll] by [Yihui Xie][xie]
explains how the slideshow part adds an observer to each slide to snap-scroll the slide 
into view. We have since changed the way slides behave now due to inconsistencies, but it 
may be useful to observe the problems that arise with snap-scroll to motivate design 
decisions. For instance, any manual scrolling using scrollTo() or scrollIntoView() cannot 
be used for the same reason.

[This example] uses [remark], an HTML slideshow framework, which inspired the thumbnails and slide navigation behaviour. 

The audio playback bar makes use of [shadow DOMs] to provide encapsulation from external CSS styling. The following [shadowroot documentation] may be helpful for understanding how to interact with the playback bar.


## How to Contribute

Issues and pull requests in [our GitHub repository][repo]
are very welcome,
particularly ones that address the user experience issues described above.

[Shadow DOMs]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
[shadowroot documentation]: https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot
[This example]: https://remarkjs.com/
[repo]: https://github.com/gvwilson/browsercast
[snap-scroll]: https://yihui.org/en/2023/09/snap-slides/
[xie]: https://yihui.org/
