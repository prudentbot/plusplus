if (Meteor.isClient) {
  Template.router.loggedIn = function(){
    return !!Meteor.user();
  }

  Template.home.plusems = function(){
    return Plusems.find();
  }

  Template.home.events({
    'click #plus': function () {
      Meteor.call('plus', this)
    },
    'click #minus': function () {
      Meteor.call('minus', this)
    },
    'click #temp-create-handle': function () {
      var handle = document.getElementById("temp-handle").value;
      Meteor.call("add", handle);
    }
  })

  Accounts.ui.config({
   passwordSignupFields: 'USERNAME_ONLY'
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    plus: function (handle) {
      Plusems.update(handle, {$inc: {points: 1}});
    },
    minus: function (handle) {
      Plusems.update(handle, {$inc: {points: -1}});
    },
    add: function(handle) {
      Plusems.upsert({handle:handle}, {$set: {points:0}})
    }
  });
}

Plusems = new Mongo.Collection("plusem");
