// import React, { useState, useEffect, createContext } from 'react'
// import { getMe } from '../authUser/services/authServices'

// export let AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [loading, setLoading] = useState(true)
//   const [user, setUser] = useState(null)

//   function checkAuth() {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       setLoading(false)
//       return Promise.resolve()
//     }
//     return getMe()
//       .then(res => setUser(res.userdata))
//       .catch(err => {
//         // Only drop the token if the server really says it's invalid.
//         // Network errors / 500 / Render cold-start must NOT log the user out.
//         if (err?.status === 401 || err?.message === 'Invalid Token') {
//           localStorage.removeItem('token')
//         }
//       })
//       .finally(() => setLoading(false))
//   }

//   useEffect(() => { checkAuth() }, [])

//   const login = (token, userData) => {
//     localStorage.setItem('token', token)
//     setUser(userData)
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     setUser(null)
//   }

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, setLoading, login, logout, checkAuth }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }



import React,{useState,useEffect} from 'react'
import { createContext } from 'react'
import { getMe } from '../authUser/services/authServices'

export let AuthContext=createContext()
export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    let token;

    function checkAuth(){
        token=localStorage.getItem('token')
        if(token){
            getMe()
            .then(res=>setUser(res.userdata))
            .catch(()=>localStorage.removeItem('token'))
            .finally(()=>setLoading(false))
            // console.log(user)
            // console.log('ho raha')
        }

        else{
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth();
    }, [])

    let login=(token,userData)=>{
        localStorage.setItem('token',token)
        setUser(userData)
    }
    
    let logout=()=>{
        localStorage.removeItem('token',token);
        setUser(null)
    }

  return (
    <AuthContext.Provider value={{user,setUser,loading,setLoading,login,logout,checkAuth}}>
        {children}
    </AuthContext.Provider>
  )
}

