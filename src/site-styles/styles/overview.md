# [Fairfax Presentation Styles Library](#markdown-header-fairfax-presentation-styles-library)

The **Presentation Styles Library** is a **collection of styles consistent with the Fairfax Blue project's redesign of our online mastheads**. It is intended for use in the production of features, interactives and more by the company's Presentation Development team.

The library consists primarily of [SCSS mix-ins](https://scotch.io/tutorials/how-to-use-sass-mixins) for buttons, inputs, layouts and other elements or combinations of elements commonly used across projects. These mix-ins can be invoked to quickly apply styles to CSS class, id or element tags specified in a project's stylesheets, but if left uninvoked, **won't add unnecessary bloat to a project's CSS**.

## Contents

* [Overview](#markdown-header-fairfax-presentation-styles-library)
    * [How might a developer use this library?](#markdown-header-how-might-a-developer-use-this-library)
    * [Why design the library this way?](#markdown-header-why-design-the-library-this-way)
* [Installation](#markdown-header-installation)
* [Using the library](#markdown-header-using-the-library)
* [Contributing](#markdown-header-contributing)
    * [Keeping the development, distribution and example repos in sync](#markdown-header-keeping-the-development-distribution-and-example-repos-in-sync)
    * [Pushing changes to the repo](#markdown-header-pushing-changes-to-the-repo)
    * [Other tips for making contributions](#markdown-header-other-tips-for-making-contributions)
* [Base](#markdown-header-base)
* [Layouts](#markdown-header-layouts)
    * [Embedded interactive](#markdown-header-embedded-interactive)
    * [Feature article header](#markdown-header-feature-article-header)
* [Modules](#markdown-header-modules)
    * [Button](#markdown-header-button)
        * [Standard button](#markdown-header-standard-button)
        * [Custom button](#markdown-header-custom-button)
        * [Destructive button](#markdown-header-destructive-button)
    * [Loader](#markdown-header-loader)
    * [Sports team icon](#markdown-header-sports-team-icon)
    * [Social button](#markdown-header-social-button)
    * [Text input](#markdown-header-text-input)
        * [Standard text input](#markdown-header-standard-text-input)
        * [Custom text input](#markdown-header-custom-text-input)
    * [Search input](#markdown-header-search-input)
        * [Standard text input](#markdown-header-standard-search-input)
        * [Custom text input](#markdown-header-custom-search-input)
    * [Text input autocomplete](#markdown-header-text-input-autocomplete)
    * [Drop-cap](#markdown-header-drop-cap)
    * [Dropdown](#markdown-header-dropdown)
        * [Standard dropdown](#markdown-header-standard-dropdown)
        * [Custom dropdown](#markdown-header-custom-dropdown)
    * [Scrollbar](#markdown-header-scrollbar)
        * [Standard dropdown](#markdown-header-standard-scrollbar)
        * [Custom dropdown](#markdown-header-custom-scrollbar)
    * [Fancy radio](#markdown-header-fancy-radio)
        * [Standard fancy radio](#markdown-header-standard-fancy-radio)
        * [Custom fancy radio](#markdown-header-custom-fancy-radio)

## [How might a developer use this library?](#markdown-header-how-might-a-developer-use-this-library) [^](#markdown-header-fairfax-presentation-styles-library)

A developer creating a simple interactive might want to use Fairfax Media's standard button styles, but none of the other styles this library includes. To do so, they could use this library's [Button](#markdown-header-button) module style as follows. 

First, such a person would create an SCSS stylesheet like this:

```
// Example assumes styles library is located like so:
//
//  this-directory
//     > this-style-sheet.scss
//  libs
//     > ffx-prez-styles
//        > ffx-prez-styles.scss
//        > ... etc.
//
@import "../libs/ffx-prez-styles/ffx-prez-styles";

.myButtonClass {
  @includes button();
}

```

Compiling the SCSS file above would result in a CSS stylesheet including the desired button style, **but not including any of the other styles provided by this library**. This style could then be applied in HTML like this:

```
  <button class="myButtonClass">Some button</button>
```

For a more thorough guide to using this library, see the **'[Using the library](#markdown-header-using-the-library)'** section below.

## [Why design the library this way?](#markdown-header-why-design-the-library-this-way) [^](#markdown-header-fairfax-presentation-styles-library)

**With its 'opt-in' character, this is intended to be a kind of 'floating library'**, empowering developers to build things quickly without burdening those things unnecessarily.

By giving the developer the power to apply an array of company styles at will, we relieve them of the need to reinvent the wheel with every project. 

By making the developer invoke those styles explicitly, we relieve them of the annoyance of competing with library styles applied without their knowledge and contrary to their intentions.

-----

# [Installation](#markdown-header-installing-the-library) [^](#markdown-header-fairfax-presentation-styles-library)

For instructions on how to install the Presentations Styles Library, see the [readme for the library's distribution repository](https://bitbucket.org/fairfax-prez/ffx-prez-styles-distribution).

-----

# [Using the library](#markdown-header-using-the-library) [^](#markdown-header-fairfax-presentation-styles-library)

More documentation is coming, but for now, the best way to get started with the library is to work through the [readme for the library's distribution repository](https://bitbucket.org/fairfax-prez/ffx-prez-styles-distribution). It provides instructions on how to install and, breifly, how to integrate and use the library in your projects.

Users can also tinker with the [example repository](https://bitbucket.org/fairfax-prez/ffx-prez-styles-example), which provides a ready and working example of a project using the library.

-----

# [Contributing](#markdown-header-contributing) [^](#markdown-header-fairfax-presentation-styles-library)

Making it easy to contribute to this repo is very much a work in progress. To help, some tools have been provided, but even these might prove difficult for those who are unfamiliar with the command line or attempting to contribute on Windows.

We really need to find workarounds that make it possible for everyone to help out, but for now, the instructions below are all there is time to put together.

## [Keeping the development, distribution and example repos in sync](#markdown-header-keeping-the-development-distribution-and-example-repos-in-sync) [^](#markdown-header-contributing)

With three repositories - this development repo, as well as the [distribution](https://bitbucket.org/fairfax-prez/ffx-prez-styles-distribution) and [example](https://bitbucket.org/fairfax-prez/ffx-prez-styles-example) repos - it could get pretty hairy, pretty quickly, trying to keep them all up to date and in sync.

To help handle that complexity, I've included a series of bash shell scripts in this development resposity:

* **[build-distribution.sh](https://bitbucket.org/fairfax-prez/ffx-prez-styles/src/f02d8fa22440520f6c80baebcce3c4e88b18169b/build-distribution.sh?at=master&fileviewer=file-view-default)** - This script takes the development repository's assets and creates a usable distribution, stripping out files necessary for the library's development but not its use.
* **[build-example.sh](https://bitbucket.org/fairfax-prez/ffx-prez-styles/src/f02d8fa22440520f6c80baebcce3c4e88b18169b/build-example.sh?at=master&fileviewer=file-view-default)** - This script takes the development repository's assets and creates an updated example repository.
* **[build-readme.sh](https://bitbucket.org/fairfax-prez/ffx-prez-styles/src/f02d8fa22440520f6c80baebcce3c4e88b18169b/build-readme.sh?at=master&fileviewer=file-view-default)** - This script takes the readme files associated with the library's various component categories (e.g. 'modules', 'base', 'distribution', 'layouts', etc.) and combines them into the parent readme you're reading now.
* **[push-distribution.sh](https://bitbucket.org/fairfax-prez/ffx-prez-styles/src/bbdb879f2879f10ed9e05f24d073d6237e89c282/push-distribution.sh?at=master&fileviewer=file-view-default)** - This script is just a shorthand that allows the user to quickly push a new version of the distribution files to the corresponding repo.
* **[push-example.sh](https://bitbucket.org/fairfax-prez/ffx-prez-styles/src/bbdb879f2879f10ed9e05f24d073d6237e89c282/push-example.sh?at=master&fileviewer=file-view-default)** - Another shorthand that allows the user to quickly push a new version of the example files to the corresponding repo.

(To use these scripts, you need to be using a Unix-based operating system or one of many Bash-shell emulators available for Windows. I'm no expert in using shell scripts on Windows, but something like [this](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/) or the [command-line that comes with Git for Windows](https://git-for-windows.github.io/) might work.)

## [Pushing changes to the repo](#markdown-header-pushing-changes-to-the-repo) [^](#markdown-header-contributing)

Anyway, rather than interacting with the scripts above directly, it's recommended that you stick to the NPM scripts included in this repostory's 'package.json' file. There are really only two you need to worry about, when it comes to pushing changes.

First, when making a contribution, you'd want to execute the 'build-readme' script (don't type the '$' - that just means we're using the command line):

```
$ npm run build-readme

# This does little more than execute the 'build-example.sh' script described above.
```

Second, after executing the above, you'd want to execute the 'publish:all' script:

```
$ npm run publish:all

# This script builds updated distribution and example repositories, then pushes them to the
# appropriate repos with a default commit message telling users to 'see development repo for
# details' about the changes
```

After doing the above, you'll usually want to stage, commit and push your changes to the development repo, as well:

```
$ git add *
$ git commit -m "Some message explaining your changes"
$ git push origin master

```

## [Other tips for making contributions](#markdown-header-other-tips-for-making-contributions) [^](#markdown-header-contributing)

In addition to the above, there are a few other bits and pieces that are worth noting, before you jump in and starting contributing:

* **Update category readmes, not the main development repo readme** - In other words, if you want to correct something in the documentation for the '`button`' module mixin, make your changes to the '`readme.md`' file in the '`modules`' directory. **Don't make your changes to the '`readme.md`' file in the root of the project directory.** (This is because the latter '`readme.md`' file is compiled from all of the category-level readmes, so any changes made directly to it will be overwritten when you execute the '`build-readme`' script described above.)
* **Don't assume, in documentation** - My personal preference, when it comes to documentation, verges on the verbose. Another developer shouldn't have read a whole SCSS file to figure out the type of some parameter. Be obvious. See the '`modules/_button.scss`' file for an example of what this can look like. (Documentation style is a subject of debate and I'm happy to hear your thoughts on this; this and the following points are just explanations of why things are written like as they are, at the moment.) 
* **Examples, examples, examples** - Always provide examples in your documentation. I want to be able to copy and paste your code straight into my project. (This is especially important where styles depend on complex HTML markup to render properly.)
* **Keep explanations close to the explained** - Working on or with a particular mixin, I find it helps to have docs close at hand - in the file, if possible. (See the `button` module mentioned above, to see how this can look.)
* **Write documentation once** - The above might sound excessive, especially with readme documentation to maintain, as well. To save time and prevent inconsistencies, I tend to write my inline documentation using [Markdown formatting](https://confluence.atlassian.com/bitbucketserver040/markdown-syntax-guide-785329478.html), then copy that into the appropriate readme. (Again, see the button module example.)

-----
