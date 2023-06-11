# ld-redux

> **A library to integrate launch darkly with react redux** :clap:

Huge shout-out to yusinto. He created the base of this package and if he resumes maintaining I would happily continue to contribute to [yusinto/ld-redux](https://github.com/yusinto/ld-redux). Unfortunately, it looks like yusinto stopped maintaining [yusinto/ld-redux](https://github.com/yusinto/ld-redux) and that probably why you're here...

[Launch Darkly](https://launchdarkly.com/faq.html) is a great tool for feature flagging and a/b testing. It has a fully capable [client-side javascript sdk](https://github.com/launchdarkly/js-client), so why this package?

 This repo picks up where yusinto left off and migrates the launchdarkly [client-side javascript sdk](https://github.com/launchdarkly/js-client) from `^2.13.0` to `^3.1.3`.

NOTE: if you're coming from [yusinto/ld-redux](https://github.com/yusinto/ld-redux) please update your user to a user context see [migration documentation](https://docs.launchdarkly.com/sdk/client-side/javascript/migration-2-to-3#understanding-differences-between-users-and-contexts) (if no context is passed a we will generate a default user context)

Also, update ldRedux.init to:

```
ldRedux.init({
        clientSideId,
        dispatch,
        context // previously this was user see migration documentation above
        ...
      });
```

and add `"ld-redux": "svey/ld-redux#{commit_sha from this repo}"` to your dependencies. (I hope to make this an npm module by EOY (2023) but I have a lot going on! Feel free to contribute if you like)
