import React from 'react';
import { connect } from 'react-redux'
import BranchContainer from './BranchContainer'
import RequestedIVesContainer from './RequestedIVesContainer'


const AccountContainer = ({user}) => (
  <div>
    {user._id && (
      <div className="has-Header Container">
        <BranchContainer user={user} />
        <RequestedIVesContainer />
      </div>
    )}
  </div>
)




function mapStateToProps(state, ownProps){
  return {
    user: state.auth.user
  }
}


export default connect(mapStateToProps)(AccountContainer)
// export default AccountContainer