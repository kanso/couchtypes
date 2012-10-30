/*global $: false, kanso: true*/

/**
 * Widgets define the way a Field object is displayed when rendered as part of a
 * Form. Changing a Field's widget will be reflected in the admin app.
 *
 * @module
 */

define([
    'exports',
    './widgets.core',
    './widgets.selector',
    './widgets.jquery',
    'underscore'
],
function (exports, wcore, wselector, wjquery, _) {

    _.reduce([wcore, wselector, wjquery], function (a, m) {
        return _.extend(a, m || {});
    }, exports);

});
