import React, {Component} from 'react';
import { RegisterKinder, UserInfo } from '../components'
import { connect } from 'react-redux'
import * as actions from '../actions'
import './BranchContainer.css'

class BranchContainer extends Component{
  handleAddChildClick = e => {
    e.preventDefault()
    const { addChild, createKinder, user } = this.props
    const branchCode = createKinder(user.Code).kinderId
    addChild(branchCode)
  }
  renderChild = (kinder, i) => {
    //map을 이용해서 각 유치원 등록 페이지를 불러오는 부분
    const { user, kinders } = this.props
    return (
      <RegisterKinder id={kinder._id} key={i} code={kinder.code} branchCode={user.Code} kinder={kinder}  kinderNo={i+1} branchEdit={kinders.branchEdit ? true : false } />
    )
  }
  render() {
    const { kinders, user, editKinder, completedAddKinder, editUser, updateUser, editedUser } = this.props
    const kindergartens = kinders.kinders
    return (
      <div>
        <div className="userInfo-header">
          <h5>지사 정보</h5>
          {kinders.userEdit ? (
            <div className="userInfo-header-btnList">
              <button
                className="button-save"
                onClick={() => editedUser(kinders.managers)}>저장</button>
              <button
                className="button-cancle"
                onClick={() => editUser(kinders.userEdit)}>취소</button>
            </div>
          ) : (
            <button
              className="button-edit"
              onClick={() => editUser(kinders.userEdit)}>수정</button>
          )}
        </div>
        <UserInfo user={user} userEdit={kinders.userEdit} updateUser={updateUser} edu={kinders.managers.education} acct={kinders.managers.account} />
        <div className="branchKinder-header">
          <h5> 지사 소속 유치원 리스트</h5>
          <div>
            {kinders.branchEdit ? (
              <div className="branchKinder-header-btnList">
                <button
                  className="button-addKinder"
                  onClick={this.handleAddChildClick}>
                  유치원 추가</button>
                <button
                  className="button-save"
                  onClick={() => completedAddKinder(kinders)}>저장</button>
                <button
                  className="button-cancle"
                  onClick={() => editKinder(kinders.branchEdit)}>
                  취소</button>
              </div>
            ):(
              <button
                className="button-edit"
                onClick={() => editKinder(kinders.branchEdit)}>수정</button>
            )}
          </div>
        </div>

        <div className="kinder-list-cont col-md-12">
            <div>
              {kindergartens.map(this.renderChild)}
            </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps){
  return {
    kinders: state.userAccount
  }
}


export default connect(mapStateToProps, actions)(BranchContainer)