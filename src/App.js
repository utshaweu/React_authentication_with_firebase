import React, { useState } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,FacebookAuthProvider} from "firebase/auth";


initializeApp(firebaseConfig);

function App() {

  const [newUser, setNewUser] = useState(false);
  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false,
  })

  const goggleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const handleSignIn = () =>{
    const auth = getAuth();
    signInWithPopup(auth, goggleProvider)
    .then(result => {
      const {displayName, photoURL, email} = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
      }
      setUser(signedInUser);
      //console.log(displayName, photoURL, email);
    })
    .catch(error => {
      console.error(error);
      console.log(error.message);
    })
  }

  const handleFbSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        console.log(user)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const handleSignOut = () =>{
    const auth = getAuth();
    signOut(auth)
    .then(result => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
      }
      setUser(signedOutUser);
    })
    .catch(error => {

    })
  }


  const handleBlur = (e) => {
    //console.log(e.target.name, e.target.value);
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      //console.log(isEmailValid);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
     .then(res => {
       const newUserInfo ={...user};
       newUserInfo.error = '';
       newUserInfo.success = true;
       setUser(newUserInfo);
       updateUserProfile(user.name);
     })
     .catch((error) => {
      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      setUser(newUserInfo);
      });
    }
    if(!newUser && user.email && user.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const newUserInfo ={...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log(res.user);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }


  const updateUserProfile = (name) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error)
    });
  }



  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
         <button onClick={handleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick={handleFbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" style={{width: '50%'}}/>
        </div>
      }

      <h1>Our own Authentication</h1>
      {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="newUser"/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your email address" required/>
        <br/>
        <input type="password" onBlur={handleBlur} name="password" placeholder="Your password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success && <p style={{color: 'green'}}>user {newUser ? 'created' : 'logged in'} successfully</p>
      }
    </div>
  );
}

export default App;
