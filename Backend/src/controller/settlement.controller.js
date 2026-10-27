
let settlementModel=require('../model/settlement.model');
let groupMemberModel=require('../model/groupmember.model');
let Imagekit = require("@imagekit/nodejs");
let expenseModel=require('../model/expense.model');
const { toFile } = require("@imagekit/nodejs");

// // async function createSettlement(req,res){
// //     try{
// //     let groupId=req.params.id;
// //     let {paidTo,amount}=req.body;

// //     let ispaidToExist=await groupMemberModel.findOne({
// //         group:groupId,
// //         user:paidTo
// //     })

// //     if(!ispaidToExist){
// //         return res.status(400).json({
// //             message:"The User You Want To Paid Do Not Exist"
// //         })
// //     }

// //     if(paidTo==req.user.id){
// //         return res.status(400).json({
// //             message:"You Can Not Do Settlement By Your Own"
// //         })
// //     }

// //     let isSettled=await settlementModel.findOne({
// //         group:groupId,
// //         paidTo:paidTo,
// //         amount:amount,
// //         paidBy:req.user.id,
// //         isSettled:'true'
// //     })
// // console.log('check1');
// //     if(isSettled){
// //         return res.status(400).json({
// //             message:"Settlement is Already Done"
// //         })
// //     }

// //     let settlement=await settlementModel.create({
// //         group:groupId,
// //         paidBy:req.user.id,
// //         paidTo:paidTo,
// //         amount:amount,
// //         isSettled:'false'
// //     })
// // console.log('check2');
// //     await settlement.populate('paidBy','name email avatar')
// //     await settlement.populate('paidTo','name email avatar')

// //     return res.status(201).json({
// //         message:"Request For Settlement Is Suceessful",
// //         settlement:settlement
// //     })
// // }
// // catch(err){
// //     return res.status(500).json({
// //         message:"Something Went Wrong",
// //         error:err.message
// //     })
// // }





// }


// async function createSettlement(req, res) {
//     try {
//         let groupId = req.params.id;
//         let { paidTo, amount } = req.body;

//         // The logged-in user is the person who owes money
//         let paidBy = req.user.id;

//         // 1. Check whether the receiver belongs to the group
//         let isPaidToExist = await groupMemberModel.findOne({
//             group: groupId,
//             user: paidTo
//         });

//         if (!isPaidToExist) {
//             return res.status(400).json({
//                 message: "The user you want to pay does not exist in this group"
//             });
//         }

//         // 2. Prevent self-settlement
//         if (paidTo == paidBy) {
//             return res.status(400).json({
//                 message: "You cannot settle with yourself"
//             });
//         }

//         // 3. Check whether a pending settlement already exists
//         let existingSettlement = await settlementModel.findOne({
//             group: groupId,
//             paidBy: paidBy,
//             paidTo: paidTo,
//             isSettled: false
//         });

//         if (existingSettlement) {
//             return res.status(400).json({
//                 message: "A settlement request already exists"
//             });
//         }

//         // 4. Create settlement using the authenticated user
//         let settlement = await settlementModel.create({
//             group: groupId,
//             paidBy: paidBy,
//             paidTo: paidTo,
//             amount: amount,
//             isSettled: false
//         });

//         await settlement.populate("paidBy", "name email avatar");
//         await settlement.populate("paidTo", "name email avatar");

//         return res.status(201).json({
//             message: "Settlement request created successfully",
//             settlement
//         });

//     } catch (err) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: err.message
//         });
//     }
// }

async function createSettlement(req, res) {
    try {
        const groupId = req.params.id;
        const { paidTo, amount } = req.body;
        const paidBy = req.user.id;
        const paymentAmount = Number(amount);

        // 1. Validate the payment amount
        if (
            !paidTo ||
            !Number.isFinite(paymentAmount) ||
            paymentAmount <= 0
        ) {
            return res.status(400).json({
                message: "Please provide a valid receiver and amount."
            });
        }

        // 2. Ensure the receiver belongs to this group
        const receiverExists = await groupMemberModel.findOne({
            group: groupId,
            user: paidTo
        });

        if (!receiverExists) {
            return res.status(400).json({
                message: "The receiver does not belong to this group."
            });
        }

        // 3. Prevent paying yourself
        if (paidTo.toString() === paidBy.toString()) {
            return res.status(400).json({
                message: "You cannot settle with yourself."
            });
        }

        // 4. Prevent duplicate pending payment requests
        const existingSettlement = await settlementModel.findOne({
            group: groupId,
            paidBy: paidBy,
            paidTo: paidTo,
            isSettled: false
        });

        if (existingSettlement) {
            return res.status(400).json({
                message: "A pending settlement request already exists."
            });
        }

        // 5. Calculate the group's current balances
        const expenses = await expenseModel.find({
            group: groupId
        });

        // Only confirmed payments reduce outstanding debt
        const confirmedSettlements = await settlementModel.find({
            group: groupId,
            isSettled: true
        });

        const balanceMap = {};

        for (const expense of expenses) {
            const payerId = expense.paidBy.toString();

            balanceMap[payerId] =
                (balanceMap[payerId] || 0) + expense.amount;

            for (const split of expense.splits) {
                const userId = split.user.toString();

                balanceMap[userId] =
                    (balanceMap[userId] || 0) - split.amount;
            }
        }

        for (const settlement of confirmedSettlements) {
            const debtorId = settlement.paidBy.toString();
            const creditorId = settlement.paidTo.toString();

            balanceMap[debtorId] =
                (balanceMap[debtorId] || 0) + settlement.amount;

            balanceMap[creditorId] =
                (balanceMap[creditorId] || 0) - settlement.amount;
        }

        // 6. Generate suggested payments using the same
        // debt-balancing algorithm as balance.controller.js
        const creditors = [];
        const debtors = [];

        for (const [userId, balance] of Object.entries(balanceMap)) {
            if (balance > 0.01) {
                creditors.push({
                    userId,
                    amount: balance
                });
            } else if (balance < -0.01) {
                debtors.push({
                    userId,
                    amount: Math.abs(balance)
                });
            }
        }

        creditors.sort((a, b) => b.amount - a.amount);
        debtors.sort((a, b) => b.amount - a.amount);

        let outstandingAmount = 0;
        let i = 0;
        let j = 0;

        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];

            const settleAmount = Math.min(
                creditor.amount,
                debtor.amount
            );

            // Accept only the payment pair suggested by the
            // group's current debt calculation
            if (
                debtor.userId === paidBy.toString() &&
                creditor.userId === paidTo.toString()
            ) {
                outstandingAmount = settleAmount;
                break;
            }

            creditor.amount -= settleAmount;
            debtor.amount -= settleAmount;

            if (creditor.amount < 0.01) {
                i++;
            }

            if (debtor.amount < 0.01) {
                j++;
            }
        }

        // 7. Reject payments to people the user does not owe
        if (outstandingAmount <= 0.01) {
            return res.status(400).json({
                message: "You do not owe this person any money."
            });
        }

        // 8. Reject amounts above the suggested outstanding debt
        if (paymentAmount > outstandingAmount + 0.001) {
            return res.status(400).json({
                message:
                    `Payment cannot exceed your outstanding debt of ₹${outstandingAmount.toFixed(2)}.`
            });
        }

        // 9. Create the settlement only after all validations pass
        const settlement = await settlementModel.create({
            group: groupId,
            paidBy: paidBy,
            paidTo: paidTo,
            amount: paymentAmount,
            isSettled: false
        });

        await settlement.populate("paidBy", "name email avatar");
        await settlement.populate("paidTo", "name email avatar");

        return res.status(201).json({
            message: "Settlement request created successfully.",
            settlement
        });

    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong.",
            error: err.message
        });
    }
}


async function getGroupSettlements(req,res){
    try{
    let groupId=req.params.id;

    let settlements=await settlementModel.find({group:groupId})
    .populate('paidBy','name email avatar')
    .populate('paidTo','name email avatar')
    .sort({createdAt:-1})

    return res.status(200).json({
        message:"All Settlements Fetched Successfully",
        settlements:settlements
    })
}
catch(err){
    return res.status(500).json({
        message:"Something Went Wrong",
        error:err.message
    })
}



}

async function confirmSettlement(req,res){
    try{
    let settlementId=req.params.settlementId;

    let settlement=await settlementModel.findById(settlementId)

    if(!settlement){
        return res.status(400).json({
            message:"Settlement Not Found"
        })
    }

    if(settlement.paidTo!=req.user.id){
        return res.status(403).json({
            message:"Only The Receiver Can Conform The Settlement "
        })
    }

    if(settlement.isSettled=='true'){
        return res.status(400).json({
            message:"The Settlement Is Already Confirmed"
        })
    }

   settlement.isSettled=true;
   await settlement.save();

   return res.status(200).json({
     message:"Settlement Confirmed Successfully",
     settlement:settlement
   })
}
catch(err){
    return res.status(500).json({
        message:"Something Went Wrong",
        error:err.message
    })
}


}

async function uploadScreenshot(req,res){
    let imagekit = new Imagekit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });

    let settlementId=req.params.settlementId;

    let settlement=await settlementModel.findById(settlementId);

    if(!settlement){
        return res.status(400).json({
            message:"Settlement Is Required To upload Screenshot"
        })
    }

    if(!req.file){
        return res.status(400).json({
            message:"No File Uploaded"
        })
    }

    if(settlement.paidBy.toString()!=req.user.id){
        return res.status(403).json({
            message:"Only The User Who Paid Can Upload Screenshot"
        })
    }

    if(settlement.screenshot.fileId){
        await imagekit.deleteFile(settlement.screenshot.fileId)
    }

    let response=await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), req.file.originalname),
        fileName:`settlement_${settlementId}_${Date.now()}`,
        folder:'/settlements'
    })

    settlement.screenshot.url=response.url;
    settlement.screenshot.fileId=response.fileId
    await settlement.save()

    return res.status(201).json({
        message:"Screenshot Uploaded Successfully",
        screenshot:settlement.screenshot
    })

}

module.exports={
    createSettlement,
    getGroupSettlements,
    confirmSettlement,
    uploadScreenshot
}