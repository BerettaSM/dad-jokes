const button = document.querySelector('main button')
const para = document.querySelector('main p')
const spinner = document.querySelector('.spinner')

const typeText = async (text, targetElement, delayMs = 50) => {
    return new Promise((resolve) => {
        let i = 0
        targetElement.textContent = ''
        targetElement.classList.add('typing')
        const intervalId = setInterval(() => {
            const char = text[i]
            if (!char) {
                clearInterval(intervalId)
                targetElement.classList.remove('typing')
                return resolve()
            }
            targetElement.append(char)
            i++
        }, delayMs)
    })
}

const fetchNewJoke = async () => {
    const res = await fetch('https://icanhazdadjoke.com/', {
        headers: {
            Accept: 'application/json',
        },
    })
    const json = await res.json()
    if (!res.ok) {
        throw new Error(json.message || 'Something went wrong.')
    }
    return json.joke
}

const getJoke = async () => {
    document.body.classList.remove('error')
    document.body.classList.add('loading')
    button.disabled = true
    button.textContent = 'Loading..'

    try {
        const joke = await fetchNewJoke()
        await typeText(joke, para)
        button.textContent = 'Get another joke'
    } catch (e) {
        document.body.classList.add('error')
        await typeText(e.message, para, 25)
        button.textContent = 'Retry'
    }

    document.body.classList.remove('loading')
    button.disabled = false
}

button.addEventListener('click', getJoke)

getJoke()
