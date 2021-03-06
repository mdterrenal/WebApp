import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppStore from '../../stores/AppStore';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { historyPush } from '../../utils/cordovaUtils';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';
import WouldYouLikeToMergeAccounts from '../../components/WouldYouLikeToMergeAccounts';

export default class FriendInvitationByEmailVerifyProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationByEmailVerifyCalled: false,
      hostname: '',
      saving: false,
      yesPleaseMergeAccounts: false,
    };
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    const { invitation_secret_key: invitationSecretKey } = this.props.params;
    // console.log('FriendInvitationByEmailVerifyProcess, componentDidMount, this.props.params.invitation_secret_key: ', invitationSecretKey);
    const hostname = AppStore.getHostname();
    if (hostname && hostname !== '') {
      this.friendInvitationByEmailVerify(invitationSecretKey);
      this.setState({
        friendInvitationByEmailVerifyCalled: true,
        hostname,
      });
    }
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onAppStoreChange () {
    const { friendInvitationByEmailVerifyCalled } = this.state;
    const hostname = AppStore.getHostname();
    if (!friendInvitationByEmailVerifyCalled && hostname && hostname !== '') {
      const { invitation_secret_key: invitationSecretKey } = this.props.params;
      // console.log('FriendInvitationByEmailVerifyProcess, onAppStoreChange, this.props.params.invitation_secret_key: ', invitationSecretKey);
      this.friendInvitationByEmailVerify(invitationSecretKey);
      this.setState({
        friendInvitationByEmailVerifyCalled: true,
        hostname,
      });
    }
  }

  onFriendStoreChange () {
    this.setState({
      invitationStatus: FriendStore.getInvitationStatus(),
      saving: false,
    });
  }

  cancelMergeFunction = () => {
    historyPush({
      pathname: '/ballot',
      state: {
      },
    });
    // message: 'You have chosen to NOT merge your two accounts.',
    // message_type: 'success'
  }

  setYesPleaseMergeAccounts = () => {
    this.setState({ yesPleaseMergeAccounts: true });
  }

  voterMergeTwoAccountsByInvitationKey = (invitationSecretKey) => {
    VoterActions.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
    historyPush({
      pathname: `/wevoteintro/newfriend/${invitationSecretKey}`,
      state: {
        message: 'You have successfully signed in.',
        message_type: 'success',
      },
    });
  };

  friendInvitationByEmailVerify (invitationSecretKey) {
    FriendActions.friendInvitationByEmailVerify(invitationSecretKey);
    this.setState({ saving: true });
  }

  render () {
    renderLog('FriendInvitationByEmailVerifyProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { invitation_secret_key: invitationSecretKey } = this.props.params;
    const { hostname, invitationStatus, saving, yesPleaseMergeAccounts } = this.state;
    // console.log('FriendInvitationByEmailVerifyProcess, invitationStatus:', invitationStatus);

    if (yesPleaseMergeAccounts) {
      // If yesPleaseMergeAccounts is true, it doesn't matter what is happening with invitationStatus
      // Go ahead and merge this voter record with the voter record that the email_secret_key belongs to
      // console.log('this.voterMergeTwoAccountsByInvitationKey yesPleaseMergeAccounts is TRUE');
      this.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
      // return <span>this.voterMergeTwoAccountsByInvitationKey</span>;
      return LoadingWheel;
    }

    // console.log('FriendInvitationByEmailVerifyProcess, invitation_secret_key:', invitationSecretKey);
    // console.log('FriendInvitationByEmailVerifyProcess, invitationStatus:', invitationStatus);
    if (saving || !invitationStatus || !hostname || hostname === '') {
      // console.log('FriendInvitationByEmailVerifyProcess, saving:', saving, ', or waiting for invitationStatus:', invitationStatus);
      return (
        <div>
          <DelayedLoad waitBeforeShow={1000}>
            <div>
              Verifying invitation code...
              {' '}
            </div>
          </DelayedLoad>
          <DelayedLoad waitBeforeShow={3000}>
            <div>
              Setting up your account...
            </div>
          </DelayedLoad>
          <DelayedLoad waitBeforeShow={5000}>
            <div>
              Preparing your ballot...
            </div>
          </DelayedLoad>
          {LoadingWheel}
        </div>
      );
    } else if (!invitationSecretKey) {
      historyPush({
        pathname: '/ballot',
        state: {
          message: 'Invitation secret key not found. Invitation not accepted.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    }

    // This process starts when we return from attempting friendInvitationByEmailVerify
    if (!invitationStatus.voterDeviceId) {
      // console.log('voterDeviceId Missing');
      return LoadingWheel;
    } else if (!invitationStatus.invitationFound) {
      historyPush({
        pathname: '/ballot',
        state: {
          message: 'Invitation not found. You may have already accepted this invitation. Invitation links may only be used once.',
          message_type: 'warning',
        },
      });
      return LoadingWheel;
    } else if (invitationStatus.attemptedToApproveOwnInvitation) {
      historyPush({
        pathname: '/friends',
        state: {
          message: 'You are not allowed to approve your own invitation.',
          message_type: 'danger',
        },
      });
      return LoadingWheel;
    } else if (invitationStatus.invitationSecretKeyBelongsToThisVoter) {
      // We don't need to do anything more except redirect to the email management page
      historyPush({
        pathname: `/wevoteintro/newfriend/${invitationSecretKey}`,
        state: {
          message: 'You have accepted your friend\'s invitation. See what your friends are supporting or opposing!',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    } else if (invitationStatus.voterHasDataToPreserve) {
      // If so, ask if they want to connect two accounts?
      // console.log('FriendInvitationByEmailVerifyProcess yesPleaseMergeAccounts is FALSE');
      // Display the question of whether to merge accounts or not
      return (
        <WouldYouLikeToMergeAccounts
          cancelMergeFunction={this.cancelMergeFunction}
          pleaseMergeAccountsFunction={this.setYesPleaseMergeAccounts}
        />
      );
      // return <span>WouldYouLikeToMergeAccounts</span>;
    } else {
      // Go ahead and merge the accounts, which means deleting the current voter and switching to the invitation owner
      // console.log('FriendInvitationByEmailVerifyProcess - voterHasDataToPreserve is FALSE');
      this.voterMergeTwoAccountsByInvitationKey(invitationSecretKey);
      // return <span>this.voterMergeTwoAccountsByInvitationKey - go ahead</span>;
      return (
        <div>
          <DelayedLoad waitBeforeShow={1000}>
            <div>
              Verifying invitation code.
              {' '}
            </div>
          </DelayedLoad>
          <DelayedLoad waitBeforeShow={3000}>
            <div>
              Setting up your account.
            </div>
          </DelayedLoad>
          <DelayedLoad waitBeforeShow={5000}>
            <div>
              Preparing your ballot.
            </div>
          </DelayedLoad>
          {LoadingWheel}
        </div>
      );
    }
  }
}
