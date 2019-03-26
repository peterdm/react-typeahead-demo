import React, { Component } from 'react';
import SearchBox from './search';
import Card from './card';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movieID: 424 // set initital load movie - Schindler's List
    }
  }
  render() {
    return (
      <div>
        <SearchBox />
        <Card data={this.state}/>
      </div>
    )
  } // END render

  showSuggestionStats(suggestion) {
    console.log(suggestion);
    this.setState({
      querie: suggestion.querie,
      volume: suggestion.volume,
      quality: suggestion.quality,
      weight: suggestion.weight
    });
  }

  componentDidMount() {
    // Configure Bloodhound
    let popularQueries = new Bloodhound({
      datumTokenizer: function(datum) { return Bloodhound.tokenizers.whitespace(datum['value']); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'http://localhost:9200/universal-search-query-suggest/_search/template',
        prepare: function (query, settings) {
          settings.type = "POST";
          settings.contentType = "application/json; charset=UTF-8";
          settings.data = JSON.stringify({
            params: {query},
            id: "query_suggest_template"
          });

          return settings;
        },
        filter : function(popularQueries){
          return $.map(popularQueries.hits.hits, function(hit){
            return {
              value: hit._id,
              id: hit._id,
              source: hit._source,
              score: hit._score
            };
          });
        }, // end filter
        rateLimitBy: "throttle",
        rateLimitWait: 200
      }
    }); // end new Bloodhound

    popularQueries.initialize();

    // END Bloodhound

    //----Configure Typeahead UI    
    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 2,
      limit: 6
    }, 
    {
      displayKey : function(datum) { return datum.value;},
      name : 'popularQueries',
      source: popularQueries.ttAdapter(),
      templates: {
        empty: [
          '<div class="empty-message">',
          'Do something personalized with this space',
          '</div>'
        ].join('\n'),
        footer: function (data) {
          return ['<div class="tt-footer">',
            '<a>',
            'See all results for "',
            data.query,
            '"',
            '</a>',
            '</div>'
          ].join('');
        }
      }
    }).
    on('typeahead:cursorchanged', function(obj, datum) {
      this.showSuggestionStats(datum.source)
    }.bind(this));

    //----END Typeahead UI config

  } // end component did mount function
}// END CLASS - APP
module.exports = App;