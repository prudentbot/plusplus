if (Meteor.isClient) {
  Template.router.loggedIn = function(){
    return !!Meteor.user();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
