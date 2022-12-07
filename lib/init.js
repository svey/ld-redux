'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _launchdarklyJsClientSdk = require('launchdarkly-js-client-sdk');

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _ip = require('ip');

var _ip2 = _interopRequireDefault(_ip);

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

var _actions = require('./actions');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var userAgentParser = new _uaParserJs2.default();
var isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
var isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

// initialise flags with default values in ld redux store
var initFlags = function initFlags(flags, dispatch, useCamelCaseFlagKeys) {
  var flagValues = { isLDReady: false };
  for (var flag in flags) {
    if (useCamelCaseFlagKeys) {
      var camelCasedKey = (0, _lodash2.default)(flag);
      flagValues[camelCasedKey] = flags[flag];
    } else {
      flagValues[flag] = flags[flag];
    }
  }
  dispatch((0, _actions.setFlags)(flagValues));
};

// set flags with real values from ld server
var setFlags = function setFlags(flags, dispatch, useCamelCaseFlagKeys) {
  var flagValues = { isLDReady: true };
  for (var flag in flags) {
    var flagKey = useCamelCaseFlagKeys ? (0, _lodash2.default)(flag) : flag;
    flagValues[flagKey] = ldClient.variation(flag, flags[flag]);
  }
  dispatch((0, _actions.setFlags)(flagValues));
};

var subscribeToChanges = function subscribeToChanges(flags, dispatch, useCamelCaseFlagKeys) {
  var _loop = function _loop(flag) {
    var flagKey = useCamelCaseFlagKeys ? (0, _lodash2.default)(flag) : flag;
    ldClient.on('change:' + flag, function(current) {
      var newFlagValue = {};
      newFlagValue[flagKey] = current;
      dispatch((0, _actions.setFlags)(newFlagValue));
    });
  };

  for (var flag in flags) {
    _loop(flag);
  }
};

var initUserContext = function initUserContext() {
  var device = void 0;
  return {
    kind: 'user',
    key: _uuid2.default.v4(),
    ip: _ip2.default.address(),
    browser: userAgentParser.getResult().browser.name,
    device: isMobileDevice ? 'mobile' : isTabletDevice ? 'tablet' : 'desktop',
  };
};

exports.default = function(_ref) {
  var clientSideId = _ref.clientSideId,
    dispatch = _ref.dispatch,
    flags = _ref.flags,
    _ref$useCamelCaseFlag = _ref.useCamelCaseFlagKeys,
    useCamelCaseFlagKeys = _ref$useCamelCaseFlag === undefined ? true : _ref$useCamelCaseFlag,
    context = _ref.context,
    subscribe = _ref.subscribe,
    options = _ref.options;

  initFlags(flags, dispatch, useCamelCaseFlagKeys);

  // default subscribe to true
  var sanitisedSubscribe = typeof subscribe === 'undefined' ? true : subscribe;

  if (!context) {
    context = initUserContext();
  }

  window.ldClient = (0, _launchdarklyJsClientSdk.initialize)(clientSideId, context, options);
  window.ldClient.on('ready', function() {
    var flagsSanitised = flags || ldClient.allFlags();
    setFlags(flagsSanitised, dispatch, useCamelCaseFlagKeys);

    if (sanitisedSubscribe) {
      subscribeToChanges(flagsSanitised, dispatch, useCamelCaseFlagKeys);
    }
  });
};
