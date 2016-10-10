# rsf - really simple framework
## *write HTML using Javascript*

rsf lets you write web pages in the browser using only Javascript. In conjunction with technologies like node.js it allows you to easily create web sites in just Javascript.

HTML structures can be represented in code which can, in turn, be encapulated as functions. This makes HTML templating and repitition trivial. Page state can be stored simply within the page as Javascript variables. 

## Getting Started
rsf's only dependancy is jQuery - any recent version should suffice. Create a minimal web page in html, include jQuery, the rsf library itself and a container element for rsf to target. The rsf application itself is written in Javascript, usually in a separate .js file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>rsf</title>
</head>
<body>

<div id="container">

</div>

<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="rsf.js"></script>

<script>
    // usually rsf application code would reside in it's own .js file
    var rsf = new RSF("#container", {id: "my-app"}, function(r) {
        r.text("hello world!");
    });
</script>
</body>
</html>
```

View this example on [jsFiddle](https://jsfiddle.net/rsoppelsa/zrrbr97y/)

All the following examples assume the same page structure with a container DIV having an id "container".

## The rsf lifecycle
When a web page is displayed the HTML page is rendered and any scripts (including the rsf application) are run. The rsf application should target one or more container HTML elements on the page. Each rsf object then renders HTML inside it's container. 

The HTML inside the container is created during the render phase. The hierarchy or tree of HTML elements is created by the subsequent invocation of the children functions for each element. 

Once all the HTML has been created the first bind phase starts. The bind object getter functions are called for all the rsf attributes on each element. Binding occurs on elements in the same order in which they were rendered. A bind phase always follows a render phase.

This is the end of the lifecycle. However, the application can choose to render or bind the entire container or parts of it at any time. The application targets a part of the container by referencing an element by it's rsf ID. The element, and all it's children, are then rendered and/or bound.

> The structure of the HTML within a container (by adding or removing elements) can only be changed by rendering again.  Binding can happen at ant time but it assumes that the page structure has not changed. Basically, don't add or remove  elements by using DOM or jQuery functions independently of rsf.

**Example**

The following example shows the UL element being re-rendered on every BUTTON click because new OPTION tags are being added.

```javascript
    var items = ["item 1"];
    var rsf = new RSF("#container", {id: "my-app"}, function(r) {
        r.ul({id: "list"}, function(r) {
            for (var i = 0; i < items.length; i++) {
							r.li({text: items[i]});
            }        
        });
        r.button({attr: {type: "button"}, text: "add item", click: function() {
        		items.push("item "+ (items.length+1));
            r.render("list");
        }})
    });
```

View this example on [jsFiddle](https://jsfiddle.net/rsoppelsa/c0t0k8wx/)

## The rsf Constructor
### RSF(target, [attributes], children)
The rsf constructor initiates the rendering of rsf content and encapsulates the remainder of the application through its `children` callback. A web page may contain multiple containers each targeted by a different instance of rsf.

**Arguments**
- `target` - A jQuery selector, element or jQuery object which specifies the container element.
- `attributes` - *Optional* an rsf attributes object (see below) which is applied to the container element
- `children(r)` - A callback which is called to render children of this element. `r` is the rsf object and subsequent calls to the `elem` method build the page structure.


## rsf methods
### elem([attributes], [children])
The `elem` method creates any HTML element at the current rendering location. A shortcut method can be used instead of the calling `elem` method directly. These shortcuts create some of the more commonly used HTML elements: 

- div
- span
- h1
- h2
- h3
- h4
- h5
- a
- select
- button
- table
- tr
- td
- label
- input
- form
- hr
- pre
- img
- i
- p
- canvas
- textarea
- strong
- ul
- li
- br

**TO DO** - add method to install shortcuts (for now just edit the rsf source)

**Arguments**
- `attributes` - *Optional* An `attributes` object (see below) which is applied to the rendered element
- `children(r)`- *Optional* A callback which is called to render children of this element. `r` is the rsf object

**Examples**

Render any element with the `elem` method.

```javascript
    r.elem({tag: 'code', text: 'there is no shortcut for a code tag'});
```
This example shows a variable being bound to two controls. Typing in the INPUT tag invokes a setter function when then re-binds the SPAN.

```javascript
var textbox = 'abc';
var rsf = new RSF("#container", {id: "my-app"}, function (r) {
    r.input({
        attr: {type: "text"}, input: {
            get: function () {
                return textbox;
            }, set: function (x) {
                textbox = x;
                r.bind("myspan");
            }
        }
    });
    r.p({id: "myspan"}, function (r) {
        r.span({
            text: function () {
                return textbox
            }
        })
    })
});
```
View this example on [jsFiddle](https://jsfiddle.net/rsoppelsa/87zznLfw/)

Encapsule table layout in a function that can be called as required.
```javascript
var rsf = new RSF("#container", {id: "my-app"}, function(r) {

    var planets = [{planet: "earth", colour: "blue"}, {planet: "mars", colour: "red"}];
    table(r, {}, planets, ["planet", "colour"], function(item, i) {
        r.td({text: item.planet});
        r.td({text: item.colour});
    });

    function table(r, attr, items, headings, cbRepeat, cbEmpty) {
        r.table(attr, function() {
            if (headings && $.isArray(headings) && headings.length > 0) {
                r.elem({tag: "thead"}, function () {
                    r.elem({tag: "tr"}, function () {
                        for (var i = 0; i < headings.length; i++) {
                            r.elem({tag: "th"}, function () {
                                r.span({text: headings[i]});
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
});
```
View this example on [jsFiddle](https://jsfiddle.net/rsoppelsa/4gbb8793/)

### render(id)

Initiates a render starting on the element identified by the `id` parameter. If no `id` parameter is supplied the entire target container is rendered.

**Arguments**
- `id` - *Optional* A string referencing an `rsf` id. 


### bind(id)
Initiates a bind starting on the element identified by the `id` parameter. If no `id` parameter is supplied the entire target container is bound.

**Arguments**
- `id` - *Optional* A string referencing an `rsf` id. 


### text(content)
Renders in-line text (using the DOM createTextNode function).

**Arguments**
- `content` - A string.


## The rsf attributes object
The attributes object is applied to the element which is currently being rendered or bound. Some properties/members of the object relate to the render phase and/or others the bind phase (see descriptions below). 

**Members**

- `tag` - The type of HTML element to create (render). Only used by the `elem` method (do not use with shortcuts). This is only used in the render phase.
- `id` - A string which is used to identify the element so it may be targetted in future render or bind operations. Note - this is different from the HTML ID attribute. This is only used in the render phase.
- `attr` - An object which is passed directly to the jQuery attr() function the results of which will be applied to the current element. This is only used in the render phase.
- `css` - An object which is passed directly to the jQuery css() function the results of which will be applied to the current element. This is only used in the render phase.
- `text` - A string (or function returning a string) which is passed directly to the jQuery text() function and will be rendered as innerText on the current element. Note - no further children will be rendered within this element.
- `click` - An event object (see below) that is called when the element is "clicked".
- `check` - A bind object (see below) which binds a boolean to an element (usually an INPUT tag of type "checkbox").
- `href` - A bind object which binds a string to set the "href" attribute of the element (usually an A tag).
- `src` - A bind object which binds a string to set the "src" attribute of the element (usually an IMG tag).
- `class` -  A bind object which binds a string to add a class attribute of the element. This object also supports an "add" member (default true) which specifies if the class should be added or removed from the element.
- `disable` - A bind object which binds a boolean to the element add or remove a "disabled" attribute.
- `hide` - A bind object which binds a boolean to the element add or remove a "disabled" attribute.
- `show` - A bind object which binds a boolean to the element to hide or show the element.
- `input` - A bind object which binds a string to the element (usually an INPUT tag of type "text" or similar).
- `select` - A bind object which binds a value the selected option in a SELECT tag. This object also supports an "useValue" member (default false) which specifies if the value specified the OPTION tag index or value.
- `blur` -  An event object that is called when the rendered element is "blurred" (loses focus).
- `title` -  A bind object which binds a string to the "title" attribute of the element.
- `enter` -  An event object that is called when the rendered element is receives a "keyup" event for the "enter" key.
- `data` -  An object that is associated with the element and it passed in the context object for setters and events (see below).

**TO DO** - add method to install additional attribute members (for now just edit the rsf source)

## The bind object
Bind objects comprise a get function (getter) and a set function (setter). The get and set functions allow a variable to be associated with an element. Bind functions are only active during the bind phase. The get function is called whenever the element binds to return the variable value to the element. The set function is called whenever the element needs to update the value of the variable. 

**Members**
- `get` - a function that must return the value that binds to the element
- `set(value, context)` - a function that must set the bound variable to the passed value. A context is also supplied to the setter function. 

For example, an INPUT element of type "text" may use a bind object to "bind" a variable "myvar" to the element. Whenever this element binds the value of "myvar" will be displayed in the text box. Whenever a user types in the text box "myvar" will receive the new value;

```javascript
var myvar = 'hello';
r.input({
    attr: {type: "text"}, input: {
        get: function () {
            return myvar;
        }, set: function (x) {
            myvar = x;
        }
    }
});

```

When binding an element that only requires a getter it is acceptable to specify a function (returning a value) or a value rather than a full bind object, it's shorter and more convenient, e.g:

```javascript
r.h1({text: "my big header"});
```



## The event object
Event objects comprise just an event function which is called whenever the element generate the relevent DOM event.

**Members**
- `event(data, e, context)` - a function that is called when the DOM event fires. `e` is the jQuery event object, `context` is the `rsf` context object (see below).

As a shortcut, you can just pass the function instead of an event object.

For example, a BUTTON element can use an event object to handle a click:

```javascript
var clickCount = 0;
r.button({
    attr: {type: "button"}, 
	text: "my button",
    click: function () {
        clickCount++;
    }
});
```
## The context object
The context object contains members that give information about the element being bound. 

**Members**
- `elem` - the jQuery object which encapsulates the current element
- `render` - a boolean that indicates if this is the first bind after a render
- `data` - a user defined object that was specified then the element was rendered


**Authors:** Richard Soppelsa, Martin Verrall


