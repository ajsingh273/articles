App = Ember.Application.create({});



App.Router.map(function() {
  this.resource('about');
  this.resource('results', function() {
    this.resource('result', { path: ':result_id' });
  });
});

App.ResultsRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON('http://api.govwizely.com/trade_articles/search?callback=?').then(function(data) {
      return data.results.map(function(result) {
        result.body = result.content;
        return result;
      });
    });
  }
});

App.ResultRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('http://api.govwizely.com/trade_articles/search?id='+params.result_id+'&callback=?').then(function(data) {
    		data.result.body = data.result.content;
    		return data.result;
    	});
  }
});

App.ResultController = Ember.ObjectController.extend({
  isEditing: false,
  
  actions: {
    edit: function() {
      this.set('isEditing', true);
    },

    doneEditing: function() {
      this.set('isEditing', false);
    }
  }
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});