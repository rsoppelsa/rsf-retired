/**
 rsf - reasy simple framework - write HTML in Javascript
 Copyright (C) 2016  Web Essentials Ltd

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


function RSF(root, child, children, options) {
    var rsf = this;
    this.root = $(root).get(0); // root element
    this.child = child;
    this.children = children;
    this.parent = null;
    this.options = options;
    this.start = this.root;


    this.render = function(id) { // starts a render

        rsf.parent = null; // render starting so no parent
        var found = findElement(id);;
        if (found) {
            rsf.start = found.elem;
            $(rsf.start).empty();
            rsf.elem(found.child, found.children);
            bind(found.elem, true)
        }
    }

    // shortcuts for the common tags
    this.div = function(child, children) {shortcut("div", child, children)};
    this.span = function(child, children) {shortcut("span", child, children)};
    this.h1 = function(child, children) {shortcut("h1", child, children)};
    this.h2 = function(child, children) {shortcut("h2", child, children)};
    this.h3 = function(child, children) {shortcut("h3", child, children)};
    this.h4 = function(child, children) {shortcut("h4", child, children)};
    this.h5 = function(child, children) {shortcut("h5", child, children)};
    this.a = function(child, children) {shortcut("a", child, children)};
    this.select = function(child, children) {shortcut("select", child, children)};
    this.button = function(child, children) {shortcut("button", child, children)};
    this.table = function(child, children) {shortcut("table", child, children)};
    this.tr = function(child, children) {shortcut("tr", child, children)};
    this.td = function(child, children) {shortcut("td", child, children)};
    this.label = function(child, children) {shortcut("label", child, children)};
    this.input = function(child, children) {shortcut("input", child, children)};
    this.form = function(child, children) {shortcut("form", child, children)};
    this.hr = function(child, children) {shortcut("hr", child, children)};
    this.pre = function(child, children) {shortcut("pre", child, children)};
    this.img = function(child, children) {shortcut("img", child, children)};
    this.i = function(child, children) {shortcut("i", child, children)};
    this.p = function(child, children) {shortcut("p", child, children)};
    this.canvas = function(child, children) {shortcut("canvas", child, children)};
    this.textarea = function(child, children) {shortcut("textarea", child, children)};
    this.strong = function(child, children) {shortcut("strong", child, children)};
    this.ul = function(child, children) {shortcut("ul", child, children)};
    this.li = function(child, children) {shortcut("li", child, children)};
    this.br = function(child, children) {shortcut("br", child, children)};

    function shortcut(tag, a, b) {
        if ((a == undefined)   && (b == undefined)) {
            rsf.elem({tag: tag})
        }
        else if ($.isPlainObject(a) && (b == undefined)) {
            a.tag = tag;
            rsf.elem(a);
        }
        else if ($.isFunction(a) && (b == undefined)) {
            rsf.elem({tag: tag}, a); // just tag and children
        }
        else {
            a.tag = tag;
            rsf.elem(a, b);
        }
    }

    this.text = function(text) {
        var textnode = document.createTextNode(text);
        rsf.parent.appendChild(textnode);
    }

    this.elem = function(child, children) { // called by app to create elements during render phase

        var elem;
        var context = {};
        if (rsf.parent != null) {
            if (!child.tag) return;
            if (child.render != undefined) {
                var render = true;
                if ($.isFunction(child.render)) render = child.render();
                else render = child.render;
                if (!render) return;
            }
            var node = document.createElement(child.tag);
            elem = rsf.parent.appendChild(node);
            //console.log("binding: " + elem.tagName + ", parent: " + rsf.parent.tagName);
        }
        else { // render has just started - we just apply attributes etc to starting elem
            elem = rsf.start;
        }
        var parent = rsf.parent;

        $(elem).data("rsf-child", child); // store link to child object
        $(elem).data("rsf-children", children); // store link to children callback

        if (child.id != undefined) {
//            elem.id = child.id; // we no longer set the element id
        }

        if (child.attr != undefined) { // we always try to add attributes
            $(elem).attr(child.attr);
        }

        if (child.css != undefined) { // allows styles to be set
            $(elem).css(child.css);
        }

        if (child.text) { // this creates children (inner text) so further children are ignored
            var s = get(child.text, context);
            if (s != null) {
                $(elem).text(s);
            }
        }
        else if (children != undefined) {
            rsf.parent = elem;
            children(rsf);
            rsf.parent = parent;
        }

    }

    function findElement(id) {
        var found = null;
        if (id == undefined) { // bind whole rsf
            found = {elem: rsf.root, child: rsf.child, children: rsf.children}
        }
        else if (typeof id === 'string') { // id's should be strings
            scanDom(rsf.root, function(elem) {
                if (!found && ($(elem).data("rsf-child")) && ( $(elem).data("rsf-child").id == id)) {
                    found = {elem: elem, child: $(elem).data("rsf-child"), children: $(elem).data("rsf-children")}
                }
            })
        }
        return found;
    }

    this.bind = function(id) {

        var found = findElement(id);
        if (found) {
            rsf.start = found.elem;
            bind(found.elem, false)
        }

    }

    function bind(elem, render) {
        //console.log("binding: " + elem.tagName);
        var child = $(elem).data("rsf-child"); // get link to child
        //var children = $(elem).data("rsf-child"); // get link to child

        if (!child) return; // we cant bind elements without rsf data

        //var context = {child: child, elem: elem, index: 0, data: null}; //???
        var context = {elem: elem, render: render}; // we always supply the raw element
        if (child.data != undefined) context.data = child.data; // pass back data attached to this child

        if (child.text != undefined) {
            var s = get(child.text, context);
            if (s != null) {
                $(elem).text(s);
            }
        }

        if (child.html != undefined) {
            var s = get(child.html, context);
            if (s != null) {
                $(elem).html(s);
            }
        }
        if (child.click != undefined) {
            if (render) {
                $(elem).on('click', null, child.click, function (e) {
                    event(e.data, e, context)
                })
            }
        }
        if (child.check != undefined) {
            var s = get(child.check, context);
            if (s != null) {
                $(elem).get(0).checked = s;
            }
            if (render) {
                $(elem).change(function (e) { // change event
                    var x =  $(elem).get(0).checked;
                    set(child.check, x, context);
                })
            }
        }
        if (child.href != undefined) {
            var s = get(child.href, context);
            if (s != null) {
                $(elem).attr("href", s);
            }
        }
        if (child.src != undefined) {
            var s = get(child.src, context);
            if (s != null) {
                $(elem).attr("src", s);
            }
        }
        if (child.class != undefined) {
            var s = get(child.class, context);
            if (s != null) {
                var add = false;
                if ($.isFunction(child.class.add)) {
                    add = child.class.add(context);
                }
                else {
                    add = child.class.add;
                }
                if (add) {
                    $(elem).addClass(s);
                }
                else {
                    $(elem).removeClass(s);
                }
            }
        }
        if (child.disable != undefined) {
            var res = get(child.disable, context);
            if (res) {
                $(elem).attr("disabled", true);
            }
            else {
                $(elem).removeAttr("disabled");
            }
        }
        if (child.hide != undefined) {
            var s = get(child.hide, context);
            if (s) {
                $(elem).hide();
            }
            else {
                $(elem).show();
            }
        }
        if (child.show != undefined) {
            var s = get(child.show, context);
            if (s) {
                $(elem).show();
            }
            else {
                $(elem).hide();
            }
        }
        if (child.input != undefined) {
            var s = get(child.input, context);
            if (s != null) {
                $(elem).val(s);
            }
            if (render) {
                $(elem).on('input', null, child.input, function (e) { // >IE9
                    var x = $(elem).val();
                    set(e.data, x, context);
                })
            }
        }
        if (child.select != undefined) {
            var x = get(child.select, context);
            if (child.select.useValue) { // x contains a value
                $(elem).get(0).value = x;
            }
            else { // x is an index
                $(elem).get(0).selectedIndex = x;
            }
            if (render) {
                $(elem).on('input', null, child.select, function (e) { // >IE9
                    var x = $(elem).val();
                    var y = $(elem).get(0).selectedIndex;
                    if (child.select.useValue) {
                        y = $(elem).get(0).value;
                    }
                    set(e.data, y, context);
                })
            }
        }
        if (child.typeahead != undefined) { // use with input element
            var s = get(child.typeahead, context); // text to be displayed in input
            $(elem).val(s);
            if (render) {
                $(elem).typeahead({ // https://github.com/bassjobsen/Bootstrap-3-Typeahead
                    source: child.typeahead.source, // this can be an array (of string or objects) or function(query,process) - process is callback with single data param
                    afterSelect: function(x) {
                        var s = x;
                        if ($.isPlainObject(x)) {
                            s = s.name;
                        }
                        console.log("set: " + s);
                        set(child.typeahead, s, context); // text of selected item
                    }
                });
                if (child.typeahead.empty) { // if true the typeahead will set an empty value if detected (any placeholder will be displayed)
                    $(elem).on('input', null, null, function (e) { // >IE9
                        //console.log($(elem).typeahead("getActive"));
                        if ($(elem).val() == "") {
                            console.log("set: " + "");
                            set(child.typeahead, "", context); // text of selected item
                        }
                    })
                }

            }
        }
        if (child.summernote != undefined) { // encapsulates http://summernote.org/ html editor
            var s = get(child.summernote, context);
            if (render) {
                if (child.summernote.options) {
                    $(elem).summernote(child.summernote.options)
                }
                else {
                    $(elem).summernote();
                }
                $(elem).on('summernote.change', function(we, contents, $editable) {
                    set(child.summernote, contents, context); // get value from page
                });
                if (child.summernote.blur) {
                    $(elem).on('summernote.blur', function (e) {
                        event(child.summernote.blur, e, context)
                    });
                }
            }
            $(elem).summernote('code', s); // bind value to page
        }
        if (child.blur != undefined) {
            if (render) {
                $(elem).on('blur', null, child.blur, function (e) {
                    event(e.data, e, context)
                })
            }
        }
        if (child.title != undefined) {
            var s = get(child.title, context);
            if (s != null) {
                $(elem).attr("title", s);
            }
        }
        if (child.enter != undefined) {
            if (render) {
                $(elem).on('keyup', null, child.enter, function (e) {
                    if(e.which == 13) {
                        event(e.data, e, context)
                    }
                })
            }
        }

        //***********************************************************************

        if (elem.children.length > 0) {
            for (var i = 0; i < elem.children.length; i++) {
                bind(elem.children[i], render);
            }
        }

    }

    function get(x, c)  { // get the value to put in the dom
        var s = null;
        var obj = {get: x, set: null}; // internally we always use object form
        if ($.isPlainObject(x)) {
            obj = x;
        }
        //var data = {}
        if ($.isFunction(obj.get)) { // call as getter
            s = obj.get(c);
        }
        else if (obj.get != null) {
            s = obj.get;
        }
        //console.log("getting: " + s);
        return(s);
    }

    function set(x, y, c) { // get the value to set from the dom

        var obj = {get: null, set: x}; // internally we always use object form
        if ($.isPlainObject(x)) {
            obj = x;
        }
        if ($.isFunction(obj.set)) { // call as setter
            //obj.set.call(rsf, y);
            obj.set(y, c);
        }
        if (obj.render != undefined) {
            rsf.render(obj.render);
        }
        if (obj.bind != undefined) {
            rsf.bind(obj.bind);
        }
    }
    function event(x, y, c) { //

        var obj = {event: x}; // internally we always use object form
        if ($.isPlainObject(x)) {
            obj = x;
        }
        if ($.isFunction(obj.event)) { // call as setter
            //obj.set.call(rsf, y);
            obj.event(y, c);
        }
        if (obj.render != undefined) {
            rsf.render(obj.render);
        }
        if (obj.bind != undefined) {
            rsf.bind(obj.bind);
        }
    }


    // issue callback for every child
    function scanDom(elem, cb) {
        cb(elem);
        if (elem.children.length > 0) {
            for (var i = 0; i < elem.children.length; i++) {
                scanDom(elem.children[i], cb);
            }
        }
    }

    rsf.elem(child, children)
    bind(this.root, true);

}

function select(r, select, options) {
    r.select(select, function() {
        if ($.isFunction(options)) options = options();
        if ($.isArray(options)) options = {items: options}; // user can just pass an array
        var items = options.items;
        var t = options.text;
        var v = options.value;
        if (t == undefined) var t = "text";
        if (v == undefined) var v = "value";
        var ca = [];
        for (var i = 0; i < items.length; i++) {
            var o = items[i];
            r.elem({tag: "option", attr: {value: o[v]}, text: o[t]});
        }
    });
}

function table(r, table, items, headings, cbRepeat, cbEmpty, orderParam) {                          //orderParam is the query string, i.e q
    r.table(table, function() {
        if (headings && $.isArray(headings) && headings.length > 0) {
            r.elem({tag: "thead"}, function () {
                r.elem({tag: "tr"}, function () {
                    for (var i = 0; i < headings.length; i++) {
                        if(orderParam) {
                            buildHeading(r, headings[i], orderParam)                                //only build responsive headings if orderParam
                        }
                        else {
                            r.elem({tag: "th"}, function () {
                                r.a({
                                    attr: {style: 'color: black'}, href: "#"
                                }, function () {
                                    r.span({text: headings[i]});                                //basic headings still available
                                });
                            })
                        }
                    }
                })
            })
        }
        r.elem({tag: "tbody"}, function () {
            if (items && $.isArray(items) && items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    r.elem({tag: "tr"}, function () {
                        if (cbRepeat) cbRepeat(items[i], i);
                    })
                }
            }
            else {
                r.elem({tag: "tr"}, function () {
                    if (cbEmpty) cbEmpty();
                })
            }
        })
    });
}



