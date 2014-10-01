/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define*/
/*eslint no-use-before-define:0 */

/**
 * Internal LayoutNode class used by `LayoutController`.
 *
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var Transform = require('famous/core/Transform');
    var LayoutUtility = require('./LayoutUtility');

    /**
     * @class
     * @param {Object} renderNode Render-node which this layout-node represents
     * @alias module:LayoutNode
     */
    function LayoutNode(renderNode, spec) {
        this._spec = spec ? LayoutUtility.cloneSpec(spec) : {};
        this._spec.renderNode = renderNode;
        this._invalidated = false;
        this._removing = false;
    }

    /**
     * Called when the node is destroyed
     */
    LayoutNode.prototype.destroy = function() {
        // override to implement
    };

    /**
     * Reset the end-state. This function is called on all layout-nodes prior to
     * calling the layout-function. So that the layout-function starts with a clean slate.
     */
    LayoutNode.prototype.reset = function() {
        this._invalidated = false;
        var spec = this._spec;
        spec.trueSizeRequested = false;
        spec.size = undefined;
        spec.origin = undefined;
        spec.align = undefined;
        spec.translate = undefined;
        spec.skew = undefined;
        spec.scale = undefined;
        spec.rotate = undefined;
        this._scrollLength = undefined;
    };

    /**
     * Set the content of the node
     *
     * @param {Object} set
     */
    LayoutNode.prototype.set = function(set) {
        this._invalidated = true;
        this._removing = false;
        var spec = this._spec;
        if (set.size) {
            spec.size = set.size;
        }
        if (set.origin) {
            spec.origin = set.origin;
        }
        if (set.align) {
            spec.align = set.align;
        }
        if (set.translate || set.skew || set.rotate || set.scale) {
            this._spec.transform = Transform.build({
                translate: set.translate || [0, 0, 0],
                skew: set.skew || [0, 0, 0],
                scale: set.scale || [1, 1, 1],
                rotate: set.rotate || [0, 0, 0]
            });
        }
        /*if (set.translate) {
            var xyz = set.translate;
            if (!spec.transform) {
                spec.transform = Transform.translate(xyz[0], xyz[1], xyz[2]);
            }
            else {
                spec.transform[12] = xyz[0];
                spec.transform[13] = xyz[1];
                spec.transform[14] = xyz[2];
            }
        }*/
        if (set.scrollLength) {
            this._scrollLength = set.scrollLength;
        }
    };

    /**
     * Creates the render-spec
     */
    LayoutNode.prototype.getSpec = function() {
        return this._invalidated ? this._spec : undefined;
    };

    /**
     * Creates the render-spec
     */
    LayoutNode.prototype.getRenderNode = function() {
        return this._spec.renderNode;
    };

    /**
     * Marks the node for removal
     */
    LayoutNode.prototype.remove = function(removeSpec) {
        this._removing = true;
    };

    module.exports = LayoutNode;
});
