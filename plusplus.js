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
      Meteor.call('plus', Session.get('selected_profile_id'), Meteor.userId());
    },
    'click #minus': function () {
      Meteor.call('minus', Session.get('selected_profile_id'), Meteor.userId());
    }
  })

  Template.log.transactions = function () {
    return Transactions.find();
  }

  Accounts.ui.config({
   passwordSignupFields: 'USERNAME_ONLY'
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    plus: function (to_id, from_id) {
      Plusems.update(to_id, {$inc: {points: 1}});
      Transactions.insert(
        {
          from: from_id,
          to: to_id,
          time: (new Date()).getTime(),
          reason: "placeholder",
          plus:true
        })
    },
    minus: function (to_id, from_id) {
      Plusems.update(to_id, {$inc: {points: -1}});
      Transactions.insert(
        {
          from: from_id,
          to: to_id,
          time: (new Date()).getTime(),
          reason: "placeholder",
          plus:false
        })
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
Transactions = new Mongo.Collection("transaction");
