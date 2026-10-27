// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { useGroupDetail } from '../hooks/useGroupDetail'

// const JoinGroup = () => {
//   const { joinByLinkHook } = useGroupDetail()
//   const { token } = useParams()
//   const navigate = useNavigate()
//   const [message, setMessage] = useState('Joining group...')
//   const [failed, setFailed] = useState(false)

//   useEffect(() => {
//     let cancelled = false
//     async function joinHandler() {
//       try {
//         const res = await joinByLinkHook(token)
//         if (cancelled) return
//         setMessage(res?.alreadyMember ? 'You are already in this group. Redirecting...' : 'Joined group! Redirecting...')
//         setTimeout(() => navigate(res?.groupId ? `/group/${res.groupId}` : '/groups'), 1500)
//       } catch (err) {
//         if (cancelled) return
//         setFailed(true)
//         setMessage(err?.message || 'Could not join the group')
//       }
//     }
//     joinHandler()
//     return () => { cancelled = true }
//   }, [token])

//   return (
//     <div>
//       <h2>{message}</h2>
//       {failed && <button onClick={() => navigate('/groups')}>Go to my groups</button>}
//     </div>
//   )
// }

// export default JoinGroup

// pages/JoinGroup.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGroupDetail } from '../hooks/useGroupDetail'



const JoinGroup = () => {
    let { joinByLinkHook } = useGroupDetail()
    const { token } = useParams()
      const navigate = useNavigate()
      const [message, setMessage] = useState('Joining group...')

    async function joinHandler(token) {
        await joinByLinkHook(token)
        setMessage('Joined Group! Redirecting')
        setTimeout(() => {
            navigate('/groups')
            
        }, 1500);
    }

    useEffect(() => {
        joinHandler(token)
    }
, [token])


return <h2>{message}</h2>
}

export default JoinGroup
