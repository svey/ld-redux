# @svey/ld-redux

> **A library to integrate launch darkly with react redux** :clap:

Huge shout-out to yusinto. He created the base of this package and if he resumes maintaining I would happily integrate my updates into [yusinto/ld-redux](https://github.com/yusinto/ld-redux). Unfortunately, it looks like yusinto stopped maintaining [yusinto/ld-redux](https://github.com/yusinto/ld-redux) and that's probably why you're here...

[Launch Darkly](https://launchdarkly.com/faq.html) is a great tool for feature flagging and a/b testing. It has a fully capable [client-side javascript sdk](https://github.com/launchdarkly/js-client), so why this package?

 This repo picks up where yusinto left off and migrates the launchdarkly [client-side javascript sdk](https://github.com/launchdarkly/js-client) from `^2.13.0` to `^3.1.3`.

 **[NPM](https://www.npmjs.com/package/@svey/ld-redux)**

 npm i @svey/ld-redux

# Upgrade from yusinto/ld-redux

Update your user to a user context see [migration documentation](https://docs.launchdarkly.com/sdk/client-side/javascript/migration-2-to-3#understanding-differences-between-users-and-contexts) (if no context is passed a user context will be generated)

Update `ldRedux.init` to:

```javascript
ldRedux.init({
        clientSideId,
        dispatch,
        context // previously this was user see migration documentation above
        ...
      });
```

# Initializing ld-redux

1. In your client bootstrap, initialise the launch darkly client by invoking the init method:

 ```javascript
 import ldRedux from '@svey/ld-redux';
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

2. Include ldReducer as one of the reducers in your app:

    ```javascript
    import { combineReducers } from 'redux';
    import ldRedux from 'ld-redux';
    import reducers from '<your-project>/reducers';

    export default combineReducers({
      ...reducers,
      LD: ldRedux.reducer(), // Note: the LD key can be anything you want
    });
    ```

3. Use the flag:

    ```javascript
    import React, {Component} from 'react';
    import {connect} from 'react-redux';

    const mapStateToProps = (state) => {
      const {featureFlagKey} = state.LD; // Note: the key LD must be the same as step 2.

      return {
        featureFlagKey,
      };
    };

    @connect(mapStateToProps)
    export default class Home extends Component {
      render() {
        return (
          <div>
            {
              /* look ma, feature flag! */
              this.props.featureFlagKey ?
                <div>
                  <p>Welcome to feature toggling!</p>
                </div>
                :
                'nothing'
            }
          </div>
        );
      }
    }
    ```

## API
### init({clientSideId, dispatch, flags, useCamelCaseFlagKeys, context, subscribe, options})
The init method accepts an object with the above properties. `clientSideId`, `dispatch` are mandatory.

The `flags` property is optional. This is an object containing all the flags you want to use and subscribe to in your app.
If you don't specify this, ld-redux will subscribe to all flags in your ld environment.

```javascript
// standard redux createStore
const store = createStore();
const flags = { 'feature-flag-key': false }; // only subscribe to  this one flag

// do this once
ldRedux.init({
  clientSideId: 'your-client-side-id',
  dispatch: store.dispatch,
  flags,
});
```

The `subscribe` property is optional. This defaults to true which means by default you'll get automatic live updates
of flag changes from the server. You can turn this off and manually subscribe to flag changes through the ldClient
object if for some reason you don't want to get live updates.

The `context` property is optional. You can initialise the sdk with a custom context by specifying one. If you don't specify a context object, ldRedux will create a default [user context](https://docs.launchdarkly.com/sdk/features/user-context-config ) that looks like this:

```javascript
const context = {
  kind: 'user',
  key: 'user-key-123abc',
  firstName: 'Sandy',
  lastName: 'Smith',
  email: 'sandy@example.com',
  groups: ['Google', 'Microsoft']
};
```

For more info on context object, see [here](https://docs.launchdarkly.com/home/contexts#contexts-and-context-kinds).

The `useCamelCaseFlagKeys` property is optional. This defaults to true which means by default the flags that are stored
in redux will be camel cased. If this property is false, no transformation on the flag name will be done.

The `options` property is optional. It can be used to pass in extra options such as [Bootstrapping](https://github.com/launchdarkly/js-client#bootstrapping).
For example:

```javascript
ldRedux.init({
    clientSideId,
    dispatch,
    flags,
    options: {
      bootstrap: 'localStorage',
    }
});
```

### reducer()
This is ld-redux's reducer. You must include this reducer in your app as per step 2 above with any key of your choice.
You then use this key to retrieve your flags from redux's state.

### window.ldClient
Internally the ldRedux.init method above initialises the js sdk and stores the resultant ldClient object in window.ldClient. You can use
this object to access the [official sdk methods](https://github.com/launchdarkly/js-client) directly. For example, you can do things like:

```javascript
// track goals
window.ldClient.track('add to cart');

// change user context
window.ldClient.identify({key: 'someUserId'});
```

For more info on changing user context, see the [official documentation](http://docs.launchdarkly.com/docs/js-sdk-reference#section-changing-the-user-context).

### isLDReady
You no longer need to deal with `isLDReady`. However if you need to, it is still available in the store. You can access it via
the LD state like so:

```javascript
const mapStateToProps = (state) => {
  const {isLDReady} = state.LD; // Note: the key LD must be the same as step 2.

  return {
    isLDReady,
  };
};
```

This is useful to solve "flickering" issues above the fold on your front page caused by a flag transitioning from a default false value
to true.

## Example
Check the [example](https://github.com/yusinto/ld-redux/tree/master/example) by yusinto for a fully working spa with 
react, redux and react-router. Remember to enter your client side sdk in the client [bootstrap file](https://github.com/yusinto/ld-redux/blob/master/example/src/client/index.js) 
before running the example!

**Please feel free to open issues and PRs!**

