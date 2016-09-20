# rsf - really simple framework
## *write HTML in Javascript*

rsf lets you write web pages in the browser using only Javascript. In conjunction with technologies line node.js it allows you to create web sites in one language.

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
