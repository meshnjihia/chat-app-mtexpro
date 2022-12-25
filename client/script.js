import bot from './assets/bot.ico'
import user from './assets/user.ico'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

// This code function is a loading indicator. It sets an interval of 300 milliseconds and updates the text content of the loading indicator with a period. If the loading indicator has reached three dots, it will reset it back to an empty string.

function loader(element) {
  element.textContent = ''

  loadInterval = setInterval(() => {
    element.textContent += '.'

    if (element.textContent === '....') {
      element.textContent = ''
    }
  }, 300)
}

// This code is a function that takes two parameters, an element and a text. It creates an interval that runs every 20 milliseconds and adds one character of the text to the element's innerHTML until all characters of the text have been added. Once all characters have been added, it clears the interval.
function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 20)
}

// This code is a function that generates a unique ID. The function uses the current timestamp, a random number, and the random number converted to a hexadecimal string to create an ID. The ID is then returned as a string in the format "id-timestamp-hexadecimalString".

function generateUniqueId() {
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`
}

// This code is a function that creates a chat stripe. The function takes three parameters: isAi (a boolean value that determines if the chat stripe is from an AI or not), value (the message of the chat stripe) and uniqueId (a unique identifier for the chat stripe). The function returns a string of HTML code that creates a div with class "wrapper" and class "ai" if isAi is true. Inside this div, there are two other divs, one with class "chat" and one with class "profile". The profile div contains an image tag with the source set to either bot or user depending on the value of isAi. The message div contains the value parameter as its content and has an id set to the uniqueId parameter.

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                        src=${isAi ? bot : user} 
                        alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
}

//  This code is a function that handles a form submission. It prevents the default action of the form, creates a new FormData object from the form, adds a chat stripe to the chat container with the data from the form, resets the form, generates a unique ID for the message div, adds another chat stripe to the chat container with an empty string and the unique ID, scrolls to the bottom of the chat container, creates a message div with that unique ID, adds a loader to that message div, sends an HTTP POST request to localhost:5000 with data from the form as JSON in its body, clears any intervals associated with loading and sets its inner HTML to an empty string. If it receives an OK response it parses out any trailing spaces or '\n' characters and types out text in that message div. If it receives an error response it sets its inner HTML error message
const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  form.reset()

  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId)

  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = ' '

  if (response.ok) {
    const data = await response.json()
    const parsedData = data.bot.trim() 
    typeText(messageDiv, parsedData)
  } else {
    const err = await response.text()

    messageDiv.innerHTML = 'Oh no, something went wrong'
    alert(err)
  }
}

// This code adds an event listener to a form element.When the form is submitted, the handleSubmit function is called.Additionally, when a key is pressed on the form, if the key code is 13(the enter key), then the handleSubmit function is called.
  
form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  // handle the enter key
  if (e.key === 'Enter') {
    handleSubmit(e)
  }
})
