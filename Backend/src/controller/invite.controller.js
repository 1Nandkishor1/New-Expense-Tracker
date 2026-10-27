// let inviteModel = require('../model/invite.model');
// let groupMemberModel = require('../model/groupmember.model');
// let crypto = require('crypto');

// async function inviteByLink(req, res) {
//   try {
//     let groupId = req.params.groupId;

//     let isMember = await groupMemberModel.findOne({ group: groupId, user: req.user.id });
//     if (!isMember) {
//       return res.status(403).json({ message: "You must be a group member to create an invite link" });
//     }

//     let token = crypto.randomBytes(32).toString('hex');

//     let invite = await inviteModel.create({
//       group: groupId,
//       token: token,
//       type: 'link',
//       // FIX: was 24+60*60*1000 (≈1 hour). Now 24 hours.
//       expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
//     });

//     // FIX: link must point to the FRONTEND page /join/:token, not /api/join/:token
//     const base = (process.env.Frontend_URL || 'http://localhost:5173').replace(/\/$/, '');

//     return res.status(201).json({
//       message: "Invite Link created Successfully",
//       inviteLink: `${base}/join/${token}`,
//       invite: invite
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Something Went Wrong", error: err.message });
//   }
// }

// async function joinByLink(req, res) {
//   try {
//     // FIX: old code checked an undefined variable `token` -> ReferenceError -> always 500
//     let token_val = req.params.token;

//     if (!token_val) {
//       return res.status(400).json({ message: "Token Is required For Joining A Group" });
//     }

//     let invite = await inviteModel.findOne({ token: token_val });
//     if (!invite) {
//       return res.status(404).json({ message: "Token Is Invalid" });
//     }

//     if (invite.expiresAt < new Date()) {
//       // FIX: findOneAndDeleteById doesn't exist in Mongoose
//       await inviteModel.findByIdAndDelete(invite._id);
//       return res.status(410).json({ message: "Token Is Expired" });
//     }

//     let alreadyMember = await groupMemberModel.findOne({ group: invite.group, user: req.user.id });
//     if (alreadyMember) {
//       // Not an error for the user: tell the frontend which group to open
//       return res.status(200).json({
//         message: "Already a member of the group",
//         alreadyMember: true,
//         groupId: invite.group
//       });
//     }

//     let membership = await groupMemberModel.create({
//       group: invite.group,
//       user: req.user.id,
//       role: 'member'
//     });

//     return res.status(200).json({
//       message: 'Successfully joined the group',
//       membership,
//       groupId: invite.group
//     });
//   } catch (err) {
//     return res.status(500).json({ message: 'Something went wrong', error: err.message });
//   }
// }

// module.exports = { inviteByLink, joinByLink };


let inviteModel=require('../model/invite.model');
let groupModel=require('../model/group.model');
let groupMemberModel=require('../model/groupmember.model');
let crypto=require('crypto');

async function inviteByLink(req,res){
   try {
    let groupId=req.params.groupId;

    let isMember=await groupMemberModel.findOne({
        group:groupId,
        user:req.user.id,
    })

    if(!isMember){
       return res.status(403).json({
            message:"Group Is Requires For InviteLink"
        })
    }
        
    let token= crypto.randomBytes(32).toString('hex');

    let invite=await inviteModel.create({
        group:groupId,
        token:token,
        type:'link',
        expiresAt:new Date(Date.now()+24+60*60*1000)
    })

  return  res.status(201).json({
        message:"Invite Link created Successfully",
        inviteLink: `${process.env.CLIENT_URL}/invite/${token}`,
        invite:invite
    })}
    catch(err){
      return  res.status(500).json({Message:"Something Went Wrong", error:err.message})
    }
}

async function joinByLink(req,res){
    try {
        let token=req.params.token;

    if(!token){
        return res.status(403).json({
            message:"Token Is required For Joining A Group"
        })
    }

    let invite=await inviteModel.findOne({
        token:token
    })

    if(!invite){
        return res.status(403).json({
            message:"Token Is Invalid"
        })
    }

    if(invite.expiresAt<new Date()){
        await inviteModel.findOneAndDeleteById({_id:invite._id})
       return  res.status(403).json({
            message:"Token Is EXpired",
        })
    }

    let alreadyMember=await groupMemberModel.findOne({group:invite.group,user:req.user.id});
    
    if(alreadyMember){
      return  res.status(403).json({
            message:"Already Member Of The Group"
        })
    }

    let membership=await groupMemberModel.create({
        group:invite.group,
        user:req.user.id,
        role:'member'
    })
    // await inviteModel.findByIdAndDelete(invite._id)

    return res.status(200).json({ message: 'Successfully joined the group',membership }) }

    catch(err){
         return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }

}

module.exports={
    inviteByLink,
    joinByLink
}
