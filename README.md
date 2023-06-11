# ld-redux

> **A library to integrate launch darkly with react redux** :clap:

Huge shout-out to yusinto. He created the base of this package and if he resumes maintaining I would happily integrate my updates into [yusinto/ld-redux](https://github.com/yusinto/ld-redux). Unfortunately, it looks like yusinto stopped maintaining [yusinto/ld-redux](https://github.com/yusinto/ld-redux) and that's probably why you're here...

[Launch Darkly](https://launchdarkly.com/faq.html) is a great tool for feature flagging and a/b testing. It has a fully capable [client-side javascript sdk](https://github.com/launchdarkly/js-client), so why this package?

 This repo picks up where yusinto left off and migrates the launchdarkly [client-side javascript sdk](https://github.com/launchdarkly/js-client) from `^2.13.0` to `^3.1.3`.

 **NPM Install**

 npm i @svey/ld-redux

**Upgrade from yusinto/ld-redux**

Update your user to a user context see [migration documentation](https://docs.launchdarkly.com/sdk/client-side/javascript/migration-2-to-3#understanding-differences-between-users-and-contexts) (if no context is passed a user context will be generated)

Update `ldRedux.init` to:

```
ldRedux.init({
        clientSideId,
        dispatch,
        context // previously this was user see migration documentation above
        ...
      });
```

**New to ld-redux**
Your code should look something like this

```
import ldRedux from 'ld-redux';
import flags from '../flags';
import reduxState from '../store/state';

const store = createStore(reduxState);

const context = {
  kind: 'user',
  key: 'user-key-123abc',
  firstName: 'Sandy',
  lastName: 'Smith',
  email: 'sandy@example.com',
  groups: ['Google', 'Microsoft']
}; // https://docs.launchdarkly.com/sdk/features/user-context-config 

ldRedux.init({
  clientSideId: '59b2b2596d1a250b1c78baa4',
  dispatch: store.dispatch,
  flags,
  context,
});
```

**Please feel free to open issues and PRs!**

