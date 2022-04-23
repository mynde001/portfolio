'use strict';
// Title animation - Prints letters one by one at the speed of 70 ms
// (() => {
//     // const str = "MINDAUGAS GRIGAITIS";
//     const str = "A Junior Front-End Web Developer based in Lithuania";
//     const p = document.querySelector('.main-right-container > div > p:nth-child(3)');
//     const splitStr = str.split(''); 

//     splitStr.forEach((e, i) => {
//         setTimeout(() => {
//             i > 8 ? p.innerHTML += `<span style='color: rgb(37, 37, 37);'>${e}</span>` : p.textContent += e;
//         }, i * 50); 
//     });
// })();

// General animations - Animate.style lib
(() => {
    const contactMe = document.querySelector('.main-left-container button');
    contactMe.classList.add('animate__animated', 'animate__bounceIn');
})(); 

// Footer date
(() => {
    const getDate = document.querySelector('footer > div > span');
    getDate.textContent = new Date().getFullYear();
})();

// Scroll to the bottom
document.querySelector('.main-left-container button').addEventListener('click', () => {
    window.scrollTo({
        top: document.body.scrollHeight, // Document's entire height
        left: 0,
        behavior: 'smooth'
    })
});

// Mail 
let navArr = [
    document.querySelector('nav'),
    document.querySelector('nav > p')
];

let form = document.getElementById('contact-me');
let formBtn = document.querySelector('form button');

// Removes the visibility of a notification after 5 seconds of being up and re-enables
// the button 2 seconds after the pop up vanishes
const disableVisibility = () => {
    setTimeout(() => {
        navArr.forEach(e => {
            e.classList.remove('nav-visibility');
            setTimeout(() => {
                formBtn.disabled = false;
            }, 2000);
        });
    }, 5000);
};

// Notification message when email is sent successfully or fails/displays an error
const navNotification = (color, text) => {
    navArr.forEach(e => {
        e.style.backgroundColor = color;
        e.classList.add('nav-visibility');
    });

    navArr[1].textContent = text;
};

// Creates an interval timer inside local/session storage
const formSubmitTimer = () => {
    localStorage.setItem('timer', '60');
    sessionStorage.setItem('timer', '60');
    let num, time;
    let interval = setInterval(() => {
        if (!(parseInt(localStorage.getItem('timer')) <= 0)) {
            num = parseInt(localStorage.getItem('timer'));
            num--;
            time = Date.now();
            sessionStorage.setItem('timer', String(num));
            localStorage.setItem('timer', String(num));
            localStorage.setItem('currentTime', String(time));
        } else {
            localStorage.clear();
            sessionStorage.clear();
            clearInterval(interval);
        }
    }, 1000)
};

// Continues the interval after browser is refreshed
window.onload = () => {
    let num, difference, oldValue;
    let now = Date.now();

    if (localStorage.getItem('currentTime')) { 
        // Calculates time difference in ms between when timer was invoked and now then converts the difference to seconds
        // Decrements the difference from timer
        // Difference is calculated with each new session and stored in sessionStorage
        oldValue = parseInt(localStorage.getItem('timer'));
        difference = Math.floor((now - parseInt(localStorage.getItem('currentTime'))) / 1000)
        sessionStorage.setItem('timer', String(oldValue - difference));
    };
    
    // Continue countdown if timer <= 0
    if (sessionStorage.getItem('timer') && !(parseInt(sessionStorage.getItem('timer')) <= 0) || sessionStorage.getItem('timer') !== null) {
        let interval = setInterval(() => {
            num = parseInt(sessionStorage.getItem('timer'));
            num--;
            sessionStorage.setItem('timer', String(num));
            
            if (parseInt(sessionStorage.getItem('timer')) <= 0) {
                clearInterval(interval);
                localStorage.clear();
                sessionStorage.clear();
            };
        }, 1000)
    };
};

form.addEventListener('submit', e => {
    if (localStorage.length === 0 || parseInt(localStorage.getItem('timer')) === 0) {
        document.querySelector('form button').textContent = 'PLEASE WAIT';
        fetch('/send-contact-form', {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success === true) {
                localStorage.setItem('currentTime', String(Date.now()));
                navNotification('rgb(31, 167, 31)', 'Thank you! Your submission has been sent');
                formSubmitTimer();
                disableVisibility();
            } else {
                navNotification('rgb(216, 54, 54)', 'Internal server error. Please try again later');
                disableVisibility();
            };
        })
        .catch(error => {
            if (error) {
                navNotification('rgb(214, 27, 27)', 'An error occured while sending the email message');
                disableVisibility();
            };
        }).finally(() => {
            document.querySelector('form button').textContent = 'SUBMIT';
        });
    };
    
    if (sessionStorage.getItem('timer') && parseInt(sessionStorage.getItem('timer')) !== 0) {
        navNotification('rgb(76, 109, 148)', `Please wait ${parseInt(sessionStorage.getItem('timer'))} ${parseInt(sessionStorage.getItem('timer')) === 1 ? 'second' : 'seconds'} before sending another email`);
        disableVisibility();
    };

    formBtn.disabled = true;
    e.preventDefault();
});