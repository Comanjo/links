const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context) {
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
  })
}

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

async function vote(parent, args, context) {
  const userId = getUserId(context)
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  })
}

async function deleteLink(parent, { id }, context){
 
  // const voteExists = await context.prisma.$exists.vote({
  //   vote:{id: args.voteId}
  // })
  // if (voteExists)
  //  return context.prisma.deleteVote()
  // console.log( 'desribe log here:',args)

  const linkExists = await context.prisma.$exists.link({
    id
  })
  if (!linkExists) {
    throw new Error(`dosent exist`)
  }
  // if (!voteExists)
  //  context.prisma.deleteLink()

  return context.prisma.deleteLink({ id })
  console.log('Describe the Log output here: ', args)
  
}

async function updateLink(parent, {id, description}, context) {
  const linkExists = await context.prisma.$exists.link({
    id,
    description
  })
  console.log(id)
  if (!linkExists) {
    throw new Error(`No link`)
  }

  return context.prisma.updateLink({
   where: {id},
   data: {description}

  })
}



module.exports = {
  post,
  signup,
  login,
  vote,
  deleteLink,
  updateLink,
}
