# [Modules](#markdown-header-modules) [^](#markdown-header-fairfax-presentation-styles-library)

Here you'll find a range of mix-ins to be applied to 'modules', as loosely defined in [Jonathan Snook's SMACSS methodology](https://smacss.com/book/categorizing):

> Modules are the reusable, modular parts of our design. They are the callouts, the sidebar sections, the product lists and so on.

In other words, here you'll find mix-ins intended for things used again and again, across the site. A button might be part of a header display, then find use in a sidebar and also find a place in the site's footer - that's a module.

This document should include a description of each of the module mix-ins provided and examples sufficient to get the reader up and running without looking at the code. See the ['Button'](#markdown-header-button) mix-in's documentation for something of a template.

## Contents

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

## [Button](#markdown-header-button) [^](#markdown-header-modules)

A series of mix-ins to help developers hastily apply standard button styles.

Users are encouraged to stick to the standard button mixin ('button'), except where a given color scheme demands a change (use 'button--custom') or the function of the button necessitates one (e.g. where the button deletes things, use 'button--destructive').

All mix-ins result in buttons that can be made to appear deactivated (apply the `.is--deactivated` class to your button) or to signify the application is in the midst of loading (apply the `.is--loading` class). The latter requires the inclusion of the SVG element included in the example HTML below. 

Users can avoid include the excess loading styles by setting the `can-load` variable to `false`.

You can use the button mix-ins as follows.

### [Standard button](#markdown-header-standard-button) [^](#markdown-header-modules)

`button(size, size-rules, style)`
  
| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| size           | String    | String describing size of button | 'small', 'medium', 'large' | 'medium' | No |
| size-rules     | String    | String describing rules determining size of button | 'fixed', 'dynamic' | 'dynamic' | No | 
| style          | String    | String describing style of button | 'solid', 'solid--reversed', 'hollow', 'hollow--reversed' | 'solid' | No |
| can-load | Boolean | Boolean indicating whether button can enter loading state | true or false | true | No |

To use this button style, add this to the top of your HTML document (or add the symbol elements to an existing svg container):

```
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; width: 0; height: 0;">
  <symbol viewBox="0 0 40 40" id="icon-loading">
    <circle class="loading__icon__circle" opacity="0" cx="15.8" cy="15" r="15"></circle>
    <path d="M27.8084006,22.8842813 C29.5771785,20.6011257 30.6299412,17.7353365 
             30.6299412,14.6236613 C30.6299412,9.67647577 27.9688583,5.35081946 
             24,3" class="loading__icon__active-segment"></path>  
  </symbol>
</svg>
```

You can then use the button style as follows.

Example SCSS:

```
.yourButtonClass {
  @include button("medium", "dynamic", "solid");
} 

// ... or ...

.yourCustomButtonClass {
  @include button-custom(#fff, red, "1px solid red", "large", "dynamic", "red");
}

// ... or ...

.yourDestructiveButtonClass {
  @include button-destructive("large", "fixed", "solid--reversed");
}
```

Example HTML:

```
<button class="yourButtonClass">
  <span>A long button</span>
  <svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" 
       xmlns:xlink="http://www.w3.org/1999/xlink" stroke="#096DD2" 
       stroke-width="3" fill="transparent" class="button-loading">
    <use 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      xlink:href="#icon-loading" 
      class="loading__icon" 
      transform="translate(6.5 6.5)">
  </svg>
</button>
```

Example HTML when button is in 'loading' state (subtitute 'is--deactivated' for 'deactivated' state):

```
<button class="yourButtonClass is--loading">
  <span>A long button</span>
  <svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" 
       xmlns:xlink="http://www.w3.org/1999/xlink" stroke="#096DD2" 
       stroke-width="3" fill="transparent" class="button-loading">
    <use 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      xlink:href="#icon-loading" 
      class="loading__icon" 
      transform="translate(6.5 6.5)">
  </svg>
</button>
```

### [Custom button](#markdown-header-custom-button) [^](#markdown-header-modules)

`button-custom(custom-background, custom-color, custom-border, size, size-rules, custom-outline)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| custom-background | Color | Colour for the background of the button | Any valid CSS colour (e.g. '#fff') | No default | **Yes** |
| custom-color | Color | Colour for the text of the button | Any valid CSS colour (e.g. '#fff') | No default | **Yes** |
| custom-border | String | Short-form border property for the button | Any valid value for 'border' CSS attribute (e.g. '1px solid red') | No default | **Yes** |
| size | String | String describing size of button | 'small', 'medium', 'large' | 'medium' | No |
| size-rules | String | String describing rules determining size of button | 'fixed', 'dynamic' | 'dynamic' | No |
| custom-outline | Color | Colour for the outline (shown on click) of the button | Any valid CSS colour (e.g. '#fff') | 'initial' | No |
| can-load | Boolean | Boolean indicating whether button can enter loading state | true or false | true | No |

Example SCSS:

```
.yourCustomButtonClass {
  @include button--custom(#fff, red, "1px solid red", "large", "dynamic", "red");
}
```

Example HTML would be the same as for the standard button, above, with 'yourCustomButtonClass' in place of 'yourButtonClass'.

### [Destructive button](#markdown-header-destructive-button) [^](#markdown-header-modules)

`button-destructive(size, size-rules, style)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| size           | String    | String describing size of button | 'small', 'medium', 'large' | 'medium' | No |
| size-rules     | String    | String describing rules determining size of button | 'fixed', 'dynamic' | 'dynamic' | No | 
| style          | String    | String describing style of button | 'solid', 'solid--reversed' | 'solid' | No |
| can-load | Boolean | Boolean indicating whether button can enter loading state | true or false | true | No |

Example SCSS:

```
.yourDestructiveButtonClass {
  @include button--destructive("large", "fixed", "solid--reversed");
}
```

Example HTML would be the same as for the standard button, above, with 'yourDestructiveButtonClass' in place of 'yourButtonClass'.

## [Loader](#markdown-header-loader) [^](#markdown-header-modules)

`loader(style)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style           | String    | String describing style of loader | 'standard', 'standard--dark' | 'standard' | No |

A loading indicator featuring a masthead-appropriate logo initial.

To use this loader style, add this to the top of your HTML document (or add the symbol elements to an existing svg container):

```
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; width: 0; height: 0;">
  <symbol viewBox="0 0 50 60" id="icon-loading-ct">
    <path d="M18.244 19.205L16.378 20.5l-1.072-1.296L39.152 0c.285 1.58 1.219 6.812 4.092 6.31 2.152-.364 4.166-3.013 5.32-4.73H50c-.65 2.008-1.363 3.79-2.662 5.515-1.293 1.653-2.802 3.014-4.524 4.156-1.29.867-2.298 1.361-3.807 1.79l-.073 34.255c.787-.639 1.51-1.28 2.151-2.073 1.372-1.507 2.38-3.224 3.45-4.876l1.154.428c-1.226 3.37-2.445 6.813-4.669 9.745-2.37 3.085-5.675 6.1-9.273 7.67-2.508 1.151-6.033 1.653-8.76 1.79C12.138 60.418 3.158 53.324.86 42.786A42.985 42.985 0 0 1 0 34.182c.073-4.722 2.014-9.38 4.376-13.397 3.378-5.872 8.842-10.538 15.022-13.471 2.444-1.15 5.31-2.22 8.111-2.22.293 0 .723.066.861.35.073.145-.064.363-.21.363-2.729 1.07-3.306 1.143-5.815 2.795-2.452 1.645-4.815 3.37-6.617 5.662-4.523 5.59-5.886 12.968-5.1 20 .365 3.215 1.438 6.438 3.24 9.16 1.218 1.799 2.801 3.16 4.376 4.52v-28.74zm3.622 29.331c2.444 1.15 4.816 2.3 7.543 2.3 1.73.066 3.662 0 5.318-.648.577-.29 1.143-.712 1.721-1.077l.074-36.977-4.313-3.013-1.217 25.515c-.074 2.51-1.145 4.95-2.37 7.096-1.007 1.725-2.59 3.15-4.094 4.448-.86.72-1.72 1.506-2.662 2.356z" fill="#0A1633" fill-rule="evenodd"/>
  </symbol>
  <symbol viewBox="0 0 59 62" id="icon-loading-smh">
    <path d="M44.28 48.294c-4.229-3.036-9.12-5.265-13.698-6.539l-.124-.041 5.043-7.53c6.429 1.401 10.814 4.95 10.814 8.611 0 1.632-.746 3.81-1.975 5.418l-.06.08zM32.557 23.685c-.886-.123-3.722-.609-4.415-.766-2.306-.477-13.809-3.888-13.809-8.981 0-5.786 7.435-5.786 11.005-5.786.788 0 9.162.732 13.111 6.18-.041.078-4.838 7.711-5.892 9.353zm25.235-7.84l.115-.094c.566-.544 1.093-1.66 1.093-2.327 0-.776-.285-1.484-.799-2-.497-.565-1.268-.885-2.288-.96-.087-.006-.584-.03-.617-.03-2.5.024-5.195 1.598-8.038 4.36-2.497 2.425-3.438 4.221-5.015 6.71-1.28 2.024-1.892 2.98-2.235 3.528-.481-.06-3.38-.518-5.976-1.083.836-1.36 3.303-5.693 6.102-9.745 2.035-2.945 4.496-5.61 5.73-7.129.193-.236.38-.375.605-.502.168-.095.417-.22.5-.315.009-.113-.327-.447-.385-.49-.166.022-.265.06-.405.129-.191.09-.447.215-.801.215-.451 0-.916-.384-1.761-1.083C41.495 3.27 37.543.012 30.598 0 18.702-.018 11.679 10.125 11.767 16.839c.055 4.183.854 8.78 2.94 10.712 2.128 1.97 5.712 3.41 11.98 4.9l.421.11-1.005 1.117c-1.649 1.405-2.834 2.755-5.925 2.831-1.955 0-2.866-.669-3.566-1.296l-.147.062c.163.329.59 1.063 1.14 1.739.704.857 1.35 1.306 1.93 1.336.095.025.914.234 2.238-.179 1.71-.534 3.556-1.817 5.338-3.824l.688-.771.69-.769 4.475.799c.511.116 1.015.173 1.457.303l-1.843 2.806c-2.325 3.51-3.214 4.605-3.214 4.605s-1.551-.224-1.96-.303c-1.276-.255-3.283-.382-6.06-.359-5.432-.05-12.938 1.959-17.463 6.469a13.529 13.529 0 0 0-2.288 2.996A11.737 11.737 0 0 0 0 56.078C0 58.81 1.798 62 6.876 62c6.794 0 12.706-6.42 15.824-9.872l.5-.556c.928-1.019 1.353-1.732 1.692-2.095 3.593.995 9.43 3.433 14.54 6.786 1.038-1.058 4.088-4.69 6.947-8.944 1.568-2.334 5.184-7.758 5.313-11.921.126-3.987-3.603-8.775-10.497-10.197.221-.458.633-1.162 1.667-2.762 2.834-4.392 5.39-8.96 10.78-8.96.964 0 2.969.22 4.055 2.24.032.046.05.076.095.127zM17.445 55.863c-1.312 1.119-2.63 2.065-3.922 2.816-1.358.747-2.686 1.296-4.021 1.63a11.6 11.6 0 0 1-2.799.38c-.256 0-.516-.015-.822-.042-2.755-.271-4.47-1.906-4.47-4.277 0-6.279 10.526-8.23 14.361-8.23l.808-.005c1.756-.014 2.985.111 6.431.806l.723.192a46.746 46.746 0 0 1-5.011 5.552c-.435.407-.84.806-1.278 1.178z" fill="#0A1633" fill-rule="evenodd"/>
  </symbol>
  <symbol viewBox="0 0 60 41" id="icon-loading-watoday">
    <path d="M29.974 11.33h-.334c-.611 1.626-10.344 27.707-10.566 28.269-.22.618-.5 1.401-1.389 1.401-.611 0-.946-.449-1.167-1.12L4.007 4.318C3.45 2.746 2.448 2.297 1.725 2.297H.335C.055 2.297 0 2.074 0 1.85V.392C0 .112.056 0 .445 0c.445 0 2.17.166 7.897.166C12.347.166 14.624 0 15.18 0c.389 0 .446.166.446.447V1.85c0 .28-.057.447-.446.447h-1.223c-.89 0-1.446.788-1.112 1.91l7.62 24.453h.331c.668-1.906 7.34-19.744 7.34-21.763 0-1.403-.556-2.86-1.053-3.53-.502-.675-1.225-1.07-1.67-1.07h-1.112c-.279 0-.335-.113-.335-.447V.392c0-.226.056-.392.39-.392.502 0 2.449.166 7.34.166 4.67 0 6.784-.166 7.34-.166.334 0 .386.166.386.502v1.403c0 .224-.052.392-.385.392h-1.67c-.889 0-1.39 1.235-1.11 2.189l7.673 24.174h.333c2.728-7.627 7.564-21.874 7.564-24.904 0-.617-.723-1.459-1.78-1.459h-1.612c-.335 0-.392-.168-.392-.504v-1.4c0-.227.057-.393.446-.393.555 0 2.504.166 5.95.166C57.555.166 59.167 0 59.61 0c.336 0 .389.111.389.502v1.403c0 .224 0 .392-.389.392h-1.054c-.946 0-2.058.62-2.614 2.02-.668 1.796-11.846 32.252-12.958 34.946-.277.673-.667 1.737-1.669 1.737-.779 0-1.11-.728-1.389-1.51l-9.953-28.16" fill="#0A1633" fill-rule="evenodd"/>
  </symbol>
  <symbol viewBox="0 0 61 56" id="icon-loading-theage">
    <path d="M55.49 51.65a76.398 76.398 0 0 1-3.368-6.912L32.98 0h-4.86L16.7 28.195c-1.56 3.883-9.118 21.282-10.102 23.07-1.2 2.15-2.076 1.862-6.598 2.25V56c1.642-.077 6.268-.232 9.143-.232 2.547 0 5.093.155 7.394.232v-2.486c-6.16-.077-6.736-.387-6.736-1.24 0-.312.33-1.244.74-2.332l4.503-11.435c.494-1.165.741-1.398 1.808-1.398h18.65c1.481 0 1.645 0 2.137 1.165l4.953 12.367c.328.776.575 1.475.575 1.941 0 .39-.575.778-7.394.932V56c6.407-.154 9.2-.232 12.242-.232 4.435 0 9.37.078 12.985.232v-2.64c-3.184 0-4.771-.388-5.51-1.71zM35.61 34.391c0 .233-.411.466-.984.544H18.151c-1.151 0-1.48-.233-1.48-.466s.166-.544.329-1.088l8.973-22.253c.246-.466.33-.854.494-.854.162 0 .41.388.493.7l.047.116 8.274 22.291c.245.622.328.777.328 1.01z" fill="#0A1633" fill-rule="evenodd"/>
  </symbol>
  <symbol viewBox="0 0 47 62" id="icon-loading-bt">
    <path d="M25.33 53.374c-3.825 0-7.729-1.627-10.519-5.29V33.278c2.312-4.556 6.774-6.51 10.678-6.51 7.17 0 11.712 6.349 11.712 13.183 0 6.427-3.824 13.424-11.872 13.424m1.99-35.23c-4.38 0-9.479 1.79-12.508 5.776V0H0v8.782l5.172.34v51.9h8.764l.48-4.882C17.44 60.21 22.698 62 27.162 62 38.873 62 47 51.666 47 40.193c0-12.285-8.445-22.048-19.68-22.048" fill="#0A1633" fill-rule="evenodd"/>
  </symbol>
</svg>
```
You can then use the button style as follows.

Example SCSS:
```
.elementContainingYourLoaderClass {
  position: relative; // This is required.

  height: 500px; // This can be whatever.
}

.yourLoaderClass {
  @include loader("standard");
}
```
Example HTML:
```
<div class="elementContainingYourLoaderClass">

  <div class="yourLoaderClass">
    <div class="loader-icon">
      <div class="loader-icon__borders-container">
        <div class="loader-icon__borders-container__borders"></div>   
      </div>
      <svg 
        viewBox="0 0 60 60" version="1.1" 
        xmlns="http://www.w3.org/2000/svg"
        class="loader-icon__svg">
        <use 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          xlink:href="#icon-loading-smh" 
          class="loader-icon__svg__image" >
      </svg>
    </div>
    <p class="loader-message">
      Some default message.
    </p>
    <div class="loader-retry">
      <button class="loader-retry__button">
        Try again
      </button>
    </div>
  </div>

</div>
```
Change the `xlink:href` property of the `use` element, either by hand or programmatically, to change the loading icon to the publication of your choosing.

Users can change the icon to that of any of Fairfax's principle mastheads, including:

* The Age (`icon-loading-theage`)
* Sydney Morning Herald (`icon-loading-smh`)
* Brisbane Times (`icon-loading-bt`)
* Canberra Times (`icon-loading-ct`)
* WA Today (`icon-loading-watoday`)

For example, if you wanted to create a loader featuring the WA Today logo, you could use the following HTML:
```
<div class="elementContainingYourLoaderClass">

  <div class="yourLoaderClass">
    <div class="loader-icon">
      <div class="loader-icon__borders"></div>
      <svg 
        viewBox="0 0 60 60" version="1.1" 
        xmlns="http://www.w3.org/2000/svg"
        class="loader-icon__svg">
        <use 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          xlink:href="#icon-loading-watoday" 
          class="loader-icon__svg__image" >
      </svg>
    </div>
    <p class="loader-message">
      Some default message.
    </p>
    <div class="loader-retry">
      <button class="loader-retry__button">
        Try again
      </button>
    </div>
  </div>

</div>
```

## [Sports team icon](#markdown-header-sports-team-icon) [^](#markdown-header-modules)

`sports-team-icon(side-length, league)`

A mix-in built for the purpose of displaying domestic and international AFL, Rugby League and Rugby Union team icons.

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| side-length    | Number with unit | Figure with unit that determines width and height of icon | Any valid CSS display unit (e.g. '10px', '1em') | '20px' | No |
| league | String | String denoting which set of icons to include in icon style | 'all', 'afl', 'rugby union', 'run', 'rugby league', 'rle' | 'all' | No |

Example SCSS:

```
.testIcon {
  @include sports-team-icon(40px, 'afl');
}
```

Example HTML:
```
  <!-- 'testIcon' makes it an icon, 'is--afl-adelaide' determines which icon is displayed --> 
  <div class="testIcon is--afl-adelaide"></div>
```

Each of the different sports have their icons namespaced to avoid naming conflicts.

For example, the Brisbane Lions AFL team icon class is not 'is--brisbane' but 'is--afl-brisbane'.

Rugby League icons are prefixed 'is--rle' (e.g. 'is--rle-brisbane-broncos').

Rugby Union icons are prefixed 'is--run' (e.g. 'is--run-brumbies').

The icons available are as follows:

| Sport | Team name | CSS Classes |
| ------ | --------- | ----------- |
| AFL    | Adelaide Crows | is--afl-adelaide **OR**  is--afl-adelaide-crows |
| AFL | Brisbane Lions | is--afl-brisbane **OR** is--afl-brisbane-lions |
| AFL | Carlton Blue | is--afl-carlton |
| AFL | Collingwood Magpies | is--afl-collingwood |
| AFL | Essendon Bombers | is--afl-essendon |
| AFL | Fremantle Dockers | is--afl-fremantle |
| AFL | Geelong Cats | is--afl-geelong **OR** is--afl-geelong-cats | 
| AFL | Gold Coast Suns | is--afl-gold-coast **OR** is--afl-gold-coast-suns |
| AFL | Hawthorn Hawks | is--afl-hawthorn |
| AFL | North Melbourne Roos | is--afl-north-melbourne |
| AFL | Melbourne Demons | is--afl-melbourne |
| AFL | Port Adelaide Power | is--afl-port-adelaide |
| AFL | Richmond Tigers | is--afl-richmond |
| AFL | St Kilda Saints | is--afl-st-kilda |
| AFL | Sydney Swans | is--afl-sydney **OR** is--afl-sydney-swans |
| AFL | West Coast Eagles | is--afl-west-coast **OR** is--afl-west-coast-eagles |
| AFL | Western Bulldogs | is--afl-western-bulldogs |
| AFL | Greater Western Sydney Giants | is--afl-greater-western-sydney-giants **OR** is--afl-gws-giants |
| Rugby League | Brisbane Broncos | is--rle-brisbane-broncos |
| Rugby League | Canberra Raiders | is--rle-canberra-raiders |
| Rugby League | Canterbury Bankstown Bulldogs | is--rle-canterbury-bankstown-bulldogs |
| Rugby League | Cronulla Sutherland Sharks | is--rle-cronulla-sutherland-sharks |
| Rugby League | Gold Coast Titans | is--rle-gold-coast-titans | 
| Rugby League | Manly Warringah Sea Eagles | is--rle-manly-warringah-sea-eagles |
| Rugby League | Melbourne Storm | is--rle-melbourne-storm |
| Rugby League | Newcastle Knights | is--rle-newcastle-knights |
| Rugby League | New Zealand Warriors | is--rle-new-zealand-warriors |
| Rugby League | North Queensland Cowboys | is--rle-north-queensland-cowboys |
| Rugby League | Parramatta Eels | is--rle-parramatta-eels | 
| Rugby League | Penrith Panthers | is--rle-penrith-panthers |
| Rugby League | South Sydney Rabbitohs | is--rle-south-sydney-rabbitohs |
| Rugby League | St George Illawarra Dragons | is--rle-st-george-illawarra-dragons |
| Rugby League | Sydney Roosters | is--rle-sydney-roosters |
| Rugby League | West Tigers | is--rle-wests-tigers |
| Rugby League (State of Origin) | New South Wales | is--rle-new-south-wales |
| Rugby League (State of Origin) | Queensland | is--rle-queensland |
| Rugby League (City vs Country Origin) | City | is--rle-city-origin |
| Rugby League (City vs Country Origin) | Country | is--rle-country-origin |
| Rugby League (Internationals) | Australia | is--rle-australia |
| Rugby League (Internationals) | Cook Islands | is--rle-cook-islands |
| Rugby League (Internationals) | England | is--rle-england |
| Rugby League (Internationals) | Fiji | is--rle-fiji |
| Rugby League (Internationals) | France | is--rle-france |
| Rugby League (Internationals) | Italy | is--rle-italy |
| Rugby League (Internationals) | Ireland | is--rle-ireland |
| Rugby League (Internationals) | New Zealand | is--rle-new-zealand |
| Rugby League (Internationals) | Papua New Guinea | is--rle-papua-new-guinea |
| Rugby League (Internationals) | Samoa | is--rle-samoa |
| Rugby League (Internationals) | Scotland | is--rle-scotland |
| Rugby League (Internationals) | Tonga | is--rle-tonga |
| Rugby League (Internationals) | United States | is--rle-usa |
| Rugby League (Internationals) | Wales | is--rle-wales |
| Rugby Union | Auckland Blues | is--run-auckland-blues |
| Rugby Union | Brisbane Brumbies | is--run-brisbane-brumbies |
| Rugby Union | Pretoria Bulls | is--run-pretoria-bulls |
| Rugby Union | Free State Cheetahs | is--run-free-state-cheetahs |
| Rugby Union | Hamilton Chiefs | is--run-hamilton-chiefs |
| Rugby Union | Christchurch Crusaders | is--run-christchurch-crusaders |
| Rugby Union | Dunedin Chiefs | is--run-dunedin-highlanders |
| Rugby Union | Wellington Hurricanes | is--run-wellington-hurricanes |
| Rugby Union | Melbourne Rebels | is--run-melbourne-rebels |
| Rugby Union | Queensland Reds | is--run-queensland-reds |
| Rugby Union | Durban Sharks | is--durban-sharks |
| Rugby Union | Cape Town Stormers | is--run-cape-town-stormers |
| Rugby Union | Western Force | is--run-western-force-waratahs |
| Rugby Union | Johannesburg Lions | is--run-johannesburg-lions |
| Rugby Union | Southern Kings | is--run-southern-kings |
| Rugby Union | Tokyo Sunwolves | is--run-tokyo-sunwolves |
| Rugby Union | Argentine Jaguares | is--run-argentine-jaguares |
| Rugby Union (World Cup) | Argentina | is--run-argentina |
| Rugby Union (World Cup) | Australia | is--run-australia |
| Rugby Union (World Cup) | Canada | is--run-canada |
| Rugby Union (World Cup) | England | is--run-england |
| Rugby Union (World Cup) | Fiji | is--run-fiji |
| Rugby Union (World Cup) | France | is--run-france |
| Rugby Union (World Cup) | Georgia | is--run-georgia |
| Rugby Union (World Cup) | Ireland | is--run-ireland |
| Rugby Union (World Cup) | Italy | is--run-italy |
| Rugby Union (World Cup) | Japan | is--run-japan |
| Rugby Union (World Cup) | Namibia | is--run-namibia |
| Rugby Union (World Cup) | New Zealand | is--run-new-zealand |
| Rugby Union (World Cup) | Romania | is--run-romania |
| Rugby Union (World Cup) | Russia | is--run-russia |
| Rugby Union (World Cup) | Samoa | is--run-samoa |
| Rugby Union (World Cup) | Scotland | is--run-scotland |
| Rugby Union (World Cup) | South Africa | is--run-south-africa |
| Rugby Union (World Cup) | Tonga | is--run-tonga |
| Rugby Union (World Cup) | United States | is--run-united-states |
| Rugby Union (World Cup) | Wales | is--run-wales |
| Rugby Union (World Cup) | Barbarians | is--run-barbarians |
| Rugby Union (World Cup) | British Irish Lions | is--run-british-irish-lions |
| Rugby Union (World Cup) | Uruguay | is--run-uruguay |
| Rugby Union (Other) | Combined NSW-Queensland Country | is--run-combined-nsw-qld-country |

## [Social button](#markdown-header-social-button) [^](#markdown-header-modules)

`social-button(icon-size, color, action-color)`

(The library also includes `social-button-container()`.)

A mix-in to facilitate the use of standard social media sharing buttons, including those for 
Facebook, Twitter, Instagram, WhatsApp, Google Plus and Email.

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| icon-size    | Number with unit | Figure with unit that determines width and height of button icon | Any valid CSS display unit (e.g. '10px', '1em') | '1rem' | No |
| color | Colour | Colour of button in default state | Any valid CSS colour | $color__brand ('#0a1633') | No |
| action-color | Colour | Colour of button in hover and focus states | Any valid CSS colour | $color__action ('#096dd2') | No |

To use social buttons, add this to the top of your HTML document (or add the symbol elements to 
an existing svg container):

```
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; width: 0; height: 0;">
  <symbol viewBox="0 0 32 32" id="icon-twitter">
    <path d="M32 6.371c-1.16.525-2.139.542-3.177.023 1.34-.811 1.4-1.38 1.884-2.916a12.91 12.91 0 0 1-4.115 1.596A6.431 6.431 0 0 0 21.864 3c-3.578 0-6.479 2.94-6.479 6.564 0 .515.058 1.016.167 1.496C10.167 10.787 5.394 8.173 2.2 4.2a6.612 6.612 0 0 0-.879 3.302 6.584 6.584 0 0 0 2.883 5.463 6.402 6.402 0 0 1-2.934-.82l-.001.082c0 3.18 2.234 5.833 5.198 6.437a6.43 6.43 0 0 1-2.927.112c.825 2.607 3.218 4.505 6.052 4.559A12.903 12.903 0 0 1 0 26.052 18.167 18.167 0 0 0 9.93 29c11.919 0 18.433-10.001 18.433-18.675 0-.286-.004-.566-.017-.85C29.61 8.551 31.132 7.69 32 6.371" fill="currentColor" fill-rule="evenodd"></path>
  </symbol>
  <symbol viewBox="0 0 32 32" id="icon-email">
    <g fill="currentColor" fill-rule="evenodd">
      <path d="M16.086 17.334L30.627 6.502A3.267 3.267 0 0 0 28.885 6h-25.6c-.621 0-1.194.177-1.685.47l14.486 10.864z"></path>
      <path d="M16.464 18.857a.805.805 0 0 1-.931-.002L.413 7.538C.158 7.98 0 8.478 0 9.018v13.847c0 1.695 1.435 3.077 3.2 3.077h25.6c1.765 0 3.2-1.382 3.2-3.077V9.018c0-.518-.147-1-.382-1.429L16.464 18.857z"></path>
    </g>
  </symbol>
  <symbol viewBox="0 0 32 32" id="icon-whatsapp">
    <path d="M22.189 24.818c-.856.078-.856.701-5.6-1.165-4.74-1.868-7.733-6.732-7.967-7.044-2.187-2.91-2.762-5.991-.273-8.715.79-.86 2.748-.824 3.19.235.387.934 1.32 3.229 1.438 3.462.117.235.194.507.037.817-.186.375-.38.814-1.166 1.596-.233.233-.475.484-.203.95.272.468 1.206 1.995 2.594 3.231 1.782 1.59 3.284 2.081 3.75 2.315.467.233.74.195 1.012-.117.271-.313 1.167-1.362 1.476-1.829.312-.467.624-.388 1.05-.233.428.155 2.72 1.283 3.188 1.518.466.23.778.35.895.544.701 1.177-.963 4.212-3.421 4.435M16 0C7.178 0 0 7.177 0 16c0 3.5 1.133 6.744 3.048 9.38L1.05 31.324l6.149-1.97A15.897 15.897 0 0 0 16 32c8.821 0 16-7.177 16-16 0-8.822-7.178-16-16-16" fill="currentColor" fill-rule="evenodd"></path>
  </symbol>
  <symbol viewBox="0 0 32 32" id="icon-facebook">
    <path d="M18.7 17.4h5.1l.7-5.6h-5.8V8.1c0-1.6.5-2.7 2.8-2.7h3V.2c-.5 0-2.3-.2-4.4-.2-4.4 0-7.9 2.7-7.9 7.7v4.1H7.6v5.6h4.6V32h6.5V17.4z" fill="currentColor"></path>
  </symbol>
  <symbol viewBox="0 0 32 32" id="icon-google">
    <path d="M28.6 14.6v-3.4H26v3.4h-3.4v2.6H26v3.4h2.6v-3.4H32v-2.6zm-8-.6a8.2 8.2 0 0 1 .2 2.2c0 5.9-4 10.3-10.2 10.3A10.65 10.65 0 0 1 0 16 10.65 10.65 0 0 1 10.6 5.5a10.48 10.48 0 0 1 7.2 2.8l-3 3A6.38 6.38 0 0 0 4.2 16a6.24 6.24 0 0 0 6.4 6.3c3.2 0 5.4-1.8 5.8-4.3h-5.8v-3.9l10-.1z" fill="currentColor" fill-rule="evenodd"></path>
  </symbol>
  <symbol viewBox="0 0 32 32" id="icon-instagram">
    <g stroke="currentColor" fill="currentColor">
      <path d="M8.5 2.9h15c1.6 0 3 .7 3.9 1.7 1 .9 1.7 2.3 1.7 3.9v15c0 1.6-.7 3-1.7 3.9-.9 1-2.3 1.7-3.9 1.7h-15c-1.6 0-3-.7-3.9-1.7-1-.9-1.7-2.3-1.7-3.9v-15c0-1.6.7-3 1.7-3.9.9-1.1 2.3-1.7 3.9-1.7m15-1.9h-15C4.4 1 1 4.4 1 8.5v15C1 27.6 4.4 31 8.5 31h15c4.1 0 7.5-3.4 7.5-7.5v-15C31 4.4 27.6 1 23.5 1" stroke-width="2"></path>
      <path d="M16 21c-1.4 0-2.6-.6-3.5-1.5-.9-.9-1.5-2.1-1.5-3.5s.6-2.6 1.5-3.5c.9-.9 2.2-1.5 3.5-1.5 1.4 0 2.6.6 3.5 1.5.9.9 1.5 2.2 1.5 3.5 0 1.4-.6 2.6-1.5 3.5-.9.9-2.1 1.5-3.5 1.5m0-12c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7" stroke-width="2"></path>
      <path d="M24 9.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5m0-4c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5"></path>
    </g>
  </symbol>
</svg>
```

(In future, it might be that the above isn't necessary, as mastheads in the Fairfax Blue style appear to include the symbols above on every page.)

With the above in your HTML document, you can use this style as follows.

Your SCSS:

```
.yourSocialButtonContainerStyle {
  @include social-button-container();
}

.yourSocialButtonStyle {
  @include social-button(15px, #000, #ccc); 
}
```

Your HTML:

```
<ul class="yourSocialButtonContainerStyle">
  <li class="yourSocialButtonStyle">
    <a href="javascript:void(0);">
      <span>Share on Facebook</span>
      <svg height="1em" width="1em" aria-hidden="true" focusable="false">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-facebook"></use>
      </svg>
    </a>
  </li>
  <li class="yourSocialButtonStyle">
    <a href="javascript:void(0);">
      <span>Share on Twitter</span>
      <svg height="1em" width="1em" aria-hidden="true" focusable="false">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-twitter"></use>
      </svg>
    </a>
  </li>
  <li class="yourSocialButtonStyle">
    <a href="javascript:void(0);">
      <span>Share on WhatsApp</span>
      <svg height="1em" width="1em" aria-hidden="true" focusable="false">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-whatsapp"></use>
      </svg>
    </a>
  </li>
  <li class="yourSocialButtonStyle">
    <a href="javascript:void(0);">
      <span>Share on Email</span>
      <svg height="1em" width="1em" aria-hidden="true" focusable="false">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-email"></use>
      </svg>
    </a>
  </li>
</ul>
```

Standard Fairfax Blue style is to include Facebook, Twitter, WhatsApp (visible only on mobile) and Email sharing options.

## [Text input](#markdown-header-text-input) [^](#markdown-header-modules)

`text-input(style)`

A couple of mix-ins to help users get standard form-based text inputs up and running.

All mix-ins result in inputs that can be made to declare the user's input is invalid (apply the '.is--invalid' class to your button) or to signify the input is deactivated (apply the '.is--deactivated' class).

To use text input styles, add this to the top of your HTML document (or add the symbol elements to an existing svg container):

```
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; width: 0; height: 0;">
  <symbol viewBox="0 0 16 16" id="icon-validation-alert">
    <circle r="8" cx="8" cy="8"></circle>
    <text text-anchor="middle" x="8" y="13" fill="#fff">!</text>
  </symbol>
</svg>
```

### [Standard text input](#markdown-header-standard-text-input) [^](#markdown-header-modules)

text-input(style)
  
| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style          | String    | String describing style of text input | 'standard', 'standard--dark' | 'standard' | No |

You can then use the button style as follows.

Example SCSS:

```
.yourTextInputClass {
  @include text-input("standard");
}
```

Example HTML:

```
<div class="yourTextInputClass">
  <label>Some input label</label>
  <div>
    <input type="text" placeholder="Some input text"></input>
    <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" 
         xmlns:xlink="http://www.w3.org/1999/xlink" class="validation-alert">
      <use 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        xlink:href="#icon-validation-alert" 
        class="validation-alert__icon">
    </svg>
  </div>
  <p class="validation-error">
    You input the wrong thing.
  </p>
</div>
```

Example HTML when input is in 'invalid' state (subtitute 'is--deactivated' for 'deactivated' state):

```
<div class="yourTextInputClass is--invalid">
  <label>Some input label</label>
  <div>
    <input type="text" placeholder="Some input text"></input>
    <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" 
         xmlns:xlink="http://www.w3.org/1999/xlink" class="validation-alert">
      <use 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        xlink:href="#icon-validation-alert" 
        class="validation-alert__icon">
    </svg>
  </div>
  <p class="validation-error">
    You input the wrong thing.
  </p>
</div>
```

(Note the 'label', 'validation-alert' and 'validation-error' elements are optional.)

### [Custom text input](#markdown-header-custom-text-input) [^](#markdown-header-modules)

`text-input-custom(border-color, focus-border-color, color, font-size, background, outline)`
  
| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| border-color   | Color    | Colour of the input's border | Any valid CSS colour value | $color__gray--medium ('#a6acba') | No |
| focus-border-color   | Color    | Colour of the input's border when in focus state | Any valid CSS colour value | $color__blue--medium-2 ('#096dd2') | No |
| color   | Color    | Colour of the input's text | Any valid CSS colour value | $color__black--medium ('#232323') | No |
| font-size   | Number with unit | Size of input text (label is sized at 93.75% of this) | Any valid CSS display unit (e.g. '1em', '16px', '1rem') | '1rem' | No |
| background   | Color | Colour of input's background | Any valid CSS colour value | '#fff' | No |
| outline   | Color | Colour of outline shown around input when it is in focus | Any valid CSS colour value | initial | No |

You can then use the button style as follows.

Example SCSS:

```
.yourCustomTextInputClass {
  @include text-input--custom(pink, purple, black, 1.5rem, yellow, red);
}
```

Example HTML would be the same as for the standard text input, above, with 'yourCustomTextInputClass' in place of 'yourTextInputClass'.

## [Search input](#markdown-header-search-input) [^](#markdown-header-modules)

A kind of text input specifically designed for search functionality.

To use a search input, add this to the top of your HTML document (or add the symbol element to 
an existing svg container):

```
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; width: 0; height: 0;">
  <symbol viewBox="0 0 32 32" id="icon-search">
    <path d="M21.08 18.573l10.4 10.4a1.773 1.773 0 1 1-2.508 2.507l-10.4-10.4a11.62 11.62 0 0 1-6.902 2.26C5.225 23.34 0 18.115 0 11.67S5.225 0 11.67 0s11.67 5.225 11.67 11.67c0 2.583-.84 4.97-2.26 6.903zm-1.287-6.903a8.123 8.123 0 1 0-16.247 0 8.123 8.123 0 0 0 16.247 0z" fill="currentColor" fill-rule="evenodd"/>
  </symbol>
</svg>
```

### [Standard search input](#markdown-header-standard-search-input) [^](#markdown-header-modules)

`search-input(style, icon-position, autocomplete)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style   | String    | String describing style of the search input | 'standard', 'standard--dark' | 'standard' | No |
| icon-position   | String    | String denoting position of search icon | 'left', 'right' | 'right' | No |
| autocomplete   | String    | String determining whether or search input will be styled to include autocomplete functionality | 'true', 'false' | 'false' | No |

With the SVG symbol mentioned at the start of the ['Search input'](#markdown-header-search-input) section in your HTML document, you can use this style as follows.

Your SCSS:

```
.yourSearchInputClass {
  @include search-input("standard", "right", "true");
}
```

Your HTML:

```
<form class="yourSearchInputClass">
  <label>Some invisible search label</label>
  <input type="text" placeholder="Some search placeholder text"></input>
  <button type="submit">
    <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" 
         xmlns:xlink="http://www.w3.org/1999/xlink">
      <use 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        xlink:href="#icon-search" >
    </svg>
  </button>
</form>
```

Your HTML when using autocomplete:

```
<form class="yourSearchInputClass">
  <label>Some invisible search label</label>
  <input 
    type="text" 
    placeholder="Some search placeholder text" 
    id="text-input-with-autocomplete"/>
  <button type="submit">
    <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" 
         xmlns:xlink="http://www.w3.org/1999/xlink">
      <use 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        xlink:href="#icon-search" >
    </svg>
  </button>
</form>

<script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.2/awesomplete.js"></script>
<script>
  var data = ["Brunswick", "Brunton", "Brunsby"]

  var auto = new Awesomplete("#text-input-with-autocomplete", {
    minChars: 2,
    maxItems: 5,
    list: data
  });
</script>
```

### [Custom search input](#markdown-header-custom-search-input) [^](#markdown-header-modules)

`search-input-custom(border-color, focus-border-color, color, font-size, background, icon-position, outline, autocomplete)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| border-color   | Color    | Colour of the input's border | Any valid CSS colour value | $color__gray--medium ('#a6acba') | No |
| focus-border-color   | Color    | Colour of the input's border when in focus state | Any valid CSS colour value | $color__blue--medium-2 ('#096dd2') | No |
| color   | Color    | Colour of the input's text | Any valid CSS colour value | $color__black--medium ('#232323') | No |
| font-size   | Number with unit | Size of input text (label is sized at 93.75% of this) | Any valid CSS display unit (e.g. '1em', '16px', '1rem') | '1rem' | No |
| background   | Color | Colour of input's background | Any valid CSS colour value | '#fff' | No |
| icon-position   | String    | String denoting position of search icon | 'left', 'right' | 'right' | No |
| outline   | Color | Colour of outline shown around input when it is in focus | Any valid CSS colour value | initial | No |
| autocomplete   | String    | String determining whether or search input will be styled to include autocomplete functionality | 'true', 'false' | 'false' | No |

With the SVG symbol mentioned at the start of the ['Search input'](#markdown-header-search-input) section in your HTML document, you can use this style as follows.

Your SCSS:

```
.yourCustomSearchInputClass {
  @include search-input--custom(
    pink,
    purple,
    black,
    1.5rem,
    #fff3ee,
    "left",
    initial,
    "true"
  );
}
```

Example HTML would be the same as for the standard search input, above, with 'yourCustomSearchInputClass' in place of 'yourSearchInputClass'.

## [Text input autocomplete](#markdown-header-text-input-autocomplete) [^](#markdown-header-modules)

`autocomplete(style)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style   | String    | String describing style of the autocomplete elements rendered | 'standard' | 'standard' | No |

A mix-in that adds styles to the autocomplete options appended to a text input when using Awesomplete-style autocompletion.

This mix-in isn't really intended for public use. It's mostly applied by other mix-ins with 'autocomplete' options, like the [search input]((#markdown-header-search-input) and [text input](#markdown-header-text-input) mix-ins. Nevertheless, a public interface is provided as a courtesy and in anticipation of future developments.

Your SCSS:

```
// The class of the element containing the text input you want to have autocomplete capacity
.elementContainingTextInput {
  
  .awesomplete {
    @include autocomplete("standard");
  }
}
```

Your HTML:
```
<div class="elementContainingTextInput">
  <input type="text" id="text-input-with-autocomplete" />
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.2/awesomplete.js"></script>
<script>
  var data = ["Derpit", "Burpit", "Fartit", "McGardit", "Lardit", "Dingo", "Brunswick", "Brunton", "Brunsby"]

  var auto = new Awesomplete("#text-input-with-autocomplete", {
    minChars: 2,
    maxItems: 5,
    list: data
  });
</script>
```

## [Drop-cap](#markdown-header-drop-cap) [^](#markdown-header-modules)

`drop-cap(normal-font-size)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| normal-font-size   | Number with unit    | Size of most of the text in the drop-cap's section | Any number with unit (e.g. `1rem`, `16px`) | None | Yes |

A large capital letter used to start a section of a feature article.

With the above in your HTML document, you can use this style as follows.

Your SCSS:

```
.yourDropCapClass {
  @include drop-cap(1rem);
}
```

Your HTML:
```
<p>
  <span class="yourDropCapClass">T</span>here are about 17,000 rips at beaches around Australia 
  on any given day. Chances are that – unless you’re a skilled surf lifesaver or an extremely 
  experienced surfer – you’d prefer not to be dicing with them.
</p>
```

## [Dropdown](#markdown-header-dropdown) [^](#markdown-header-modules)

A couple of mix-ins to help users implement product-style dropdowns as quickly as possible.

All mix-ins result in inputs that can signify the input is deactivated (apply the 
`is--deactivated` class) and invalid (apply the `is--invalid` class).

(The `is--invalid` class is optional and can be included or not, depending on the values you input.)

To use dropdown inputs, add this to the top of your HTML document (or add the symbol elements to 
an existing svg container):

```
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute; width: 0; height: 0;">
  <symbol viewBox="0 0 10 7" id="icon-carat">
    <path d="M1 1l4 3.74L9 1" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd"/>
  </symbol>
  <symbol viewBox="0 0 9 9" id="icon-tick">
    <path d="M2.978 9a.998.998 0 0 1-.706-.294L.292 6.728a1 1 0 0 1 1.415-1.414L2.853 6.46 7.188.416a1 1 0 0 1 1.625 1.166l-5.022 7A.994.994 0 0 1 2.978 9" fill="currentColor" fill-rule="evenodd"/>
  </svg>
  <!-- Include only when including invalid state styles -->
  <symbol viewBox="0 0 16 16" id="icon-validation-alert">
    <circle r="8" cx="8" cy="8" fill="currentColor"></circle>
    <text 
      text-anchor="middle" 
      x="8" 
      y="13" 
      fill="#fff" 
      style="font-size: 13px; font-weight: 700; font-family: 'PT Sans', sans-serif">!</text>
  </symbol>
</svg>
```

### [Standard dropdown](#markdown-header-standard-dropdown) [^](#markdown-header-modules)

`dropdown(style, use-custom-dropdown-list-on-mobile, can-be-invalid)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style   | String    | A string describing the style of dropdown menu. | `"standard"` and `"standard--dark"` | `"standard"` | No |
| use-custom-dropdown-list-on-mobile   | Boolean    | Boolean to indicate whether to use the custom dropdown list (rather than the built-in `select` element functionality) on mobile devices. (Built-in functionality is often more usable on mobile.) | `false` or `true` | `false` | No |
| can-be-invalid | Boolean    | Boolean indicating whether to include `is--invalid` state styles. | `false` or `true` | `false` | No |

A standard dropdown menu.

You can use this style as follows.

Example SCSS:
```
.yourDropdownClass {
  @include dropdown("standard", false, true);
}
```
Example HTML:
```
  <div class="yourDropdownClass">
    <label>Some input label</label>
    <div class="dropdown__inner" id="dropdown-container">
      <span class="dropdown__inner__current-value" id="dropdown-current-value">Soren Frederiksen</span>
      <svg 
        viewBox="0 0 10 7" version="1.1" 
        xmlns="http://www.w3.org/2000/svg"
        class="dropdown__inner__carat">
        <use 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          xlink:href="#icon-carat" 
          class="dropdown__inner__carat__image">
      </svg>
      <svg 
        viewBox="0 0 16 16" version="1.1" 
        xmlns="http://www.w3.org/2000/svg"
        class="dropdown__inner__error">
        <use 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          xlink:href="#icon-validation-alert" >
      </svg>
      <!-- Include only when invalid state styles are included -->
      <svg 
        viewBox="0 0 16 16" version="1.1" 
        xmlns="http://www.w3.org/2000/svg"
        class="dropdown__inner__error">
        <use 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          xlink:href="#icon-validation-alert" >
      </svg>
      <select class="dropdown__inner__select" id="dropdown-select-input">
        <option value="Soren Frederiksen">Soren Frederiksen</option>
        <option value="Richard Lama">Richard Lama</option>
        <option value="Reginal Sengkey">Reginal Sengkey</option>
      </select>
      <ul class="dropdown__inner__list" id="dropdown-list">
        <li value="Soren Frederiksen"
            class="dropdown__inner__list__item is--selected">
          Soren Frederiksen
          <svg 
            viewBox="0 0 10 7" version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
            class="dropdown__inner__list__item__tick">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#icon-tick">
          </svg>
        </li>
        <li value="Richard Lama"
            class="dropdown__inner__list__item">
          Richard Lama
          <svg 
            viewBox="0 0 10 7" version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
            class="dropdown__inner__list__item__tick">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#icon-tick">
          </svg>
          </svg>
        </li>
        <li value="Reginal Sengkey"
            class="dropdown__inner__list__item">
          Reginal Sengkey
          <svg 
            viewBox="0 0 10 7" version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
            class="dropdown__inner__list__item__tick">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#icon-tick">
          </svg>
          </svg>
        </li>
        <li value="Mark Stehle"
            class="dropdown__inner__list__item">
          Mark Stehle
          <svg 
            viewBox="0 0 10 7" version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
            class="dropdown__inner__list__item__tick">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#icon-tick">
          </svg>
          </svg>
        </li>
        <li value="Matthew Absalom-Wong"
            class="dropdown__inner__list__item">
          Matthew Absalom-Wong
          <svg 
            viewBox="0 0 10 7" version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
            class="dropdown__inner__list__item__tick">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#icon-tick">
          </svg>
          </svg>
        </li>
      </ul>
    </div>
    <!-- Include only when invalid state styles are included -->
    <p class="dropdown__error">
      You did something wrong.
    </p>
  </div>
```
In order to work fully (included the custom dropdown list), this mix-in also requires some 
JavaScript. 

Below is some bare-bones vanilla JavaScript that developers will be able to more eloquently 
implement using whatever framework or library they're using. In principal, though,
this is all you need.

Example JavaScript:
```
var dropdownValueDisplay = document.getElementById('dropdown-current-value');
var dropdownSelectInput = document.getElementById('dropdown-select-input');
var dropdownContainer = document.getElementById('dropdown-container');
var dropdownListItems = dropdownContainer.getElementsByClassName('dropdown__inner__list__item');

// When the user clicks the dropdown container, show it as selected
dropdownContainer.addEventListener('click', function() {
  dropdownContainer.classList.toggle('is--selected');
});

// When the user click a dropdown list item, select it
for (var i = 0; i < dropdownListItems.length; i += 1) {
  dropdownListItems[i].addEventListener('click', selectDropdownListItem);
}

function selectDropdownListItem(e) {

  var newDropdownValue = e.target.getAttribute('value');

  // Update dropdown value display and input
  dropdownValueDisplay.innerHTML = newDropdownValue;
  dropdownSelectInput.value = newDropdownValue;

  // Update dropdown list display (and calculate variables necessary to determine position of
  // tick)
  for (var i = 0; i < dropdownListItems.length; i += 1) {
    if (dropdownListItems[i] !== e.target) {
      dropdownListItems[i].classList.remove('is--selected');
    }
    else {
      indexOfTargetListItem = i;
      dropdownListItems[i].classList.add('is--selected');
    }
  }
}
```
To change the dropdown into invalid or deactivated states is as simple as adding to CSS class to your dropdown element (i.e. the element to which you apply `yourDropdownClass`):

``` 
<!-- Invalid dropdown -->
<div class="yourDropdownClass is--invalid">
    <label>Some input label</label>
    <div class="dropdown__inner" id="dropdown-container">
      // Your other HTML here
    </div>
    <p class="dropdown__error">
      You did something wrong.
    </p>
</div>

<!-- Deactivated dropdown -->
<div class="yourDropdownClass is--deactivated">
    <label>Some input label</label>
    <div class="dropdown__inner" id="dropdown-container">
      // Your other HTML here
    </div>
</div>

```

### [Custom dropdown](#markdown-header-custom-dropdown) [^](#markdown-header-modules)

`dropdown-custom(font-size, color, background, use-custom-dropdown-list-on-mobile, can-be-invalid, label-color, border-color, focus-border-color, list-item-color, list-max-height)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| font-size   | Number with unit | The size of the text in the dropdown. | Any number with unit (e.g. `1rem`, `16px`) | 1rem | No |
| color   | Color    | The colour of text in the dropdown menu. | Any color (e.g. `#fff`) | `#232323` (i.e. `$color__mine-shaft`) | No |
| background   | Color    | The colour of background of the dropdown menu. | Any color (e.g. `#fff`) | `#fff` | No |
| use-custom-dropdown-list-on-mobile   | Boolean    | Boolean to indicate whether to use the custom dropdown list (rather than the built-in `select` element functionality) on mobile devices. (Built-in functionality is often more usable on mobile.) | `false` or `true` | `false` | No |
| can-be-invalid | Boolean    | Boolean indicating whether to include `is--invalid` state styles. | `false` or `true` | `false` | No |
| label-color   | Color    | The colour of the dropdown menu's label. | Any color (e.g. `#fff`) | `#232323` (i.e. `$color__mine-shaft`) | No |
| border-color   | Color    | The colour of the dropdown elements border. | Any color (e.g. `#fff`) | `#949697` (i.e. `$color__border-gray`) | No |
| focus-border-color   | Color    | The colour of the dropdown elements border when it is selected or in hover state. | Any color (e.g. `#fff`) | `#096dd2` (i.e. `$color__action`) | No |
| list-item-color   | Color    | The colour of list item text. | Any color (e.g. `#fff`) | `#232323` (i.e. `$color__mine-shaft`) | No |
| list-max-height  | Number with unit | The maximum height of the custom dropdown list. | Any number with unit (e.g. `1rem`, `16px`) | `250px` | No |

A custom dropdown menu.

You can use this style as follows.

Example SCSS:
```
.yourDropdownClass {
  @include dropdown-custom(
    1.5rem,                  // font-size
    #fff,                    // color
    $color__action,          // background
    true,                    // use-custom-dropdown-list-on-mobile
    true,                    // can-be-invalid
    $color__action,          // label-color
    $color__blue--very-dark, // border-color
    $color__blue--light,     // focus-border-color
    #fff,                    // list-item-color
    350px                    // list-max-height
  );
}
```

Example HTML and example JavaScript would be the same as for the above [Standard dropdown](#markdown-header-standard-dropdown) mix-in.

## [Scrollbar](#markdown-header-scrollbar) [^](#markdown-header-modules)

A couple of mix-ins to help users implement product-style-like scrollbars as quickly as possible.

**Note:** These styles are only valid on webkit browsers (i.e. Chrome and Safari, for the most part).

### [Standard scrollbar](#markdown-header-standard-scrollbar) [^](#markdown-header-modules)

`scrollbar(style)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style   | String    | A string describing the style of scrollbar. | `"standard"` | `"standard"` | No |

You can use the mix-in as follows.

Example SCSS:
```
.yourScrollableContainerClass {
  @include scrollbar("standard");
}
```
Example HTML:
```
<div class="yourScrollableContainerClass">
  <!-- Lots of elements -->
</div>
```

### [Custom scrollbar](#markdown-header-custom-scrollbar) [^](#markdown-header-modules)

`custom-scrollbar(width, track-color, thumb-color, track-border-radius, thumb-border-radius)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| width   | Number with unit    | Width of the scrollbar. | Any value number and unit (e.g. `16px`, `1rem`) | `10px` | No |
| track-color   | Color    | Colour of the scrollbar track. | Any valid colour (e.g. `#fff`) | `#d7dbe3` (i.e. `$color__mischka`) | No |
| thumb-color   | Color    | Color of the scrollbar thumb | Any valid colour (e.g. `#fff`) | `#096dd2` (i.e. `$color__action`) | No |
| track-border-radius   | Number with unit    | Border radius of the scrollbar track | Any value number and unit (e.g. `16px`, `1rem`) | `5px` | No |
| thumb-border-radius   | Number with unit    | Border radius of the scrollbar thumb | Any value number and unit (e.g. `16px`, `1rem`) | `5px` | No |

You can use the mix-in as follows.

Example SCSS: 
```
.yourScrollableContainerClass {
  @include scrollbar-custom(20px, red, blue, 10px, 5px);
}
```

Example  HTML would be the same as for the above [Standard scrollbar](#markdown-header-standard-scrollbar) style.

## [Fancy radio](#markdown-header-fancy-radio) [^](#markdown-header-modules)

A pair of mix-ins to help users implement tab-like 'fancy' radio buttons.

All mix-ins result in radio button collections that can signify the buttons are deactivated (apply the '.is--deactivated' class).

### [Standard fancy radio](#markdown-header-standard-fancy-radio) [^](#markdown-header-modules)

`fancy-radio(style)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style   | String    | A string describing the style of fancy radio button collection. | `"standard"` and `"standard--dark"` | `"standard"` | No |

A standard fancy radio button collection.

You can use this style as follows.

Example SCSS:
```
.yourFancyRadioClass {
  @include fancy-radio('standard');
}
```

Example HTML:
```
<div class="fancy-radio">
  <p>
    Options label
  </p>
  <div>
    <input 
      type="radio" 
      name="options" 
      id="option-1"
      value="option-1"
      checked>
    <label 
      for="option-1">
      Option 1
    </label>
    <input 
      type="radio" 
      name="options" 
      id="option-2"
      value="option-2">
    <label 
      for="option-2">
      Option 2
    </label>
    <input 
      type="radio" 
      name="options" 
      id="option-3"
      value="option-3">
    <label 
      for="option-3">
      Option 3
    </label>
    <input 
      type="radio" 
      name="options" 
      id="option-4"
      value="option-4">
    <label 
      for="option-4">
      Option 4
    </label>
    <input 
      type="radio" 
      name="options" 
      id="option-5"
      value="option-5">
    <label 
      for="option-5">
      Option 5
    </label>
  </div>
</div>
```

### [Custom fancy radio](#markdown-header-custom-fancy-radio) [^](#markdown-header-modules)

`fancy-radio-custom(font-size, color, checked-color, background, checked-background, hover-background, internal-border, external-border, label-color)`

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| font-size   | Number with unit | The size of the text in the fancy radio buttons. | Any number with unit (e.g. `1rem`, `16px`) | 1rem | No |
| color   | Color    | The colour of text in the fancy radio buttons. | Any color (e.g. `#fff`) | `#096dd2` (i.e. `$color__action`) | No |
| checked-color   | Color    | The colour of text in the fancy radio buttons when checked. | Any color (e.g. `#fff`) | `#fff` | No |
| background   | Color    | The colour of background of the fancy radio buttons. | Any color (e.g. `#fff`) | `#fff` | No |
| checked-background   | Color    | The colour of background of the fancy radio buttons when checked. | Any color (e.g. `#fff`) | `#096dd2` (i.e. `$color__action`) | No |
| hover-background   | Color    | The colour of background of the fancy radio buttons when hovered. | Any color (e.g. `#fff`) | `#eee` | No |
| internal-border | Border property | The border property used to seperate the fancy radio buttons internally. | Any valid border property (e.g. `1px solid red`) | `1px solid #949697` (i.e. `$color__border-gray`) | No |
| external-border | Border property | The border property that seperates the collection of fancy radio buttons of their surroundings. | Any valid border property (e.g. `1px solid red`) | `1px solid #949697` (i.e. `$color__border-gray`) | No |
| label-color   | Color    | Colour of the radio button group's label's text | Any color (e.g. `#fff`) | `#232323` (i.e. `$color__mine-shaft`) | No |

A custom fancy radio button collection.

You can use this style as follows.

Example SCSS:
```
.yourFancyRadioClass {
  @include fancy-radio-custom(
    15px,                           // font-size
    $color__action,                 // color
    #fff,                           // checked-color
    #fff,                           // background
    $color__action,                 // checked-background
    #eee,                           // hover-background
    1px solid $color__border-gray,  // internal-border
    1px solid $color__border-gray,  // external-border
    $color__mine-shaft              // label-color
  );
}
```

Example HTML and example JavaScript would be the same as for the above [Standard fancy radio](#markdown-header-standard-fancy-radio) mix-in.

-----



