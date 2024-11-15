# [Layouts](#markdown-header-layouts) [^](#markdown-header-fairfax-presentation-styles-library)

Here you'll find a range of mix-ins to be applied to 'layouts', defined more or less as they are in [Jonathan Snook's SMACSS methodology](https://smacss.com/book/categorizing):

> Layout rules divide the page into sections. Layouts hold one or more modules together.

In other words, here you'll find mix-ins for elements that contain many other elements, often laying them out in recognisable sections of a page (e.g. footers, headers, body sections and so on).

## Contents

* [Layouts](#markdown-header-layouts)
    * [Embedded interactive](#markdown-header-embedded-interactive)
    * [Feature article header](#markdown-header-feature-article-header)

## [Embedded interactive](#markdown-header-embedded-interactive) [^](#markdown-header-layouts)

`embedded-interactive()`

Default styles for element containing embedded interactive.

Your SCSS:

```
.yourEmbeddedInteractiveContainerClass {
  @include embedded-interactive;
}
```

Your HTML:

```
<div class="yourEmbeddedInteractiveContainerClass">
  <!-- Your application -->
</div>
```

## [Feature article header](#markdown-header-feature-article-header) [^](#markdown-header-layouts)

`feature-article-header(style, sharing-only-on-mobile, standard-typography-in-use)`

A mix-in that styles a container and its contents to become the header section of a long-form feature article, including the article's header, subtitle, author credits, date and header sharing buttons.

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| style    | String | String describing style of feature article header (e.g. 'standard' or 'standard--dark'). | 'standard' | No |
| sharing-only-on-mobile | Boolean | Boolean denoting whether or not feature article header sharing buttons wills be shown on devices larger than mobile | `true` or `false` | `true` | No |
| standard-typography-in-use | Boolean | Boolean indicating whether or not the 'standard-typography' mix-in is in use elsewhere in this style-sheet | `true` or `false` | `true` | No |

Your SCSS:

```
// The class of your feature article header
.yourFeatureArticleHeaderClass {
  @include feature-article-header("standard", true, false);
}
```

If you're using the `standard-typography` mix-in elsewhere in your style-sheet, you can set that last variable - the `false` - to `true`. When set to `true`, that parameter will make the `feature-article-header` mix-in assume that `standard-typography` is active, and so rely on styles associated with that mix-in, resulting in less-bloated styles.

For example: 

```
// The class of your feature article header
.yourFeatureArticleHeaderClass {
  @include feature-article-header("standard", true, true);
}
```

Your HTML:
```
<header class="yourFeatureArticleHeaderClass">

  <p class="feature-article-header__topic">
    <a href="/national">Your feature article's topic</a>
  </p>
  
  <h1 class="feature-article-header__title">
    Your feature article title here
  </h1>

  <div class="feature-article-header__break"></div>

  <!-- Article header social media sharing buttons -->
  <ul class="feature-article-header__social">
    <li class="feature-article-header__social__button social-button__facebook">
      <a href="javascript:void(0);">
        <span>Share on Facebook</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-facebook"></use>
        </svg>
      </a>
    </li>
    <li class="feature-article-header__social__button social-button__twitter">
      <a href="javascript:void(0);">
        <span>Share on Twitter</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-twitter"></use>
        </svg>
      </a>
    </li>
    <li class="feature-article-header__social__button social-button__whatsapp">
      <a href="javascript:void(0);">
        <span>Share on WhatsApp</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-whatsapp"></use>
        </svg>
      </a>
    </li>
    <li class="feature-article-header__social__button social-button__email">
      <a href="javascript:void(0);">
        <span>Share on Email</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-email"></use>
        </svg>
      </a>
    </li>
  </ul>

  <p class="feature-article-header__subtitle">
    Here, you'll input a subtitle of around a sentence in length, usually running over two lines..
  </p>

  <p class="feature-article-header__author">
    by Soren Frederiksen &amp; Donald Trump
  </p>

  <p class="feature-article-header__date">
    February 6, 2018
  </p>

</header>
```


## [Feature article header custom](#markdown-header-feature-article-header-custom) [^](#markdown-header-layouts)

`feature-article-header-custom(title-color, subtitle-color, topic-color, break-color, author-and-date-color, social-button-color, sharing-only-on-mobile, standard-typography-in-use)`

A mix-in that styles a container and its contents to become the header section of a long-form feature article, including the article's header, subtitle, author credits, date and header sharing buttons.

| Parameter name | Data type | Description | Options | Default | Required |
| -------------- | --------- | ----------- | ------- | ------- | -------- |
| title-color    | Color | Colour used to colour the feature header's title. | Any valid color | color__brand (i.e. `#0a1633`) | No |
| subtitle-color    | Color | Colour used to colour the feature header's subtitle. | Any valid color | color__mine-shaft (i.e. `#232323`) | No |
| topic-color    | Color | Colour used to colour the feature header's topic. | Any valid color | color__action (i.e. `#096dd2`) | No |
| break-color    | Color | Colour used to colour the feature header's break between its title, subtitle and other elements. | Any valid color | color__mischka (i.e. `#d7dbe3`) | No |
| author-and-date-color    | Color | Colour used to colour the feature header's author and date elements. | Any valid color | color__dove-gray (i.e. `#707070`) | No |
| social-button-color    | Color | Colour used to colour the feature header's social buttons. | Any valid color | color__brand (i.e. `#0a1633`) | No |
| sharing-only-on-mobile | Boolean | Boolean denoting whether or not feature article header sharing buttons wills be shown on devices larger than mobile | `true` or `false` | `true` | No |
| standard-typography-in-use | Boolean | Boolean indicating whether or not the 'standard-typography' mix-in is in use elsewhere in this style-sheet | `true` or `false` | `true` | No |

Your SCSS:

```
// The class of your feature article header
.yourFeatureArticleHeaderClass {
  @include feature-article-header-custom(red, blue, yellow, green, pink, orange, false, true);
}
```

If you're using the `standard-typography` mix-in elsewhere in your style-sheet, you can set that last variable - the `false` - to `true`. When set to `true`, that parameter will make the `feature-article-header` mix-in assume that `standard-typography` is active, and so rely on styles associated with that mix-in, resulting in less-bloated styles.

For example: 

```
// The class of your feature article header
.yourFeatureArticleHeaderClass {
  @include feature-article-header("standard", true, true);
}
```

Your HTML:
```
<header class="yourFeatureArticleHeaderClass">

  <p class="feature-article-header__topic">
    <a href="/national">Your feature article's topic</a>
  </p>
  
  <h1 class="feature-article-header__title">
    Your feature article title here
  </h1>

  <div class="feature-article-header__break"></div>

  <!-- Article header social media sharing buttons -->
  <ul class="feature-article-header__social">
    <li class="feature-article-header__social__button social-button__facebook">
      <a href="javascript:void(0);">
        <span>Share on Facebook</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-facebook"></use>
        </svg>
      </a>
    </li>
    <li class="feature-article-header__social__button social-button__twitter">
      <a href="javascript:void(0);">
        <span>Share on Twitter</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-twitter"></use>
        </svg>
      </a>
    </li>
    <li class="feature-article-header__social__button social-button__whatsapp">
      <a href="javascript:void(0);">
        <span>Share on WhatsApp</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-whatsapp"></use>
        </svg>
      </a>
    </li>
    <li class="feature-article-header__social__button social-button__email">
      <a href="javascript:void(0);">
        <span>Share on Email</span>
        <svg height="1em" width="1em" aria-hidden="true" focusable="false">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-email"></use>
        </svg>
      </a>
    </li>
  </ul>

  <p class="feature-article-header__subtitle">
    Here, you'll input a subtitle of around a sentence in length, usually running over two lines..
  </p>

  <p class="feature-article-header__author">
    by Soren Frederiksen &amp; Donald Trump
  </p>

  <p class="feature-article-header__date">
    February 6, 2018
  </p>

</header>
```

-----

