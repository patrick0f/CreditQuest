const API_BASE_URL = 'http://localhost:8080';

let form = document.querySelector('#form');
let username = document.querySelector('#name');
let password = document.querySelector('#password');
let submitBtn = document.querySelector('#submit-btn');
let preloader = document.querySelector('#preloader');

async function loginUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.value,
            password: password.value
          })
        });
    
        
        const data = await response.json();
        console.log('user:', data);
        if (data.token) {
                    localStorage.setItem('token', data.token);
                }
        if (data.user.username) {
            localStorage.setItem("user", data.user.username)
        }
        return data;
      } catch (error) {
        console.error('Error fetching scores:', error);
        throw error; // Re-throw the error if you want calling code to handle it
      }
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    try {
        let user = await loginUser();
        
        if (user && user.token) window.location.href = "index.html";
    }
    catch (error) {
        console.log(error);
    }
    
    

})