'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _commentParser = require('comment-parser');

var _commentParser2 = _interopRequireDefault(_commentParser);

var _jsdocUtils = require('./jsdocUtils');

var _jsdocUtils2 = _interopRequireDefault(_jsdocUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var curryUtils = function curryUtils(functionNode, jsdoc, tagNamePreference, additionalTagNames) {
  var utils = {};

  utils.getFunctionParameterNames = function () {
    return _jsdocUtils2.default.getFunctionParameterNames(functionNode);
  };

  utils.getJsdocParameterNamesDeep = function () {
    return _jsdocUtils2.default.getJsdocParameterNamesDeep(jsdoc, utils.getPreferredTagName('param'));
  };

  utils.getJsdocParameterNames = function () {
    return _jsdocUtils2.default.getJsdocParameterNames(jsdoc, utils.getPreferredTagName('param'));
  };

  utils.getPreferredTagName = function (name) {
    return _jsdocUtils2.default.getPreferredTagName(name, tagNamePreference);
  };

  utils.isValidTag = function (name) {
    return _jsdocUtils2.default.isValidTag(name, additionalTagNames);
  };

  utils.hasTag = function (name) {
    return _jsdocUtils2.default.hasTag(jsdoc, name);
  };

  return utils;
};

exports.default = function (iterator) {
  return function (context) {
    var sourceCode = context.getSourceCode();
    var tagNamePreference = _lodash2.default.get(context, 'settings.jsdoc.tagNamePreference') || {};
    var additionalTagNames = _lodash2.default.get(context, 'settings.jsdoc.additionalTagNames') || {};

    var checkJsdoc = function checkJsdoc(functionNode) {
      var jsdocNode = sourceCode.getJSDocComment(functionNode);

      if (!jsdocNode) {
        return;
      }

      // Preserve JSDoc block start/end indentation.
      var indent = _lodash2.default.repeat(' ', jsdocNode.loc.start.column);
      var jsdoc = (0, _commentParser2.default)(indent + '/*' + jsdocNode.value + indent + '*/', {
        // @see https://github.com/yavorskiy/comment-parser/issues/21
        parsers: [_commentParser2.default.PARSERS.parse_tag, _commentParser2.default.PARSERS.parse_type, function (str, data) {
          if (_lodash2.default.includes(['return', 'returns'], data.tag)) {
            return null;
          }

          return _commentParser2.default.PARSERS.parse_name(str, data);
        }, _commentParser2.default.PARSERS.parse_description]
      })[0] || {};

      var report = function report(message) {
        var fixer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (fixer === null) {
          context.report(jsdocNode, message);
        } else {
          context.report({
            fix: fixer,
            message,
            node: jsdocNode
          });
        }
      };

      var utils = curryUtils(functionNode, jsdoc, tagNamePreference, additionalTagNames);

      iterator({
        context,
        functionNode,
        indent,
        jsdoc,
        jsdocNode,
        report,
        sourceCode,
        utils
      });
    };

    return {
      ArrowFunctionExpression: checkJsdoc,
      FunctionDeclaration: checkJsdoc,
      FunctionExpression: checkJsdoc
    };
  };
};

module.exports = exports['default'];
//# sourceMappingURL=iterateJsdoc.js.map