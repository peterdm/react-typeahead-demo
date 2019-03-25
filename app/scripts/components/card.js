import React, { Component } from 'react';

class Card extends Component {

  render() {
    let data = this.props.data;
    return (
      <div className="col-xs-12 cardcont nopadding">

        <div className="meta-data-container col-xs-12 col-md-8 push-md-4 col-lg-7 push-lg-5">
          <h1>{data.querie}</h1>
          <span className="tagline"></span>
          <div className="additional-details">
            <div className="row nopadding release-details">
              <div className="col-xs-4"> Queries Seen: <span className="meta-data">{data.volume}</span></div>
              <div className="col-xs-4"> Search Quality: <span className="meta-data">{data.quality}</span></div>
              <div className="col-xs-4"> Weight: <span className="meta-data">{data.weight}</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidUpdate() {
  }
}


function nestedDataToString(nestedData) {
  let nestedArray = [],
      resultString;
  nestedArray.forEach(function(item, i){
    nestedArray.push(item.name);
  });
  resultString = nestedArray.join(', '); // array to string
  return resultString;
};
module.exports = Card;
