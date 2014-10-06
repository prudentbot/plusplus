if (Meteor.isClient) {
  Template.router.loggedIn = function(){
    return !!Meteor.user();
  }

  Template.home.plusems = function(){
    return Plusems.find();
  }

  Template.home.events({
    'click #temp-create-handle': function () {
      var handle = document.getElementById("temp-handle").value;
      Meteor.call("add", handle);
    },
    'click #profile': function () {
      Session.set('selected_profile_id', this._id);
      Router.go('/profile');
    }
  })

  Template.profile.profile = function () {
    return Plusems.findOne({_id: Session.get('selected_profile_id')});
  }

  Template.profile.events({
    'click #plus': function () {
      Meteor.call('plus', Session.get('selected_profile_id'));
    },
    'click #minus': function () {
      Meteor.call('minus', Session.get('selected_profile_id'));
    },

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
    plus: function (_id) {
      Plusems.update(_id, {$inc: {points: 1}});
    },
    minus: function (_id) {
      Plusems.update(_id, {$inc: {points: -1}});
    },
    add: function(handle) {
      Plusems.upsert({handle:handle}, {$set: {points:0}})
    }
  });
}

Router.route("", {template:"home"})
Router.route("profile", {template:"profile"})
Router.route("log", {template:"log"})

Plusems = new Mongo.Collection("plusem");
