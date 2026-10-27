// // import React, { useState } from 'react'
// // import { useParams } from 'react-router-dom'
// // import { useSettlements } from '../hooks/useSettlements'
// // import { AuthContext } from '../../context/AuthContext'
// // import { useContext } from 'react'

// // const SettlementList = () => {
// //   const { id } = useParams()
// //   let context = useContext(AuthContext)
// //   let { user } = context;
// //   const {
// //     settlements, loading, error,
// //     createSettlementHook,
// //     confirmSettlementHook,
// //     balanceSettlements,
// //     uploadScreenshotHook
// //   } = useSettlements(id)

// //   const [showForm, setShowForm] = useState(false)
// //   const [paidTo, setPaidTo] = useState('')
// //   const [amount, setAmount] = useState('')
// //   const [formError, setFormError] = useState(null)

// //   if (loading) {
// //     return (
// //       <div className="spinner-container">
// //         <div className="spinner"></div>
// //         <span className="spinner-text">Loading settlements...</span>
// //       </div>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <div className="error-message">
// //         <span>⚠️ Error: {error}</span>
// //       </div>
// //     )
// //   }
// //   const myTransactions = balanceSettlements?.filter(
// //     (t) => t.from._id === user._id
// //   )

// //   async function submitHandler(e) {
// //     e.preventDefault()
// //     try {
// //       await createSettlementHook(paidTo, parseFloat(amount))
// //       setPaidTo('')
// //       setAmount('')
// //       setShowForm(false)
// //       setFormError(null)
// //     } catch (err) {
// //       setFormError(err.message)
// //     }
// //   }

// //   function handleSelectTransaction(e) {
// //     const selected = balanceSettlements.find(t => t.to._id === e.target.value)
// //     if (selected) {
// //       setPaidTo(selected.to._id)
// //       setAmount(selected.amount)
// //     }
// //   }



// //   async function handleScreenshot(settlementId, file) {
// //     try {
// //       await uploadScreenshotHook(settlementId, file)
// //     } catch (err) {
// //       console.log(err.message)
// //     }
// //   }

// //   async function handleConfirm(settlementId) {
// //     try {
// //       await confirmSettlementHook(settlementId)
// //     } catch (err) {
// //       console.log(err.message)
// //     }
// //   }

// //   return (
// //     <div className="settlements-page">
// //       <div className="settlements-page__header">
// //         <h1 className="settlements-page__title">Settlements</h1>
// //         {!showForm && (
// //           <button className="btn btn--primary" onClick={() => setShowForm(true)}>
// //             Record a Payment
// //           </button>
// //         )}
// //       </div>

// //       {showForm && (
// //         <div className="settlement-form-card">
// //           <h2 className="settlement-form-card__title">Record a Payment</h2>
// //           {formError && <div className="error-message">{formError}</div>}
// //           <form className="form" onSubmit={submitHandler}>

// //             <div className="form-group">
// //               <label className="form-label">Pay To</label>
// //               <select
// //                 className="form-input"
// //                 onChange={handleSelectTransaction}
// //                 required
// //               >
// //                 <option value="">Select who you owe</option>
// //                 {/* {balanceSettlements?.map((t) => (
// //                   <option key={t.to._id} value={t.to._id}>
// //                     {t.to.name} — ₹{t.amount}
// //                   </option>
// //                 ))} */}
// //                 // ✅ fixed — only show transactions where logged in user owes money
// //                 {balanceSettlements
// //                   ?.filter(t => t.from._id === user?._id || t.from._id === user?.id)
// //                   .map((t) => (
// //                     <option key={t.to._id} value={t.to._id}>
// //                       {t.to.name} — ₹{t.amount}
// //                     </option>
// //                   ))
// //                 }
// //               </select>
// //             </div>

// //             <div className="form-group">
// //               <label className="form-label">Pay To</label>
// //               <select
// //                 className="form-input"
// //                 onChange={handleSelectTransaction}
// //                 required
// //               >
// //                 <option value="">Select who you owe</option>
// //                 {balanceSettlements
// //                   ?.filter(t => t.from._id === user?._id || t.from._id === user?.id)
// //                   .length === 0
// //                   ? <option disabled>You dont owe anyone</option>
// //                   : balanceSettlements
// //                     ?.filter(t => t.from._id === user?._id || t.from._id === user?.id)
// //                     .map((t) => (
// //                       <option key={t.to._id} value={t.to._id}>
// //                         {t.to.name} — ₹{t.amount}
// //                       </option>
// //                     ))
// //                 }
// //               </select>
// //             </div>

// //             // find this line
// //             {!showForm && (
// //               <button className="btn btn--primary" onClick={() => setShowForm(true)}>
// //                 Record a Payment
// //               </button>
// //             )}

// // // ✅ replace with — only show button if user actually owes someone
// //             {!showForm && balanceSettlements?.some(
// //               t => t.from._id === user?._id || t.from._id === user?.id
// //             ) && (
// //                 <button className="btn btn--primary" onClick={() => setShowForm(true)}>
// //                   Record a Payment
// //                 </button>
// //               )}

// //             <div className="form-group">
// //               <label className="form-label">Amount</label>
// //               <input
// //                 className="form-input"
// //                 value={amount}
// //                 onChange={(e) => setAmount(e.target.value)}
// //                 type="number"
// //                 placeholder="Amount"
// //                 required
// //               />
// //             </div>

// //             <button type="submit" className="btn btn--primary">
// //               Submit
// //             </button>
// //             <button
// //               type="button"
// //               className="btn btn--secondary"
// //               onClick={() => setShowForm(false)}
// //             >
// //               Cancel
// //             </button>
// //           </form>
// //         </div>
// //       )}


// //       {settlements.length === 0 ? (
// //         <div className="empty-state">
// //           <span className="empty-state__icon">🤝</span>
// //           <h2 className="empty-state__title">No settlements yet</h2>
// //           <p className="empty-state__description">Create a payment record to balance group debts.</p>
// //           {!showForm && (
// //             <button className="btn btn--primary" onClick={() => setShowForm(true)}>
// //               Record a Payment
// //             </button>
// //           )}
// //         </div>
// //       ) : (
// //         <div className="settlement-grid">
// //           {settlements.map(settlement => {
// //             const isPayer = settlement.paidBy?._id === user?.id || settlement.paidBy?._id === user?._id;
// //             const isReceiver = settlement.paidTo?._id === user?.id || settlement.paidTo?._id === user?._id;

// //             return (
// //               <div
// //                 key={settlement._id}
// //                 className={`settlement-card ${settlement.isSettled ? 'settlement-card--confirmed' : 'settlement-card--pending'}`}
// //               >
// //                 <div className="settlement-card__main">
// //                   <div className="settlement-card__details">
// //                     <p className="settlement-card__text">
// //                       <strong>{settlement.paidBy?.name}</strong> paid <strong>{settlement.paidTo?.name}</strong>
// //                     </p>
// //                     <div className="settlement-card__status-wrapper">
// //                       <span className={`badge ${settlement.isSettled ? 'badge--success' : 'badge--warning'}`}>
// //                         {settlement.isSettled ? '✅ Confirmed' : '⏳ Pending'}
// //                       </span>
// //                     </div>
// //                   </div>
// //                   <span className="settlement-card__amount">₹{settlement.amount}</span>
// //                 </div>

// //                 {settlement.screenshot?.url && (
// //                   <div className="settlement-card__image-container">
// //                     <img
// //                       src={settlement.screenshot.url}
// //                       alt='payment proof'
// //                       className="settlement-card__image"
// //                     />
// //                   </div>
// //                 )}

// //                 {((isPayer || isReceiver) && !settlement.isSettled) && (
// //                   <div className="settlement-card__actions">
// //                     {isPayer && !settlement.isSettled && (
// //                       <label className="settlement-card__file-upload">
// //                         📁 {settlement.screenshot?.url ? 'Update screenshot proof' : 'Upload screenshot proof'}
// //                         <input
// //                           type='file'
// //                           accept='image/*'
// //                           onChange={(e) => handleScreenshot(settlement._id, e.target.files[0])}
// //                         />
// //                       </label>
// //                     )}

// //                     {isReceiver && !settlement.isSettled && (
// //                       <button className="btn btn--primary" onClick={() => handleConfirm(settlement._id)}>
// //                         Confirm Payment
// //                       </button>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             )
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default SettlementList


// import React, { useState, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { useSettlements } from '../hooks/useSettlements';

// const getUserId = (value) => {
//   if (value == null) return '';

//   if (typeof value === 'object') {
//     return String(value._id ?? value.id ?? '');
//   }

//   return String(value);
// };

// const SettlementList = () => {
//   const { id } = useParams();
//   const { user } = useContext(AuthContext);

//   const {
//     settlements = [],
//     loading,
//     error,
//     createSettlementHook,
//     confirmSettlementHook,
//     balanceSettlements = [],
//     uploadScreenshotHook,
//   } = useSettlements(id);

//   const [showForm, setShowForm] = useState(false);
//   const [paidTo, setPaidTo] = useState('');
//   const [amount, setAmount] = useState('');
//   const [formError, setFormError] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const currentUserId = getUserId(user);

//   // Only debts where the logged-in user owes money.
//   const myTransactions = (balanceSettlements ?? []).filter(
//     (transaction) =>
//       getUserId(transaction.from) === currentUserId &&
//       getUserId(transaction.to) !== '' &&
//       getUserId(transaction.to) !== currentUserId &&
//       Number(transaction.amount) > 0
//   );

//   const selectedTransaction = myTransactions.find(
//     (transaction) => getUserId(transaction.to) === paidTo
//   );

//   function handleSelectTransaction(e) {
//     const selectedId = e.target.value;
//     const selected = myTransactions.find(
//       (transaction) => getUserId(transaction.to) === selectedId
//     );

//     setPaidTo(selected ? selectedId : '');
//     setAmount(selected ? String(selected.amount) : '');
//     setFormError('');
//   }

//   function closeForm() {
//     setShowForm(false);
//     setPaidTo('');
//     setAmount('');
//     setFormError('');
//   }

//   async function submitHandler(e) {
//     e.preventDefault();
//     setFormError('');

//     if (!currentUserId) {
//       setFormError('Please log in before recording a payment.');
//       return;
//     }

//     if (!selectedTransaction) {
//       setFormError('Please select a person you actually owe.');
//       return;
//     }

//     const paymentAmount = Number(amount);
//     const outstandingAmount = Number(selectedTransaction.amount);

//     if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
//       setFormError('Please enter a valid payment amount.');
//       return;
//     }

//     if (paymentAmount > outstandingAmount) {
//       setFormError(
//         `The amount cannot exceed your outstanding debt of ₹${outstandingAmount}.`
//       );
//       return;
//     }

//     try {
//       setSubmitting(true);

//       await createSettlementHook(paidTo, paymentAmount);

//       closeForm();
//     } catch (err) {
//       setFormError(
//         err?.response?.data?.message ||
//         err?.message ||
//         'Unable to create the settlement.'
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   async function handleScreenshot(settlementId, file) {
//     if (!file) return;

//     try {
//       await uploadScreenshotHook(settlementId, file);
//     } catch (err) {
//       setFormError(
//         err?.response?.data?.message ||
//         err?.message ||
//         'Unable to upload payment proof.'
//       );
//     }
//   }

//   async function handleConfirm(settlementId) {
//     try {
//       await confirmSettlementHook(settlementId);
//     } catch (err) {
//       setFormError(
//         err?.response?.data?.message ||
//         err?.message ||
//         'Unable to confirm the payment.'
//       );
//     }
//   }

//   if (loading) {
//     return (
//       <div className="spinner-container">
//         <div className="spinner" />
//         <span className="spinner-text">Loading settlements...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-message">
//         <span>⚠️ Error: {error}</span>
//       </div>
//     );
//   }

//   // Only show settlement records involving the logged-in user.
//   const mySettlements = (settlements ?? []).filter((settlement) => {
//     const payerId = getUserId(settlement.paidBy);
//     const receiverId = getUserId(settlement.paidTo);

//     return (
//       currentUserId !== '' &&
//       (payerId === currentUserId || receiverId === currentUserId)
//     );
//   });

//   return (
//     <div className="settlements-page">
//       <div className="settlements-page__header">
//         <h1 className="settlements-page__title">Settlements</h1>

//         {!showForm && myTransactions.length > 0 && (
//           <button
//             type="button"
//             className="btn btn--primary"
//             onClick={() => {
//               setFormError('');
//               setShowForm(true);
//             }}
//           >
//             Record a Payment
//           </button>
//         )}
//       </div>

//       {showForm && (
//         <div className="settlement-form-card">
//           <h2 className="settlement-form-card__title">
//             Record a Payment
//           </h2>

//           {formError && (
//             <div className="error-message">{formError}</div>
//           )}

//           {myTransactions.length === 0 ? (
//             <p>You don't owe anyone in this group.</p>
//           ) : (
//             <form className="form" onSubmit={submitHandler}>
//               <div className="form-group">
//                 <label className="form-label" htmlFor="paidTo">
//                   Pay To
//                 </label>

//                 <select
//                   id="paidTo"
//                   className="form-input"
//                   value={paidTo}
//                   onChange={handleSelectTransaction}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select who you owe
//                   </option>

//                   {myTransactions.map((transaction) => {
//                     const recipientId = getUserId(transaction.to);

//                     return (
//                       <option
//                         key={recipientId}
//                         value={recipientId}
//                       >
//                         {transaction.to?.name ?? 'Group member'} — ₹
//                         {transaction.amount}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label className="form-label" htmlFor="amount">
//                   Amount
//                 </label>

//                 <input
//                   id="amount"
//                   className="form-input"
//                   type="number"
//                   min="0.01"
//                   max={selectedTransaction?.amount ?? undefined}
//                   step="0.01"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="btn btn--primary"
//                 disabled={submitting}
//               >
//                 {submitting ? 'Submitting...' : 'Submit'}
//               </button>

//               <button
//                 type="button"
//                 className="btn btn--secondary"
//                 onClick={closeForm}
//                 disabled={submitting}
//               >
//                 Cancel
//               </button>
//             </form>
//           )}
//         </div>
//       )}

//       {mySettlements.length === 0 ? (
//         <div className="empty-state">
//           <span className="empty-state__icon">🤝</span>
//           <h2 className="empty-state__title">No settlements yet</h2>
//           <p className="empty-state__description">
//             Settlement records involving you will appear here.
//           </p>

//           {!showForm && myTransactions.length > 0 && (
//             <button
//               type="button"
//               className="btn btn--primary"
//               onClick={() => setShowForm(true)}
//             >
//               Record a Payment
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="settlement-grid">
//           {mySettlements.map((settlement) => {
//             const payerId = getUserId(settlement.paidBy);
//             const receiverId = getUserId(settlement.paidTo);

//             const isPayer = payerId === currentUserId;
//             const isReceiver = receiverId === currentUserId;
//             const isSettled = Boolean(settlement.isSettled);

//             return (
//               <div
//                 key={settlement._id}
//                 className={`settlement-card ${
//                   isSettled
//                     ? 'settlement-card--confirmed'
//                     : 'settlement-card--pending'
//                 }`}
//               >
//                 <div className="settlement-card__main">
//                   <div className="settlement-card__details">
//                     <p className="settlement-card__text">
//                       <strong>
//                         {settlement.paidBy?.name ?? 'Unknown user'}
//                       </strong>{' '}
//                       pays{' '}
//                       <strong>
//                         {settlement.paidTo?.name ?? 'Unknown user'}
//                       </strong>
//                     </p>

//                     <div className="settlement-card__status-wrapper">
//                       <span
//                         className={`badge ${
//                           isSettled
//                             ? 'badge--success'
//                             : 'badge--warning'
//                         }`}
//                       >
//                         {isSettled ? '✅ Confirmed' : '⏳ Pending'}
//                       </span>
//                     </div>
//                   </div>

//                   <span className="settlement-card__amount">
//                     ₹{settlement.amount}
//                   </span>
//                 </div>

//                 {settlement.screenshot?.url && (
//                   <div className="settlement-card__image-container">
//                     <img
//                       src={settlement.screenshot.url}
//                       alt="Payment proof"
//                       className="settlement-card__image"
//                     />
//                   </div>
//                 )}

//                 {!isSettled && (isPayer || isReceiver) && (
//                   <div className="settlement-card__actions">
//                     {isPayer && (
//                       <label className="settlement-card__file-upload">
//                         📁{' '}
//                         {settlement.screenshot?.url
//                           ? 'Update screenshot proof'
//                           : 'Upload screenshot proof'}

//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];

//                             if (file) {
//                               handleScreenshot(settlement._id, file);
//                             }

//                             e.target.value = '';
//                           }}
//                         />
//                       </label>
//                     )}

//                     {isReceiver && (
//                       <button
//                         type="button"
//                         className="btn btn--primary"
//                         onClick={() => handleConfirm(settlement._id)}
//                       >
//                         Confirm Payment
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SettlementList;


import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useSettlements } from '../hooks/useSettlements';

const getUserId = (value) => {
  if (value == null) return '';

  if (typeof value === 'object') {
    return String(value._id ?? value.id ?? '');
  }

  return String(value);
};

const SettlementList = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const {
    settlements = [],
    loading,
    error,
    createSettlementHook,
    confirmSettlementHook,
    balanceSettlements = [],
    uploadScreenshotHook,
  } = useSettlements(id);

  const [showForm, setShowForm] = useState(false);
  const [paidTo, setPaidTo] = useState('');
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = getUserId(user);

  // Show only debts belonging to the logged-in user.
  const myTransactions = (balanceSettlements ?? []).filter(
    (transaction) =>
      getUserId(transaction.from) === currentUserId &&
      getUserId(transaction.to) !== '' &&
      getUserId(transaction.to) !== currentUserId &&
      Number(transaction.amount) > 0
  );

  // Find the selected debt from the filtered transactions only.
  const selectedTransaction = myTransactions.find(
    (transaction) => getUserId(transaction.to) === paidTo
  );

  function handleSelectTransaction(e) {
    const selectedId = e.target.value;

    const selected = myTransactions.find(
      (transaction) => getUserId(transaction.to) === selectedId
    );

    setPaidTo(selected ? selectedId : '');
    setAmount(selected ? String(selected.amount) : '');
    setFormError('');
  }

  function closeForm() {
    setShowForm(false);
    setPaidTo('');
    setAmount('');
    setFormError('');
  }

  async function submitHandler(e) {
    e.preventDefault();
    setFormError('');

    if (!currentUserId) {
      setFormError('Please log in before recording a payment.');
      return;
    }

    // Do not trust a receiver that isn't in the user's own debts.
    if (!selectedTransaction) {
      setFormError('Please select a person you actually owe.');
      return;
    }

    const paymentAmount = Number(amount);
    const outstandingAmount = Number(selectedTransaction.amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setFormError('Please enter a valid payment amount.');
      return;
    }

    if (paymentAmount > outstandingAmount + 0.001) {
      setFormError(
        `The amount cannot exceed your outstanding debt of ₹${outstandingAmount}.`
      );
      return;
    }

    try {
      setSubmitting(true);

      await createSettlementHook(paidTo, paymentAmount);

      closeForm();
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to create the settlement.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleScreenshot(settlementId, file) {
    if (!file) return;

    try {
      await uploadScreenshotHook(settlementId, file);
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to upload payment proof.'
      );
    }
  }

  async function handleConfirm(settlementId) {
    try {
      await confirmSettlementHook(settlementId);
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to confirm the payment.'
      );
    }
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
        <span className="spinner-text">Loading settlements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <span>⚠️ Error: {error}</span>
      </div>
    );
  }

  // Display settlement records involving the current user.
  const mySettlements = (settlements ?? []).filter((settlement) => {
    const payerId = getUserId(settlement.paidBy);
    const receiverId = getUserId(settlement.paidTo);

    return (
      currentUserId !== '' &&
      (payerId === currentUserId || receiverId === currentUserId)
    );
  });

  return (
    <div className="settlements-page">
      <div className="settlements-page__header">
        <h1 className="settlements-page__title">Settlements</h1>

        {!showForm && myTransactions.length > 0 && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              setFormError('');
              setShowForm(true);
            }}
          >
            Record a Payment
          </button>
        )}
      </div>

      {showForm && (
        <div className="settlement-form-card">
          <h2 className="settlement-form-card__title">
            Record a Payment
          </h2>

          {formError && (
            <div className="error-message">{formError}</div>
          )}

          {myTransactions.length === 0 ? (
            <p>You don't owe anyone in this group.</p>
          ) : (
            <form className="form" onSubmit={submitHandler}>
              <div className="form-group">
                <label className="form-label" htmlFor="paidTo">
                  Pay To
                </label>

                <select
                  id="paidTo"
                  className="form-input"
                  value={paidTo}
                  onChange={handleSelectTransaction}
                  required
                >
                  <option value="" disabled>
                    Select who you owe
                  </option>

                  {myTransactions.map((transaction) => {
                    const recipientId = getUserId(transaction.to);

                    return (
                      <option
                        key={recipientId}
                        value={recipientId}
                      >
                        {transaction.to?.name ?? 'Group member'} — ₹
                        {transaction.amount}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="amount">
                  Amount
                </label>

                <input
                  id="amount"
                  className="form-input"
                  type="number"
                  min="0.01"
                  max={selectedTransaction?.amount ?? undefined}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>

              <button
                type="button"
                className="btn btn--secondary"
                onClick={closeForm}
                disabled={submitting}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {mySettlements.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">🤝</span>
          <h2 className="empty-state__title">No settlements yet</h2>
          <p className="empty-state__description">
            Settlement records involving you will appear here.
          </p>
        </div>
      ) : (
        <div className="settlement-grid">
          {mySettlements.map((settlement) => {
            const payerId = getUserId(settlement.paidBy);
            const receiverId = getUserId(settlement.paidTo);

            const isPayer = payerId === currentUserId;
            const isReceiver = receiverId === currentUserId;
            const isSettled = Boolean(settlement.isSettled);

            return (
              <div
                key={settlement._id}
                className={`settlement-card ${
                  isSettled
                    ? 'settlement-card--confirmed'
                    : 'settlement-card--pending'
                }`}
              >
                <div className="settlement-card__main">
                  <div className="settlement-card__details">
                    <p className="settlement-card__text">
                      <strong>
                        {settlement.paidBy?.name ?? 'Unknown user'}
                      </strong>{' '}
                      pays{' '}
                      <strong>
                        {settlement.paidTo?.name ?? 'Unknown user'}
                      </strong>
                    </p>

                    <div className="settlement-card__status-wrapper">
                      <span
                        className={`badge ${
                          isSettled
                            ? 'badge--success'
                            : 'badge--warning'
                        }`}
                      >
                        {isSettled ? '✅ Confirmed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>

                  <span className="settlement-card__amount">
                    ₹{settlement.amount}
                  </span>
                </div>

                {settlement.screenshot?.url && (
                  <div className="settlement-card__image-container">
                    <img
                      src={settlement.screenshot.url}
                      alt="Payment proof"
                      className="settlement-card__image"
                    />
                  </div>
                )}

                {!isSettled && (isPayer || isReceiver) && (
                  <div className="settlement-card__actions">
                    {isPayer && (
                      <label className="settlement-card__file-upload">
                        📁{' '}
                        {settlement.screenshot?.url
                          ? 'Update screenshot proof'
                          : 'Upload screenshot proof'}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                              handleScreenshot(settlement._id, file);
                            }

                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}

                    {isReceiver && (
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => handleConfirm(settlement._id)}
                      >
                        Confirm Payment
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SettlementList;
