let store = Immutable.Map ({
    user:Immutable.Map({ name: "users" }),
    apod: '',
    rovers:Immutable.List(['curiosity','opportunity', 'spirit']),
    currentRover: ''
}) 


// add our markup to the page
const root = document.getElementById('root')


const updateStore=(state, newState) => {
    store = state.merge(newState)
    render(root, store)
}


const render = async (root, state) => {
    root.innerHTML = App(state)
}

//higher-order functions
// create content
const App = (state) => {
if (state.get('currentRover') === ''){ 
    return (`
        <header>
             ${displaynovbar(navbarItems)}
        </header>

    <main>
   

    <section>
    ${Greeting(state.getIn(['user', 'name']))}
    
    </section>

    </main>

    <footer></footer>


`)} else {
    return(`
        <header>
        ${displaynovbar(navbarItems)}
        </header>

        <main>
        <section>
        ${displaycontent(roverInfo,state)}
        </section>

        </main>

        <footer></footer>
    
    `)}
}
  

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    
})




// ------------------------------------------------------  COMPONENTS


// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1 class="welcome">Welcome, ${name}!<br>
            Choose the mars rover you want to discover
            
            </h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}


// Pure function 
const navbarItems =() => {
    return`
        <a href="#" class="" onclick="getRoverContent('Curiosity', store)">Curiosity</a>
        <a href="#" onclick="getRoverContent('Opportunity', store)">Opportunity</a>
        <a href="#" onclick="getRoverContent('Spirit', store)">Spirit</a>
        `
}


// ------------------------------------------------------  high order functions

//higher-order functions
const displaynovbar =(navbarItems)=>{
    return`<div class="togglearea">
                <label for="toggle">
                    <span></span>
                    <span></span> 
                    <span></span>
                </label>
            </div>
            <input type="checkbox" id="toggle">
            <div class="navbar">
                ${navbarItems()}
            </div>`

}



//higher-order functions
const roverInfo = (state) => {
        const getRover = state.get('currentRover');
        return Array.from(getRover.latest_photos)
            .map(item => 
                `   <div class="card">
                     <img src="${item.img_src}" />
                     <div class="cardInfo">
                        <p><span>Rover name:</span> ${item.rover.name}</p>
                        <p><span>Image date:</span> ${item.earth_date}</p>
                        <p><span>Launch date:</span> ${item.rover.launch_date}</p>
                        <p><span>Landing date:</span> ${item.rover.landing_date}</p>
                        <p><span>State :</span> ${item.rover.status}</p>
                    </div>
                </div>`
            ).join("")   
}


//higher-order functions
const displaycontent = (roverInfo,state)=>{
const info = roverInfo(state)
    return `<h1 class ="title-content"> The <span>${state.get('currentRover').latest_photos[0].rover.name}</span> rover </h1>
    <div class="container">${info}</div>`
}




// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}




// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async (state) => {
    let { apod } = state;
    const response = await fetch(`http://localhost:3000/apod`)
    apod = await response.json() // get data from the promise returned by .json()
    const newState = store.set('apod', apod);
    updateStore(store, newState)
    return apod;
}


const getRoverContent = async (roverName, state) => {
    let { currentRover } = state
    const response = await fetch(`http://localhost:3000/rovers/${roverName}`) 
    currentRover = await response.json() 
    const newState = store.set('currentRover', currentRover);
    updateStore(store, newState)
    return currentRover
}


