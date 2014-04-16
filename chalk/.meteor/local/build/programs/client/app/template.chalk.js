(function(){
UI.body.contentParts.push(UI.Component.extend({render: (function() {
  var self = this;
  return HTML.Raw('<div id="navigation" class="navbar">\n        <a href="#" id="logo">Chalklit</a>\n        <a href="#">Home</a>\n        <a href="#calendar">Calendar</a>\n        <a href="#profile">Profile</a>\n        <a href="#" id="logout">Logout</a>\n    </div>');
})}));
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });

Template.__define__("hello", (function() {
  var self = this;
  var template = this;
  return [ HTML.Raw("<h1>Hello World!</h1>\n  "), function() {
    return Spacebars.mustache(self.lookup("greeting"));
  }, HTML.Raw('\n  <input type="button" value="Click">') ];
}));

})();
