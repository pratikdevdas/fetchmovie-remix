# Welcome to Remix

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

### My Notes

0)format code with prettier and lint ignore are in package.json

1)So I was having this vague error and fetcher came to rescue. I was using a form without fetcher and it took me a while to wrap my head around it. Whenever a submission happened it used to make re-request causing same id in multiple list problem and loading the same movies in a particular page again in my DOM.
After getting mad for a while I finally saw a video of Remix single Concurrent Submissions which helped me to understand that if I use a fetcher it will automatically sync my data with the UI when a MUTATION IS HAPPENING WITHIOUT NAVIGATION. Very awesome. The conclusion if the page is changing on mutation use a Normal Remix form or if there are multiple mutation in a single page use a fetcher form.

2)You might see that there is a ? index query while making scroll navigation in MovieList, checkout: <https://remix.run/docs/en/1.19.1/guides/routing#what-is-the-index-query-param> Conclusion: index query param is telling my page that the request is happening in index route. Also, I the wl param query was getting concatenated to the previous param query . Using index in the query helped me to solve this. The idea generated after seeing this issue:<https://github.com/remix-run/remix/issues/3998>

3)The Hydration Error is still there to fix as the biggest problem in react is that it switches to client side buiding if hydration fails. Check the subscribed issue(notification) in github.

4)Fetcher data clears automatically on posting an action so I had to initiate an useState to store the Fetcher Data page value before it clears so that I can use the newPage value to update state in MovieList InfiniteScroll component
