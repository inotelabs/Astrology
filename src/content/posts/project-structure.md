---
title: Project Structure
slug: project-structure
description: Learn how to structure a project with Astro.
category:
  - One
tags:
  - Tailwind
  - Astro
  - File
pubDate: 2023-09-01
cover: https://images.unsplash.com/photo-1501471984908-815b996862f4?w=1960&h=1102&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGJsYWNrfGVufDB8MHwwfHx8Mg%3D%3D
coverAlt: Astrology-Aliases
author: VV
---

Your new Astro project generated from the `create astro` CLI wizard already includes some files and folders. Others, you will create yourself and add to Astro's existing file structure.

Here's how an Astro project is organized, and some files you will find in your new project.

## Directories and Files

Astro leverages an opinionated folder layout for your project. Every Astro project root should include the following directories and files:

- `src/*` - Your project source code (components, pages, styles, etc.)
- `public/*` - Your non-code, unprocessed assets (fonts, icons, etc.)
- `package.json` - A project manifest.
- `astro.config.mjs` - An Astro configuration file. (recommended)
- `tsconfig.json` - A TypeScript configuration file. (recommended)

### Example Project Tree

A common Astro project directory might look like this:

<FileTree>
- public/
  - robots.txt
  - favicon.svg
  - social-image.png
- src/
  - components/
    - Header.astro
    - Button.jsx
  - layouts/
    - PostLayout.astro
  - pages/
    - posts/
      - post1.md
      - post2.md
      - post3.md
    - index.astro
  - styles/
    - global.css
- astro.config.mjs
- package.json
- tsconfig.json
</FileTree>

### `src/`

The `src/` folder is where most of your project source code lives. This includes:

- [Pages](/en/core-concepts/astro-pages/)
- [Layouts](/en/core-concepts/layouts/)
- [Astro components](/en/core-concepts/astro-components/)
- [UI framework components (React, etc.)](/en/core-concepts/framework-components/)
- [Styles (CSS, Sass)](/en/guides/styling/)
- [Markdown](/en/guides/markdown-content/)

Astro processes, optimizes, and bundles your `src/` files to create the final website that is shipped to the browser. Unlike the static `public/` directory, your `src/` files are built and handled for you by Astro.

Some files (like Astro components) are not even sent to the browser as written but are instead rendered to static HTML. Other files (like CSS) are sent to the browser but may be optimized or bundled with other CSS files for performance.

:::tip
While this guide describes some popular conventions used in the Astro community, the only directories reserved by Astro are `src/pages/` and `src/content/`. You are free to rename and reorganize any other directories in a way that works best for you.
:::

### `src/components`

**Components** are reusable units of code for your HTML pages. These could be [Astro components](/en/core-concepts/astro-components/), or [UI framework components](/en/core-concepts/framework-components/) like React or Vue. It is common to group and organize all of your project components together in this folder.

This is a common convention in Astro projects, but it is not required. Feel free to organize your components however you like!

### `src/content`

The `src/content/` directory is reserved to store [content collections](/en/guides/content-collections/) and an optional collections configuration file. No other files are allowed inside this folder.

### `src/layouts`

[Layouts](/en/core-concepts/layouts/) are Astro components that define the UI structure shared by one or more [pages](/en/core-concepts/astro-pages/).

Just like `src/components`, this directory is a common convention but not required.

### `src/pages`

[Pages](/en/core-concepts/astro-pages/) are a special kind of component used to create new pages on your site. A page can be an Astro component, or a Markdown file that represents some page of content for your site.

:::caution
`src/pages` is a **required** sub-directory in your Astro project. Without it, your site will have no pages or routes!
:::

### `src/styles`

It is a common convention to store your CSS or Sass files in a `src/styles` directory, but this is not required. As long as your styles live somewhere in the `src/` directory and are imported correctly, Astro will handle and optimize them.

### `public/`

The `public/` directory is for files and assets in your project that do not need to be processed during Astro's build process. The files in this folder will be copied into the build folder untouched, and then your site will be built.

This behavior makes `public/` ideal for common assets like images and fonts, or special files such as `robots.txt` and `manifest.webmanifest`.

You can place CSS and JavaScript in your `public/` directory, but be aware that those files will not be bundled or optimized in your final build.

:::tip
As a general rule, any CSS or JavaScript that you write yourself should live in your `src/` directory.
:::

### `package.json`

This is a file used by JavaScript package managers to manage your dependencies. It also defines the scripts that are commonly used to run Astro (ex: `npm start`, `npm run build`).

There are [two kinds of dependencies](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file) you can specify in a `package.json`: `dependencies` and `devDependencies`. In most cases, these work the same: Astro needs all dependencies at build time, and your package manager will install both. We recommend putting all of your dependencies in `dependencies` to start, and only use `devDependencies` if you find a specific need to do so.

For help creating a new `package.json` file for your project, check out the [manual setup](/en/install/manual/) instructions.

### `astro.config.mjs`

This file is generated in every starter template and includes configuration options for your Astro project. Here you can specify integrations to use, build options, server options, and more.

See the [Configuring Astro Guide](/en/guides/configuring-astro/) for details on setting configurations.

### `tsconfig.json`

This file is generated in every starter template and includes TypeScript configuration options for your Astro project. Some features (like npm package imports) aren’t fully supported in the editor without a `tsconfig.json` file.

See the [TypeScript Guide](/en/guides/typescript/) for details on setting configurations.
