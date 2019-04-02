import React, { Component } from 'react';
import SearchBox from './search';
import Card from './card';
import he from 'he';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
          let trailingspace = /\s+$/.test(query);
          let frontterms = (trailingspace) ? query.trim() : query.trim().split(/\s+/).slice(0,-1).join(" ");
          let [backterm] = (trailingspace) ? [] : query.trim().split(/\s+/).slice(-1);


          let formattedRequest = {
            params: { frontterms: frontterms, backterm: backterm },
            id: "query_suggest_template"
          };

          settings.type = "POST";
          settings.contentType = "application/json; charset=UTF-8";
          settings.data = JSON.stringify(formattedRequest);

          return settings;
        },
        filter : function(popularQueries){
          return $.map(popularQueries.hits.hits, function(hit){
            return {
              value: ("highlight" in hit && "querie" in hit.highlight)
                ? he.decode(hit.highlight.querie[0])
                : hit._source.querie,
              id: hit._id,
              query: hit._source.querie,
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
      highlight: false,
      minLength: 0,
      limit: 6
    }, 
    {
      displayKey : function(datum) { return datum.query;},
      name : 'popularQueries',
      source: popularQueries.ttAdapter(),
      templates: {
        empty: [
          '<div class="empty-message">',
          'Do something personalized with this space',
          '</div>'
        ].join('\n'),
        suggestion: function (suggestion) {
          return ['<div class="tt-suggestion tt-selectable">',
            suggestion.value,
            '</div>'
          ].join('');
        },
        footer: function (data) {
          return ['<div class="tt-suggestion tt-selectable">',
            '<a>',
            'See all results for "',
            data.query.trim(),
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