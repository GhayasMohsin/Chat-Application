const users = []

const addUsers = ({ id, username, room }) => {
    //cleaning
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate
    if (!username || !room) {
        return console.log({ error: 'Username or Room must be provided' })
    }

    //checking for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validating the username
    if (existingUser) {
        return { error: 'User name is already taken' }
    }

    //storing user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const user = users.findIndex((usr) => {
        return usr.id === id
    })

    if (user === -1) {
        return console.log('user doesnot exist')
    }

    users.splice(user, 1)[0]
    return users
}

const getUser = (id) => {
    return users.find((usr) => usr.id === id )
}

const getUsersInRoom=(room)=>{
    // room=room.trim().toLowerCase()
    return users.filter(user=> user.room===room)
}

module.exports={
    addUsers,
    removeUser,
    getUser,
    getUsersInRoom
}




// const add = addUsers({
//     id: 5,
//     username: 'usama',
//     room: 'garden'
// })
// console.log(add)



// const ccc=getUsersInRoom('garden')
// console.log(ccc)


// const c = getUser(5)
// console.log(c)

// const remove = removeUser(1)
// console.log(remove)
