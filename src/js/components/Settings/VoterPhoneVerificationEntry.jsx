import React, { Component } from 'react';
// import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Phone from '@material-ui/icons/Phone';
import InputBase from '@material-ui/core/InputBase';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';
// import {FormHelperText} from "@material-ui/core";

class VoterPhoneVerificationEntry extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      voterPhoneNumber: '',
      showVerifyModal: false,
      showError: false,
    };

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeVerifyModal = this.closeVerifyModal.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  onPhoneNumberChange (e) {
    this.setState({ voterPhoneNumber: e.target.value });
  }

  onSubmit () {
    const regex = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
    if (regex.test(this.state.voterPhoneNumber)) {
      this.setState({ showVerifyModal: true, showError: false });
    } else {
      this.setState({ showError: true });
    }
  }

  closeVerifyModal () {
    this.setState({ showVerifyModal: false });
  }

  render () {
    renderLog(__filename);
    if (this.state.loading) {
      return LoadingWheel;
    }

    const { classes } = this.props;
    const { showVerifyModal, voterPhoneNumber, showError } = this.state;

    return (
      <Wrapper>
        <div className="u-stack--sm u-tl">
          <strong>
            Sign in with SMS Phone Number
          </strong>
          {showError ? (
            <Error>
              Please enter a valid phone number.
            </Error>
          ) : null}
          {' '}
        </div>
        <form className="form-inline">
          <Paper className={classes.root} elevation={1}>
            <Phone />
            <InputBase
              className={classes.input}
              type="phone"
              name="voter_phone_number"
              id="enterVoterPhone"
              placeholder="Type phone number here..."
              onChange={this.onPhoneNumberChange}
            />
          </Paper>
          <Button
            color="primary"
            id="voterPhoneSendSMS"
            variant="contained"
            className={classes.button}
            onClick={this.onSubmit}
          >
            SEND VERIFICATION CODE
          </Button>
        </form>
        {showVerifyModal ? (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            toggleFunction={this.closeVerifyModal}
            voterPhoneNumber={voterPhoneNumber}
          />
        ) : null}
      </Wrapper>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    padding: 8,
  },
  button: {
    width: '100%',
    padding: '12px',
  },
};

const Wrapper = styled.div`
  margin-top: 32px;
`;

const Error = styled.div`
  color: rgb(255, 73, 34);
  font-size: 14px;
`;

export default withStyles(styles)(VoterPhoneVerificationEntry);