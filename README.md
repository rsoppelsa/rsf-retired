# rsf - really simple framework
## *write HTML in Javascript*

rsf lets you write web pages in the browser using only Javascript. In conjunction with technologies like node.js it allows you to easily create web sites in just Javascript.

## Getting Started
rsf's only dependancy is jQuery - any recent version should suffice. Create a minimal web page in html, include jQuery, the rsf library itself and a container element for rsf to target. The rsf application itself is written in Javascript, usually in a separate .js file:

```
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
    var rsf = new RSF("#main", {id: "record", attr: {class: "container"}}, function(r) {
        r.text("hello world!");
    });
</script>
</body>
</html>
```
## The rsf Constructor
### RSF(target, [attributes], children)
The rsf constructor initiates the rendering of rsf content and encapsulates the remainder of the application through its `children` callback. A web page may contain multiple containers each targeted by a different instance of rsf.

**Arguments**
- `target` - a jQuery selector, element or jQuery object which specifies the container element
- `attributes` - *Optional* an rsf attributes object (see below) which is applied to the container element
- `children(r)` - a callback which is called to render children of this element. `r` is the rsf object

## The rsf attributes object
The attributes object is applied to the element which is currently being rendered.

- `id` - a string which may be used to identify the element so it may be targetted in future render or bind operations (note this is different from the HTML ID attribute)
- `attr` - an object which is passed directly to the jQuery attr() function the results of which will be applied to he current element
- `css` - an object which is passed directly to the jQuery css() function the results of which will be applied to he current element
- `text` - a string (or function returning a string)which is passed directly to the jQuery text() function and will be rendered as innerText on the current element (children?)


**Arguments**
- `target` - a jQuery selector, element or jQuery object which specifies the container element
- `attributes` - *Optional* an rsf attributes object (see below) which is applied to the container element
- `children(r)` - a callback which is called to render children of this element. `r` is the rsf object

### elem([attributes], children)
The elem method creates any HTML element at the current rendering location. A number of shortcut methods are usually used instead of the elem method. These shortcuts create some of the more commonly used HTML elements: div, span, h1, h2.....

**Arguments**
- `attributes` - *Optional* an elem attributes object (see below) which is applied to the rendered element
- `children(r)` - a callback which is called to render children of this element. `r` is the rsf object
-
## The attributes object
The attributes object is applied to the element which is currently being rendered.

**Arguments**
- `tag` - the type of HTML element to create
- `id` - a string which may be used to identify the element so it may be targetted in future render or bind operations (note this is different from the HTML ID attribute)
- `attr` - an object which is passed directly to the jQuery attr() function the results of which will be applied to he current element
- `css` - an object which is passed directly to the jQuery css() function the results of which will be applied to he current element
- `text` - a string (or function returning a string) which is passed directly to the jQuery text() function and will be rendered as innerText on the current element (children?) +bind
- `click` - an event function that is called when the rendered element is "clicked"
- `check` - a function which is called when the state of an input checkbox changes
- `href` - a string (or function returning a string) which calls the jQuery attr() function to set the "href" attribute of the element (usually an A tag)
- `src` - a string (or function returning a string) which calls the jQuery attr() function to set the "src" attribute of the element (usually an IMG tag)
- `class`
- `disable` - a bind function which gets a boolean to add or remove a "disabled" attribute on the element
- `hide` - a bind function which gets a boolean to hide or show the element
- `show` - a bind function which gets or sets a boolean to hide or show the element
- `input` - a bind function which gets or sets a string that is displayed in the element (usually an INPUT tag of type "text" or similar) - uses the jQuery on + input
- `select` - a bind function which gets or sets the selected option in a SELECT tag - can return the option value or it's index - useValue flag
- `blur` -  an event function that is called when the rendered element is "blurred" (loses focus)
- `title` -  a bind function which gets a string that sets the "title" attribute of the element
- `enter` -   an event function that is called when the rendered element is receives a "keyup" event for the "enter" key
-


-
-
-
- a string (or function returning a string) which is passed directly to the jQuery text() function and will be rendered as innerText on the current element (children?)
- `text` - a string (or function returning a string) which is passed directly to the jQuery text() function and will be rendered as innerText on the current element (children?)

-

## The bind object
Bind objects comprise a get function (getter) and a set function (setter). The get and set function allows a variable to be associated with an element. The get function is called whenever the element binds to return the variable value to the element. The set function is called whenever the element needs to update the value of the variable. 

For example, an INPUT element of type "text" may use a bind object to "bind" a variable "myvar" to the element. Whenever this element binds the value of "myvar" will be displayed in the text box. Whenever a user types in the text box "myvar" will receive the new value;

```
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

**Arguments**
- `get` - a function that must return the value that binds to the element
- `set(value, context)` - a function that must set the bound variable to the passed value. A context is also supplied to the setter function. 

When binding an element that only requires a getter it is acceptable to specify a function (returning a value) or a value rather than a full bind object. This is often shorter and more convenient, e.g:

```
r.h1(text: "my big header"});
```


It is also possible to pass a function rather than a 

bind function - get/set

