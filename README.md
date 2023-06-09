# ld-redux

> **A library to integrate launch darkly with react redux** :clap:

[Launch Darkly](https://launchdarkly.com/faq.html) is a great tool for feature flagging and a/b testing. It has a fully capable [client-side javascript sdk](https://github.com/launchdarkly/js-client), so why this package?

yusinto stopped maintaining [yusinto/ld-redux](https://github.com/yusinto/ld-redux). This repo picks up where yusinto left off and migrates the launchdarkly [client-side javascript sdk](https://github.com/launchdarkly/js-client) from `^2.13.0` to `^3.1.3`.

NOTE: if you're coming from [yusinto/ld-redux](https://github.com/yusinto/ld-redux) please update your user to a user context see [migration documentation](https://docs.launchdarkly.com/sdk/client-side/javascript/migration-2-to-3#understanding-differences-between-users-and-contexts) (if no context is passed a we will generate a default user context)

Also, update ldRedux.init to:

```
ldRedux.init({
        clientSideId,
        dispatch,
        context // previously this was user see migration documentation above
      });
```
