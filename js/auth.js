/**
 * CarePlus Hospital System - Authentication Logic
 */
$(document).ready(function() {
    
    // Show redirect notice
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('redirect') === 'booking.html') {
        $('#loginAlert').removeClass('d-none').addClass('alert-info').text('Please login to book your appointment.');
    }
    
    // Check Session function - Redirects if already logged in based on role
    function checkSessionAndRedirect() {
        $.ajax({
            url: 'backend/api/auth.php?action=check_session',
            method: 'GET',
            dataType: 'json',
            success: function(res) {
                if (res.success) {
                    redirectBasedOnRole(res.role);
                }
            }
        });
    }

    function redirectBasedOnRole(role) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        if (redirect) {
            window.location.href = redirect;
            return;
        }

        if (role === 'admin') window.location.href = 'admin_dashboard.html';
        else if (role === 'doctor') window.location.href = 'doctor_dashboard.html';
        else if (role === 'patient') window.location.href = 'patient_dashboard.html';
    }

    // Call on load for auth pages
    if(window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
        checkSessionAndRedirect();
    }

    // Login Form Submit
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
                    redirectBasedOnRole(res.role);
                } else {
                    $('#loginAlert').removeClass('d-none').text(res.message);
                }
            },
            error: function() {
                $('#loginAlert').removeClass('d-none').text('Server error. Please try again later.');
            }
        });
    });

    // Register Form Submit
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
                    window.location.href = 'login.html';
                } else {
                    $('#regAlert').removeClass('d-none').text(res.message);
                }
            },
            error: function() {
                $('#regAlert').removeClass('d-none').text('Server error occurred.');
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
            window.location.href = 'login.html';
        }
    });
}
