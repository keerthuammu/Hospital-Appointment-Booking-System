/**
 * CarePlus Hospital System - Authentication Logic
 */
$(document).ready(function() {
    
    // Login Form Submitted
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        let email = $('#email').val();
        let password = $('#password').val();

        $.ajax({
            url: 'backend/api/auth.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ action: 'login', email: email, password: password }),
            success: function(res) {
                if (res.success) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    
                    if (redirect) {
                        window.location.href = redirect;
                    } else {
                        if (res.role === 'admin') window.location.href = 'admin_dashboard.html';
                        else if (res.role === 'doctor') window.location.href = 'doctor_dashboard.html';
                        else if (res.role === 'patient') window.location.href = 'patient_dashboard.html';
                    }
                } else {
                    $('#loginAlert').removeClass('d-none').text(res.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Auth Login Error:", status, error);
                console.log("Server Response:", xhr.responseText);
                $('#loginAlert').removeClass('d-none').text('Server error: Check if MySQL is started and database "hospital_booking" exists.');
            }
        });
    });

    // Register Form Submitted
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        let data = {
            action: 'register',
            name: $('#regName').val(),
            email: $('#regEmail').val(),
            password: $('#regPassword').val(),
            phone: $('#regPhone').val(),
            address: $('#regAddress').val(),
            date_of_birth: $('#regDob').val()
        };

        $.ajax({
            url: 'backend/api/auth.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(res) {
                if (res.success) {
                    alert('Registration successful! Please login.');
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    if (redirect) {
                        window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
                    } else {
                        window.location.href = 'login.html';
                    }
                } else {
                    $('#regAlert').removeClass('d-none').text(res.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Auth Register Error:", status, error);
                console.log("Server Response:", xhr.responseText);
                $('#regAlert').removeClass('d-none').text('Server error: Check if MySQL is started and database "hospital_booking" exists.');
            }
        });
    });

});

// Global Logout Function
function logout() {
    $.ajax({
        url: 'backend/api/auth.php?action=logout',
        method: 'GET',
        success: function() {
            // Clear storage
            sessionStorage.clear();
            localStorage.clear();
            // Clear history and redirect
            window.location.replace('index.html');
        }
    });
}
