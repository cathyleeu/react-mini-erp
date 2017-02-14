import React, {Component} from 'react'
import { connect } from 'react-redux'
// import * as actions from '../actions'
import {toggleSignup, toggleSignin, signupUser, signinUser} from '../actions'
import {searchAddress, selectedJuso} from '../../actions'
import './SignInAndUp.css'
import logo from '../../../public/logo.png'
import AddrModal from '../../Shop/components/AddrModal'


class SignInAndUp extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      signupCode:'',
      name: '',
      repr:'',
      bizType:'',
      bizItems:'',
      license:'',
      zipNo: '',
      roadAddr: '',
      detailAddr:'',
      isModalOpen: false,
      location: '',
      signupErr: ''
    }
  }
  onChange = e => {
    this.setState({
    [e.target.name]: e.target.value
    })
  }
  renderAlert(){
    if(this.props.errorMessage){
      return(
        <div className="alert alert-danger">
          <strong>{this.props.errorMessage}</strong>
        </div>
      )
    }
  }
  openModal = () => {
    this.setState({ isModalOpen: true })
  }
  closeModal = () => {
		const { searchAddress } = this.props
		this.setState({ isModalOpen: false, location: ''}, searchAddress(''))
	}
  isSearchAddress = () => {
		const { searchAddress } = this.props
		searchAddress(this.state.location)
	}
  isEnterAddr = (e) => {
    if(e.key === 'Enter'){
      const { searchAddress } = this.props
  		searchAddress(this.state.location)
    }
  }
  isSelectedAddress = (result) => {
		const {selectedJuso} = this.props
		selectedJuso(result)
		this.closeModal()
		this.setState({
			zipNo: result.zipNo,
			roadAddr: result.roadAddr
		})
	}
  onSubmit = e => {
    e.preventDefault()
    const { signupUser, signinUser, auth } = this.props
    if(auth.status){
      signupUser(this.state)
    } else {
      signinUser(this.state)
    }
  }
  isSignInAndUp = () => {
    const {toggleSignup, toggleSignin, auth} = this.props
    auth.status ? toggleSignin() : toggleSignup()
    this.setState({signupErr: ''})
  }
  render() {
    const { auth, juso } = this.props
    const SignUpFieldSet = (
      <div className="col-md-6">
        <fieldset className="rg-address-info form-group">
         <label htmlFor="address">주소</label>
         <div className="rg-address-zip">
           <input
            value={this.state.zipNo}
            name="Zipcode"
            type="text"
            onChange={this.onChange}
            placeholder="우편주소"
            required/>
            <div className="searchBtn" onClick={this.openModal}>주소검색</div>
            <AddrModal
              isModalOpen={this.state.isModalOpen}
              closeModal={this.closeModal}>
							<i className="fa fa-times-circle search-close" aria-hidden="true" onClick={this.closeModal}></i>
							<div className="search-address-top">
								<input className="search-input" type="search" value={this.state.location} onKeyPress={this.isEnterAddr} onChange={this.onChange} name="location" placeholder="ex) 강남구 강남대로 408" />
								<i className="fa fa-search search-icon" aria-hidden="true" onClick={this.isSearchAddress}></i>
							</div>
							<div className="search-address-results">
									{juso && juso.map((result, i)=> (
										<div className="search-address-result" key={i} onClick={() => this.isSelectedAddress(result)}>
											<p>{result.roadAddr}</p>
										</div>
									))}
							</div>
            </AddrModal>
          </div>
          <input
           value={this.state.roadAddr}
           name="roadAddr"
           className="rg-address"
           type="text"
           onChange={this.onChange}
           placeholder="주소를 입력하세요"
           required/>
           <input
            value={this.state.detailAddr}
            name="detailAddr"
            id="address"
            className="rg-address"
            type="text"
            onChange={this.onChange}
            placeholder="상세 주소를 입력하세요"
            required/>
        </fieldset>
        <fieldset className="rg-branch-info form-group">
          <label htmlFor="branch-no">사업자 번호</label>
           <input
            value={this.state.license}
            className="rg-branch-name"
            id="branch-no"
            name="license"
            type="text"
            onChange={this.onChange}
            placeholder="사업자번호"
            required/>
          <div className="rg-branch-info-ctx">
            <fieldset className="rg-branch-info-name">
            <label htmlFor="branch-name">상호명</label>
             <input
              value={this.state.name}
              className="rg-branch-name"
              id="branch-name"
              name="name"
              type="text"
              onChange={this.onChange}
              placeholder="상호명"
              required/>
            </fieldset>
            <fieldset className="rg-branch-info-repr">
              <label htmlFor="branch-repr">대표자</label>
               <input
                value={this.state.repr}
                className="rg-branch-name"
                id="branch-repr"
                name="repr"
                type="text"
                onChange={this.onChange}
                placeholder="대표자"
                required/>
            </fieldset>
          </div>
          <div className="rg-branch-info-ctx">
            <fieldset className="rg-branch-info-bizType">
             <label htmlFor="branch-bizType">업태</label>
              <input
               value={this.state.bizType}
               className="rg-branch-name"
               id="branch-bizType"
               name="bizType"
               type="text"
               onChange={this.onChange}
               placeholder="업태"
               required/>
           </fieldset>
           <fieldset className="rg-branch-info-bizItems">
             <label htmlFor="branch-bizItems">종목</label>
              <input
               value={this.state.bizItems}
               className="rg-branch-name"
               id="branch-bizItems"
               name="bizItems"
               type="text"
               onChange={this.onChange}
               placeholder="종목"
               required/>
             </fieldset>
           </div>
        </fieldset>
      </div>
    )
    return (
      <div className={ auth.status ? "SignUp-Container" : "SignIn-Container"}>
        <img src={logo} className="Auth-logo" role="presentation"/>
        <form onSubmit={this.onSubmit} className={ auth.status ? "row SignUp-Form" : "SignIn-Form"}>
          <div className={ auth.status ? "rg-user-info col-md-6" : "rg-user-info col-md-12"}>
            <fieldset className="form-group rg-user-email">
             <label htmlFor="email">이메일</label>
             <input
               value={this.state.email}
               id="email"
               name="email"
               type="text"
               placeholder="이메일 입력"
               onChange={this.onChange}
               required
             />
            </fieldset>
            <fieldset className="form-group rg-user-pw">
             <label htmlFor="password">비밀번호</label>
             <input
              id="password"
              value={this.state.password}
              name="password"
              type="password"
              onChange={this.onChange}
              placeholder="비밀번호 입력"
              required
              />
            </fieldset>
            {auth.status && (
              <fieldset className="form-group rg-user-pwCnfrm">
               <label htmlFor="passwordConfirm">비밀번호확인</label>
               <input
                value={this.state.passwordConfirm}
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                onChange={this.onChange}
                placeholder="비밀번호 확인입력"
                required/>
              <label htmlFor="branch-signupCode">가입코드</label>
               <input
                value={this.state.signupCode}
                className="rg-branch-name"
                id="branch-signupCode"
                name="signupCode"
                type="text"
                onChange={this.onChange}
                placeholder="가입코드"
                required/>
              </fieldset>
            )}
          </div>
          { auth.status && SignUpFieldSet }
          { this.renderAlert()}
          <div className="rg-submit col-md-12">
            <button action="submit">{ auth.status ? "회원가입" : "로그인"}</button>
            <div className="message">{ auth.status ? "이미 회원이신가요?" : "회원이 아니신가요?"}
              <a onClick={this.isSignInAndUp}>{ auth.status ? "로그인하기" : "회원가입 하기"}</a>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
function mapStateToProps(state){
  return{
    auth: state.auth,
    errorMessage: state.auth.error,
    juso: state.commonData.juso,
		selectedJuso: state.commonData.selectedJuso
  }
}


export default connect(mapStateToProps, {signupUser, signinUser, searchAddress, toggleSignup, toggleSignin, selectedJuso})(SignInAndUp)
