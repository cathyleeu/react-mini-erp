const jwt = require('jwt-simple'),
      User = require('../models/user'),
      Code = require('../models/code'),
      mongoose = require('mongoose'),
      nev = require('email-verification')(mongoose),
      siteUrl = 'http://localhost:3090',
      config = require('../config'),
      co = require('co');


const passport = require('koa-passport');
const passportConfig = require('../services/passport');

// const requireAuth = passport.authenticate('jwt', {session: false})


function createTempUser(newUser) {
  return new Promise( function (resolve, reject) {
    nev.createTempUser(newUser, function (err, existingPersistentUser, newTempUser){
      if(err) {
        reject({ err });
      } else {
        resolve({ existingPersistentUser, newTempUser });
      }
    });
  });
}
function sendVerificationEmail(email, url) {
  return new Promise( function (resolve, reject) {
    nev.sendVerificationEmail(email, url, function (err, info){
      if(err) {
        reject({ err });
      } else{
        resolve(info);
      }
    });
  });
}
function sendConfirmationEmail(email){
  return new Promise((resolve, reject) => {
    nev.sendConfirmationEmail(email, (err, info) => {
      if(err){
        reject({ err });
      } else {
        resolve(info);
      }
    })
  })
}
function confirmTempUser(url) {
  return new Promise( function (resolve, reject) {
    nev.confirmTempUser(url, function (err, user){
      resolve({
        err: err,
        user: user
      });
    });
  });
}


nev.generateTempUserModel = function(User, callback) {
  if (!User) {
    return callback(new TypeError('Persistent user model undefined.'), null);
  }
  var tempUserSchemaObject = {}, // a copy of the schema
    tempUserSchema;

  //modified from User.schema.path to User.schema.obj for copying nested values

  Object.keys(User.schema.obj).forEach(function(field) {
    tempUserSchemaObject[field] = User.schema.obj[field];
  });
  tempUserSchemaObject[nev.options.URLFieldName] = String;


  // create a TTL
  tempUserSchemaObject.createdAt = {
    type: Date,
    expires: nev.options.expirationTime.toString() + 's',
    default: Date.now
  };

  tempUserSchema = mongoose.Schema(tempUserSchemaObject);

  // copy over the methods of the schema
  Object.keys(User.schema.methods).forEach(function(meth) { // tread lightly
    tempUserSchema.methods[meth] = User.schema.methods[meth];
  });

  nev.options.tempUserModel = mongoose.model(nev.options.tempUserCollection, tempUserSchema);

  return callback(null, mongoose.model(nev.options.tempUserCollection));
};

nev.configure({
    verificationURL: siteUrl + '/signup/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'tempUsers',

    transportOptions: {
      service: 'Gmail',
      auth: {
        user: 'toycodeinc@gmail.com',
        pass: 'c0d1ng!@'
      }
    },
    verifyMailOptions: {
      from: '키즈코딩 <toycodeinc_do_not_reply@gmail.com>',
      subject: '키즈코딩 회원 이메일 인증',
      html: '<p>아래의 "인증하기"를 클릭하시면 이메일 인증이 완료됩니다 : </p><a href="${URL}">[인증하기]</a></p>',
      text: ''
    }
}, function(err, options) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('configured: ' + (typeof options === 'object'));
});


nev.generateTempUserModel(User, function(err, tempUserModel) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});



function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user._id, iat: timestamp }, config.secret)
}

// const intro = function(ctx,next){
//
// }


const signin = async(ctx, next) => {
  const gen = await passport.authenticate('local', function*(err, user, info) {
    if (err) throw err;
    if (user === false) {
      ctx.status = 401;
      ctx.body = { success: false };
    } else {
      ctx.body = { success: true, token:tokenForUser(user) };
    }
  })
  await co(gen.call(ctx, next));
};


const signup = async (ctx, next) => {
  try {
    const { email, password, Name, zipNo, roadAddr, detailAddr } = ctx.request.body;
    if(!email || !password){
      ctx.status = 422;
      ctx.body = {error: '아이디 또는 비밀번호를 입력해주세요.'};
      return;
    }
    let user = await User.findOne({email: email});
    let codeRes = await Code.findOne({dbcollection: 'User'});
    let count = codeRes ? codeRes.count : 1,
        zero = "0".repeat(5),
        resultId = "A" + (zero+count).slice(-zero.length);
    user = new User({
      email, password,
      Code: resultId,
      branch: {
        Name,
        Address:{ zipNo, roadAddr, detailAddr }
      },
      account:{ A_manager: '', A_email: '', A_phone: '' },
      education:{ E_manager: '', E_email: '', E_phone: '' }
    });

    const result = await createTempUser(user);
    if(result.existingPersistentUser) {
      ctx.body = { msg: '이미 가입된 이메일입니다.' };
      return;
    }
    if(result.newTempUser) {
      const url = result.newTempUser[nev.options.URLFieldName];
      const info = await sendVerificationEmail(email, url);

      codeRes = codeRes || new Code({
        dbcollection: 'User',
        count: count
      });
      codeRes.count++;
      const err = await codeRes.save();
      if(err) {
        await next(err);
      }
      ctx.body = {
        msg: '이메일을 인증을 확인부탁',
        token: tokenForUser(user),
        info: info
      };
    } else {
      ctx.body = {
        msg: '이미 이메일 이증메일을 보냈습니다. 확인해주세요.'
      };
    }
  } catch(err) {
    ctx.status = 500;
    ctx.body = err;
    console.log(err);
  }

  // TODO: async await에서 Promise reject의 경우 처리 필요
};

const confirmSignUp = async ctx => {
  try {
    const url = ctx.params.url;
    const user = await confirmTempUser(url);
    console.log("confirm",user)
    // TODO: 클릭이 완료되면 로그인 페이지로 자동 이동하기 ㅎㅎㅎㅎctx.render = "http:localhost:3000/login"
    ctx.body = "이메일 인증이 완료되었습니다."
    // if(user) {
    //   try {
    //     const email = await sendConfirmationEmail(user.email)
    //     ctx.body = "이메일 인증 완료"
    //   } catch (err) {
    //     ctx.status = 404;
    //     ctx.body = {err:"인증 메일 확인 전송에 실패했습니다."};
    //     console.log("이메일 확인 인증",err);
    //   }
    // }
  } catch (err) {
    ctx.status = 404;
    ctx.body = {err:"메일 인증에 실패했습니다."};
  }
}


// TODO:codeName 으로 불러오기
const allUsers = async ctx => {
  ctx.body = await User.find().where({userType: 'branch'}).select('userType email kinders branch Code account education');
}
const loggedUser = async ctx => {
  ctx.body = await User.find().where({email: ctx.params.user}).select('userType email kinders branch Code account education');
}


const userKinders = async ctx => {
  ctx.body = await User.find().where({email: ctx.params.user}).select('kinders')
}
const userInfoUpdate = async ctx => {
  try {
    // body에소 보내는 명과 model 스키마 명과 일치하는 것이 좋음!!
    const { A_manager, A_email, A_phone } = ctx.request.body.account;
    const { E_manager, E_email, E_phone } = ctx.request.body.education;
    ctx.body = await User.findOneAndUpdate(
      {email: ctx.params.user},
      {$set: {
        account: { A_manager, A_email, A_phone },
        education:{ E_manager, E_email, E_phone }
      }},
      { new: true })
  } catch(err) {
    ctx.status = 500;
    ctx.body = err;
    console.log(err);
  }
}
const userKinderUpdate = async ctx => {
  try{
    const kinders = ctx.request.body.kinders.map((kinder, i) => {
      const kinderId = 'K'+(i+1);
      const kinderCode = kinder.parentId+'-'+kinderId;
      const { parentId, manager, zipNo, roadAddr, detailAddr, managerPh, name, phone} = kinder;
      return({
        code: kinderCode, parentId, manager,
        zipNo, roadAddr, detailAddr,
        managerPh, name, phone,
        kinderClasses: kinder.kinderClasses.map((kinderClass, i) => ({
          _id: kinderId+'-KC'+(i+1),
          code: kinderCode+'-KC'+(i+1),
          className: kinderClass.className,
          students: kinderClass.students
        }))
      })})
      ctx.body = await User.findOneAndUpdate({email: ctx.params.user}, {$set: {kinders}}, { new: true })
  } catch(err){
    ctx.status = 500;
    ctx.body = err;
    console.log(err);
  }
}

module.exports = {
  signin, signup, confirmSignUp, allUsers, loggedUser, userKinders, userInfoUpdate, userKinderUpdate
};