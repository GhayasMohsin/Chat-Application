const socket = io()

//selecting the elements
const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#user-location')
const messages = document.getElementById('messages')

//templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate=document.getElementById('location-message-template').innerHTML
const sidebarTemplate=document.getElementById('sidebar-template').innerHTML

//accessing the querystring from the location.search
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('newUserMessage', (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('H:mm A')
    })
    messages.insertAdjacentHTML('beforeend',html)
    // messages.innerHTML=html
}) 

const autoScroll=()=>{
    const $newMessage=messages.lastElementChild //getting the last element of the message container

    //getting the height of the message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMEssageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMEssageMargin

    //visible height
    const visibleHeight=messages.offsetHeight

    //message container height
    const containerHeight=messages.scrollHeight

    //how far i have scroled?
    const scrollOffset=messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        messages.scrollTop=messages.scrollHeight
    }
}

messageForm.addEventListener('submit', (e) => {
    messageFormButton.setAttribute('disabled', "")           //disable the button
    e.preventDefault()
    const message = e.target.elements.msg.value
    socket.emit('newMessage', message, (error, response) => {
        messageFormButton.removeAttribute('disabled')        //enable the button
        messageFormInput.value = ""
        messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('delivered ')
        autoScroll()
    })
})

sendLocationButton.addEventListener('click', () => {
    sendLocationButton.setAttribute('disabled', "")
    if (!navigator.geolocation) {
        return alert('Browser Cannot Support for this')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log({
        //     Latitude:position.coords.latitude,
        //     Longitude:position.coords.longitude
        // })
        const loc = {
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude
        }
        socket.emit('sendLocation', loc, (error, acknowledgement) => {
            sendLocationButton.disabled = false
            console.log('Location Shared!')
            autoScroll()
        })
    })
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html=Mustache.render(locationTemplate,{
        username:url.username,
        url:url.url,
        createdAt:moment(url.createdAt).format('H:mm A')
    })
    messages.insertAdjacentHTML('beforeend',html)
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#side-bar').innerHTML=html
})

























// const button=document.createElement('button')
// button.innerHTML='yes'
// document.body.appendChild(button)
// button.addEventListener('click',()=>{
//     console.log('clicked')
// })

// document.querySelector('#click').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })

// socket.on('countUpdated',(count)=>{
//     console.log('count: '+count)
// })

// const button=document.getElementById
