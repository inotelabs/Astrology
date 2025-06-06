---
title: Eendpoint
slug: endpoint
description: Learn how to create endpoints that serve any kind of data
category:
  - There
tags:
  - Tailwind
  - Astro
  - Jamstack
pubDate: 2023-09-01
cover: https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?w=1960&h=1102&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGJsYWNrfGVufDB8MHwwfHx8Mg%3D%3D
coverAlt: Astrology-Aliases
author: VV
---

Astro lets you create custom endpoints to serve any kind of data. You can use this to generate images, expose an RSS document, or use them as API Routes to build a full API for your site.

In statically-generated sites, your custom endpoints are called at build time to produce static files. If you opt in to [SSR](/en/guides/server-side-rendering/) mode, custom endpoints turn into live server endpoints that are called on request. Static and SSR endpoints are defined similarly, but SSR endpoints support additional features.

## Static File Endpoints

To create a custom endpoint, add a `.js` or `.ts` file to the `/pages` directory. The `.js` or `.ts` extension will be removed during the build process, so the name of the file should include the extension of the data you want to create. For example, `src/pages/data.json.ts` will build a `/data.json` endpoint.

Endpoints export a `GET` function (optionally `async`) that receives a [context object](/en/reference/api-reference/#endpoint-context) with properties similar to the `Astro` global. Here, it returns a Response object with a `name` and `url`, and Astro will call this at build time and use the contents of the body to generate the file.

```ts
// Example: src/pages/builtwith.json.ts
// Outputs: /builtwith.json
export async function GET({ params, request }) {
  return new Response(
    JSON.stringify({
      name: "Astro",
      url: "https://astro.build/",
    }),
  );
}
```

Since Astro v3.0, the returned `Response` object doesn't have to include the `encoding` property anymore. For example, to produce a binary png image:

```ts title="src/pages/astro-logo.png.ts" {3}
export async function GET({ params, request }) {
  const response = await fetch(
    "https://docs.astro.build/assets/full-logo-light.png",
  );
  return new Response(await response.arrayBuffer());
}
```

You can also type your endpoint functions using the `APIRoute` type:

```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {...}
```

### `params` and Dynamic routing

Endpoints support the same [dynamic routing](/en/core-concepts/routing/#dynamic-routes) features that pages do. Name your file with a bracketed parameter name and export a [`getStaticPaths()` function](/en/reference/api-reference/#getstaticpaths). Then, you can access the parameter using the `params` property passed to the endpoint function:

```ts title="src/pages/api/[id].json.ts"
import type { APIRoute } from "astro";

const usernames = ["Sarah", "Chris", "Yan", "Elian"];

export const GET: APIRoute = ({ params, request }) => {
  const id = params.id;
  return new Response(
    JSON.stringify({
      name: usernames[id],
    }),
  );
};

export function getStaticPaths() {
  return [
    { params: { id: "0" } },
    { params: { id: "1" } },
    { params: { id: "2" } },
    { params: { id: "3" } },
  ];
}
```

This will generate four JSON endpoints at build time: `/api/0.json`, `/api/1.json`, `/api/2.json` and `/api/3.json`. Dynamic routing with endpoints works the same as it does with pages, but because the endpoint is a function and not a component, [props](/en/reference/api-reference/#data-passing-with-props) aren't supported.

### `request`

All endpoints receive a `request` property, but in static mode, you only have access to `request.url`. This returns the full URL of the current endpoint and works the same as [Astro.request.url](/en/reference/api-reference/#astrorequest) does for pages.

```ts title="src/pages/request-path.json.ts"
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      path: new URL(request.url).pathname,
    }),
  );
};
```

## Server Endpoints (API Routes)

Everything described in the static file endpoints section can also be used in SSR mode: files can export a `GET` function which receives a [context object](/en/reference/api-reference/#endpoint-context) with properties similar to the `Astro` global.

But, unlike in `static` mode, when you configure `server` mode, the endpoints will be built when they are requested. This unlocks new features that are unavailable at build time, and allows you to build API routes that listen for requests and securely execute code on the server at runtime.

<RecipeLinks slugs={["en/recipes/call-endpoints" ]}/>

:::note
Be sure to [enable SSR](/en/guides/server-side-rendering/) before trying these examples.
:::

Server endpoints can access `params` without exporting `getStaticPaths`, and they can return a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object, allowing you to set status codes and headers:

```js title="src/pages/[id].json.js"
import { getProduct } from "../db";

export async function GET({ params }) {
  const id = params.id;
  const product = await getProduct(id);

  if (!product) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

This will respond to any request that matches the dynamic route. For example, if we navigate to `/helmet.json`, `params.id` will be set to `helmet`. If `helmet` exists in the mock product database, the endpoint will use create a `Response` object to respond with JSON and return a successful [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/API/Response/status). If not, it will use a `Response` object to respond with a `404`.

In SSR mode, certain providers require the `Content-Type` header to return an image. In this case, use a `Response` object to specify a `headers` property. For example, to produce a binary `.png` image:

```ts title="src/pages/astro-logo.png.ts"
export async function GET({ params, request }) {
  const response = await fetch(
    "https://docs.astro.build/assets/full-logo-light.png",
  );
  const buffer = Buffer.from(await response.arrayBuffer());
  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
```

### HTTP methods

In addition to the `GET` function, you can export a function with the name of any [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). When a request comes in, Astro will check the method and call the corresponding function.

You can also export an `ALL` function to match any method that doesn't have a corresponding exported function. If there is a request with no matching method, it will redirect to your site's [404 page](/en/core-concepts/astro-pages/#custom-404-error-page).

```ts title="src/pages/methods.json.ts"
export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      message: "This was a GET!",
    }),
  );
};

export const POST: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: "This was a POST!",
    }),
  );
};

export const DELETE: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: "This was a DELETE!",
    }),
  );
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: `This was a ${request.method}!`,
    }),
  );
};
```

<RecipeLinks slugs={["en/recipes/captcha", "en/recipes/build-forms-api" ]}/>

### `request`

In SSR mode, the `request` property returns a fully usable [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object that refers to the current request. This allows you to accept data and check headers:

```ts title="src/pages/test-post.json.ts"
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const name = body.name;
    return new Response(
      JSON.stringify({
        message: "Your name was: " + name,
      }),
      {
        status: 200,
      },
    );
  }
  return new Response(null, { status: 400 });
};
```

### Redirects

The endpoint context exports a `redirect()` utility similar to `Astro.redirect`:

```js title="src/pages/links/[id].js" {14}
import { getLinkUrl } from "../db";

export async function GET({ params, redirect }) {
  const { id } = params;
  const link = await getLinkUrl(id);

  if (!link) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return redirect(link, 307);
}
```
