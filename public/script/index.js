'use strict';
let mainContainer = document.querySelector('.main-left-container');

// Title letter print animation
(() => {
    const str = "A Junior Front-End Web Developer based in Lithuania";
    const splitStr = str.split(''); 

    splitStr.forEach((e, i) => {
        setTimeout(() => {
            if (i > 1 && i < 32) {
                mainContainer.querySelector('p:last-of-type').innerHTML += `<strong>${e}</strong>`;
            } else {
                mainContainer.querySelector('p:last-of-type').innerHTML += e;
            };
        }, i * 35); 
    });
})();

let mainButton = mainContainer.querySelector('button');

// Animate.style lib
(() => {
    mainButton.classList.add('animate__animated', 'animate__bounceIn');
})(); 

// Footer date
(() => {
    const getDate = document.querySelector('footer > div > span');
    getDate.textContent = new Date().getFullYear();
})();

// Scroll to the bottom
mainButton.addEventListener('click', () => {
    window.scrollTo({
        top: document.body.scrollHeight, // Document's entire height
        left: 0,
        behavior: 'smooth'
    })
});

// Mail 
let form = document.getElementById('contact-me');
let formBtn = document.querySelector('form button');

// Pop up bar
let notification = document.querySelector('.notification');

// Pop up bar children
let children = Array.from(notification.children);

// P elements of second child
let p = children[1].children;

// Removes visibility class on click or automatically
const disableVisibility = () => {
    const visibilityTimer = setTimeout(() => {
        notification.classList.remove('visibility');
        formBtn.disabled = false;
    }, 5000);

    notification.querySelector('.fa-xmark').addEventListener('click', () => {
        notification.classList.remove('visibility');
        formBtn.disabled = false;
        clearTimeout(visibilityTimer);
    });
};

let iArr = [
    notification.querySelector('i:first-of-type')
];

// Notification message
const popup = (color, icon, toptext, bottomtext) => {
    notification.classList.add('visibility');
    notification.style.borderLeft = `solid 0.35rem ${color}`;

    // Icon
    iArr.forEach(e => {
        e.classList.add('fa-solid', icon);
        e.style.color = color;
    });

    p[0].innerHTML = `<strong>${toptext}</strong>`;
    p[1].textContent = bottomtext;
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
        difference = Math.floor((now - parseInt(localStorage.getItem('currentTime'))) / 1000);
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
    notification.querySelector('i:first-of-type').removeAttribute('class');
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
                popup('#43d55f', 'fa-circle-check', 'Success', 'Thank you! Your submission has been sent');
                formSubmitTimer();
            } else {
                popup('#ff0000', 'fa-circle-exclamation', 'Error', 'Internal server error. Please try again later');
            };
        })
        .catch(error => {
            if (error) {
                popup('#ff0000', 'fa-circle-exclamation', 'Error', 'An error occured while sending the email message');
            };
        }).finally(() => {
                disableVisibility();
                document.querySelector('form button').textContent = 'SUBMIT';
        });
    };
    
    if (sessionStorage.getItem('timer') && parseInt(sessionStorage.getItem('timer')) !== 0) {
        popup('#2e86ea', 'fa-circle-info', 'Info', `Please wait ${parseInt(sessionStorage.getItem('timer'))} ${parseInt(sessionStorage.getItem('timer')) === 1 ? 'second' : 'seconds'} before sending another email`);
        disableVisibility();
    };

    formBtn.disabled = true;
    e.preventDefault();
});