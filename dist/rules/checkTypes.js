'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _iterateJsdoc = require('./../iterateJsdoc');

var _iterateJsdoc2 = _interopRequireDefault(_iterateJsdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var targetTags = ['class', 'constant', 'enum', 'member', 'module', 'namespace', 'param', 'property', 'returns', 'throws', 'type', 'typedef'];

var targetTagAliases = ['constructor', 'const', 'var', 'arg', 'argument', 'prop', 'return', 'exception'];

targetTags = targetTags.concat(targetTagAliases);

var strictNativeTypes = ['boolean', 'number', 'string', 'Array', 'Object', 'RegExp', 'Date', 'Function'];

exports.default = (0, _iterateJsdoc2.default)(function (_ref) {
  var jsdoc = _ref.jsdoc,
      jsdocNode = _ref.jsdocNode,
      sourceCode = _ref.sourceCode,
      report = _ref.report;

  var jsdocTags = _lodash2.default.filter(jsdoc.tags, function (tag) {
    return _lodash2.default.includes(targetTags, tag.tag);
  });

  _lodash2.default.forEach(jsdocTags, function (jsdocTag) {
    _lodash2.default.some(strictNativeTypes, function (strictNativeType) {
      if (strictNativeType.toLowerCase() === jsdocTag.type.toLowerCase() && strictNativeType !== jsdocTag.type) {
        var fix = function fix(fixer) {
          return fixer.replaceText(jsdocNode, sourceCode.getText(jsdocNode).replace('{' + jsdocTag.type + '}', '{' + strictNativeType + '}'));
        };

        report('Invalid JSDoc @' + jsdocTag.tag + ' "' + jsdocTag.name + '" type "' + jsdocTag.type + '".', fix);

        return true;
      }

      return false;
    });
  });
});
module.exports = exports['default'];
//# sourceMappingURL=checkTypes.js.map