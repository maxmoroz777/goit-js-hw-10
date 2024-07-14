import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const form = document.querySelector(".form");
form.addEventListener("submit", handleSubmit);

function handleSubmit(evt) {
    evt.preventDefault();

    const item = {};
    const formData = new FormData(evt.target).forEach((value, key) => {
        item[key] = value;
    });
    
    const delayInput = item.delay;
    const stateInput = item.state;

    evt.target.reset();

    const promise = new Promise((res, rej) => {
        setTimeout(() => {
            if (stateInput === "fulfilled") {
                res(delayInput);
            }
            else {
                rej(delayInput);
            }
        }, delayInput);
    });

    promise.then(delay => {
        iziToast.success({ message: `✅ Fulfilled promise in ${delay} ms`, });
    })
        .catch(delay => {
            iziToast.error({ message: `❌ Rejected promise in ${delay} ms`, });
        });
};
