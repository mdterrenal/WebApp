import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import CandidateDetail from 'components/Ballot/CandidateDetail';

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      candidate: null
    };
  }

  componentDidMount () { }

  setCandidate (candidate) {
    this.setState({ candidate });
  }

  componentWillUnmount () { }

  render() {
    var details = this.state.candidate ?
      <CandidateDetail {...this.state.candidate} /> :
      (<div className="box-loader">
            <i className="fa fa-spinner fa-pulse"></i>
            <p>Loading ... One Moment</p>
            </div>);



    {/* Trying to mirror from invisionApp design */}
    return (
      <div className='candidate-detail-route'>
        <header className="row">
          <div className="col-xs-6 col-md-6 text-center">
            <Link to='/ballot'>
              &lt; Back to My Ballot
            </Link>
          </div>
          <div className="col-xs-6 col-md-6 text-center">
            <i className="icon-icon-more-opinions-2-2 icon-light icon-medium">
            </i>
            <Link
              to="/ballot/opinions"
              className="font-darkest fluff-left-narrow">
                More Opinions
            </Link>
          </div>
        </header>

        { details }

      </div>

    );

  }

  _onChange () { }
}
