import React, { Component } from 'react';

class SearchBox extends Component {

  handleChange(event) {    
    event.target.select();
  }
  render() {
    return (
      <div className="col-xs-12 search-container nopadding">
        <div className="row">

          <div className="col-xs-12 col-sm-6 col-lg-5">
            <a href="./" title="eMarketer Autosuggest Demo"><img src="images/emarketer.jpg" className="logo" alt="eMarketer" /></a>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-7">
            <form className="searchbox">
              <label>
                <input ref="search suggestion" onClick={this.handleChange} className="searchbox__input typeahead form-control" type="text" placeholder="What can we answer...?" id="q" />
              </label>
              </form>
          </div>
        </div>
      </div>
    )
  }
}
module.exports = SearchBox;
