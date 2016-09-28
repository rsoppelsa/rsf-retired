/**
 * Created by richard on 28/09/16.
 */

// renders a SELECT tag with it's OPTIONS
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

// renders a TABLE tag with headers, and columns. Rows are build by the CBRepeat callback
function table(r, table, items, headings, cbRepeat, cbEmpty) {
    r.table(table, function() {
        if (headings && $.isArray(headings) && headings.length > 0) {
            r.elem({tag: "thead"}, function () {
                r.elem({tag: "tr"}, function () {
                    for (var i = 0; i < headings.length; i++) {
                        r.elem({tag: "th"}, function () {
                            r.a({
                                attr: {style: 'color: black'}, href: "#"
                            }, function () {
                                r.span({text: headings[i]});
                            });
                        })
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