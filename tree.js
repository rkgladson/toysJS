/*globals angular*/
/**
 * Created by rgladson on 7/8/2015.
 * Just because the language is javascript, there is no excuse to write bad code!�
 */
(function (namespace, undefined) {
  "use strict";

  var treePrototype = {
    beget: function beget(value) {
      var node = buildNode(value);
      node.parent = this;
      this.children.push(node);
      return node;
    },
    adopt: function adopt(child) {
      if (treePrototype.isPrototypeOf(child)) {
        child.prune();
        child.parent = this;
        this.children.push(child);
      }
      return child;
    },
    prune: function () {
      var siblings, idx;
      if (this.parent) {
        siblings = this.parent.children;
        idx = siblings.indexOf(this);
        if (~idx) {
          siblings.splice(idx, 1);
        }
        this.parent = null;
      }
      return this;
    },
    containedBy: function (value) {
      var nextParent = this.parent;
      while(nextParent) {
        if (nextParent.value === value) {
          return true;
        }
        nextParent = nextParent.parent;
      }
      return false;
    },
    contains: function contains(value) {
      return this.children.some(function searchChild(child) {
        return this.value === value || child.contains(value);
      });
    },
    isSiblingOf: function isSiblingOf(instance) {
      return Boolean(this.parent && ~this.parent.children.indexOf(instance));
    },
    isDescendantOf: function isDescendantOf(instance) {
      var nextParent = this.parent;
      while(nextParent) {
        if (nextParent === instance) {
          return true;
        }
        nextParent = nextParent.parent;
      }
      return false;
    },
    actOnParents: function (action) {
      var doNotStop = true, origin = this,
        nextParent = this.parent;
      function stop() {
        doNotStop = false;
      }
      while(doNotStop && nextParent) {
        action(nextParent, origin, stop);
        nextParent = nextParent.parent;
      }
      return this;
    },
    actOnDescendants: function (action) {
      var doNotStop = true, origin = this;
      function stop() {
        doNotStop = false;
      }
      function forTheChildren(children) {
        var childIdx;
        for (childIdx = children.length - 1; doNotStop && 0 <= childIdx; childIdx -=1) {
          action(children[childIdx], origin, stop);
          forTheChildren(children[childIdx]);
        }
      }
      forTheChildren(this.children);
      return this;
    },
    value: null, // Some Value
    parent: null, // Object
    children: null, // Array
    flatten: function flatten() {
      return [this.value].concat(this.children.map(function (child) {
        return child.flatten();
      }));
    },
    toString: function toString() {
      return '[object TreeNode]';
    },
    toJSON: function () {
      return {
        type: this.toString(),
        value: this.value,
        children: this.children
      };
    }
  };

  function buildNode(item) {
    return Object.create(treePrototype, {
      value: {
        value: item
      },
      children: {
        value: [],
        enumerable: true
      }
    });
  }
  function newTree(rootValue) {
    return buildNode(rootValue);
  }

  namespace.newTree = newTree;
})(crazyLikeAFox);