/**
 * CarePlus Hospital System - Main Global Logic
 * Handles booking flow, dynamic slot loading, and global navigation.
 */
$(document).ready(function () {
    let globalDoctorsData = [];
    let globalBookedSlots = [];

    // --- INITIALIZATION ---
    let today = new Date().toISOString().split('T')[0];
    $('#appointmentDate').attr('min', today);

    // Initial Data Loading
    loadDoctors();
    checkLoginState();

    function checkLoginState() {
        $.ajax({
            url: 'backend/api/auth.php?action=check_session',
            method: 'GET',
            dataType: 'json',
            success: function(res) {
                const isBookingPage = window.location.pathname.includes('booking.html');
                
                if(res.success && res.role === 'patient') {
                    // Fetch profile to auto-fill
                    $.ajax({
                        url: 'backend/api/patient.php?action=get_profile',
                        method: 'GET',
                        success: function(profRes) {
                            if(profRes.success && $('#patientName').length) {
                                $('#patientName').val(profRes.profile.name).prop('readonly', true);
                                $('#patientPhone').val(profRes.profile.phone).prop('readonly', true);
                            }
                        }
                    });

                    // Update Nav - Change Login to My Dashboard
                    $('.auth-btn').attr('href', 'patient_dashboard.html').html('My Dashboard');
                    $('.login-link').attr('href', 'patient_dashboard.html').html('My Dashboard');
                } else if(res.success && res.role === 'admin') {
                    $('.auth-btn').attr('href', 'admin_dashboard.html').html('Admin Panel');
                    $('.login-link').attr('href', 'admin_dashboard.html').html('Admin Panel');
                    if(isBookingPage) window.location.href = 'admin_dashboard.html';
                } else if(res.success && res.role === 'doctor') {
                    $('.auth-btn').attr('href', 'doctor_dashboard.html').html('Doctor Portal');
                    $('.login-link').attr('href', 'doctor_dashboard.html').html('Doctor Portal');
                    if(isBookingPage) window.location.href = 'doctor_dashboard.html';
                } else {
                    // Not logged in
                    if(isBookingPage) {
                        window.location.href = 'login.html?redirect=booking.html';
                    }
                }
            }
        });
    }

    function loadDoctors() {
        $.getJSON('backend/api/get_doctors.php', function (data) {
            globalDoctorsData = data;
            populateDepartmentDropdown(data);
            populateDoctorDropdown(data);
            renderHomeDoctors(data);
        }).fail(function () {
            console.error("Error loading doctor data.");
        });
    }

    function renderHomeDoctors(doctors) {
        let $grid = $('#homeDoctorsGrid');
        if (!$grid.length) return; // Not on home page
        $grid.empty();

        // Show only first 8 doctors on home page
        doctors.slice(0, 8).forEach(function (doc) {
            let cardHtml = `
                <div class="doc-home-card glass-card">
                    <img src="${doc.photo}" alt="${doc.name}">
                    <div class="doc-card-body">
                        <div class="doc-spec">${doc.specialization}</div>
                        <h3 style="margin: 0.5rem 0; font-size: 1.2rem;">${doc.name}</h3>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                            ${doc.experience} Exp | ${doc.fee}
                        </div>
                        <a href="booking.html" class="btn-primary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem; width: 100%; justify-content: center;">Book Now</a>
                    </div>
                </div>
            `;
            $grid.append(cardHtml);
        });
    }

    function populateDepartmentDropdown(doctors) {
        let departments = [...new Set(doctors.map(doc => doc.specialization))];
        let $select = $('#departmentSelect');
        departments.forEach(function (dept) {
            let optionHtml = `<option value="${dept}">${dept}</option>`;
            $select.append(optionHtml);
        });
    }

    function populateDoctorDropdown(doctors) {
        let $select = $('#doctorSelect');
        $select.find('option:not(:first)').remove(); // Clear existing options except placeholder
        doctors.forEach(function (doc) {
            let optionHtml = `<option value="${doc.id}">${doc.name} (${doc.specialization})</option>`;
            $select.append(optionHtml);
        });
    }

    // Filter doctors when department changes
    $('#departmentSelect').on('change', function () {
        let selectedDept = $(this).val();
        let filteredDoctors = selectedDept === 'all'
            ? globalDoctorsData
            : globalDoctorsData.filter(doc => doc.specialization === selectedDept);

        populateDoctorDropdown(filteredDoctors);
        $('#doctorSelect').val(''); // Reset doctor selection
        refreshSlotView(); // Reset slots view
    });

    // 2. Event Listeners for updating slots dynamically
    $('#doctorSelect, #appointmentDate').on('change', function () {
        refreshSlotView();
    });

    function refreshSlotView() {
        let doctorId = $('#doctorSelect').val();
        let selectedDate = $('#appointmentDate').val();

        // Doctor Card Logic
        let $cardSection = $('#doctorCardSection');
        if (doctorId) {
            let docInfo = globalDoctorsData.find(d => d.id === parseInt(doctorId));
            if (docInfo) {
                $('#dcPhoto').attr('src', docInfo.photo);
                $('#dcName').text(docInfo.name);
                $('#dcSpec').text(docInfo.specialization);
                $('#dcExp').text(docInfo.experience);
                $('#dcFee').text(docInfo.fee);

                $cardSection.removeClass('doctor-card-hidden').addClass('doctor-card-show');
            }
        } else {
            $cardSection.removeClass('doctor-card-show').addClass('doctor-card-hidden');
        }

        // Check if both are provided before showing slots
        if (doctorId && selectedDate) {
            checkAvailabilityAndRenderSlots(parseInt(doctorId), selectedDate);
        } else {
            resetSlotsView("Please select a doctor and appointment date to see available slots.");
        }

        // Clear any previous selection when dependencies change
        $('#selectedSlot').val("");
    }

    // 3. Dynamic Slot Loading and AJAX Availability Check
    function checkAvailabilityAndRenderSlots(doctorId, dateText) {
        $.ajax({
            url: `backend/api/check_slots.php?doctor_id=${doctorId}&date=${dateText}`,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    let bookedSlotsForDocAndDate = res.booked_slots;
                    globalBookedSlots = bookedSlotsForDocAndDate;
                    renderSlots(doctorId, bookedSlotsForDocAndDate);
                } else {
                    console.error("Failed to fetch available slots");
                    globalBookedSlots = [];
                    renderSlots(doctorId, []);
                }
            },
            error: function () {
                console.warn("Slot availability API not reachable, assuming no bookings");
                globalBookedSlots = [];
                renderSlots(doctorId, []);
            }
        });
    }

    function renderSlots(doctorId, bookedSlotsList) {
        let $container = $('#slotsContainer');
        $container.empty();

        let docRecord = globalDoctorsData.find(d => d.id === doctorId);
        if (!docRecord) return;

        if (docRecord.slots.length === 0) {
            resetSlotsView("No appointment slots available for the selected doctor.");
            return;
        }

        docRecord.slots.forEach(function (slotTime) {
            let isBooked = bookedSlotsList.includes(slotTime);
            let btnClass = isBooked ? "slot-btn booked" : "slot-btn";
            let stateAttr = isBooked ? "disabled='disabled' title='Slot is already booked'" : "";

            let btnHtml = `<button type="button" class="${btnClass}" data-slot="${slotTime}" ${stateAttr}>${slotTime}</button>`;
            $container.append(btnHtml);
        });
    }

    function resetSlotsView(msg) {
        $('#slotsContainer').html(`<p class="placeholder-text">${msg}</p>`);
    }

    // 4. Handle Slot Selection Interaction
    $('#slotsContainer').on('click', '.slot-btn:not(.booked)', function () {
        // Remove selection from all, add to this one
        $('.slot-btn').removeClass('selected');
        $(this).addClass('selected');

        // Note internal hidden field
        $('#selectedSlot').val($(this).data('slot'));
    });

    // 🛡️ 5. Handle Booking Submission & Validation - For: Joseph (jQuery) & Krishna (JS)
    // Goal: Ensure all data is accurate before sending to Jobin’s PHP backend
    $('#bookingForm').on('submit', function (e) {
        e.preventDefault();

        // Joseph: Use jQuery to grab form values and trigger the validation logic
        if (!validateForm()) {
            return;
        }

        // Form fields (validated now)
        let patientName = $('#patientName').val().trim();
        let patientPhone = $('#patientPhone').val().trim();
        let doctorId = $('#doctorSelect').val();
        let appointmentDate = $('#appointmentDate').val();
        let selectedTimeSlot = $('#selectedSlot').val();

        // Prevent Double Booking Check 
        if (globalBookedSlots.includes(selectedTimeSlot)) {
            showError($('#slotsContainer'), "Error:Selected slot is already booked. Please choose another time.");
            refreshSlotView(); // Resync slots view
            return;
        }

        // Gather final text variants for modal
        let doctorInfo = globalDoctorsData.find(d => d.id === parseInt(doctorId));
        let doctorName = doctorInfo ? doctorInfo.name : "";
        let category = doctorInfo ? doctorInfo.specialization : "";

        // Generate Random Booking Reference Number
        let refNo = "APT-" + Math.floor(10000 + Math.random() * 90000);

        // 6. Confirmation Modal
        // Save to Database via API
        let bookingData = {
            reference_no: refNo,
            doctor_id: parseInt(doctorId),
            patient_name: patientName,
            patient_phone: patientPhone,
            appointment_date: appointmentDate,
            appointment_time: selectedTimeSlot
        };

        $.ajax({
            url: 'backend/api/book_appointment.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(bookingData),
            success: function(res) {
                if (res.success) {
                    showBookingConfirmation(refNo, patientName, patientPhone, category, doctorName, appointmentDate, selectedTimeSlot);
                    
                    // Reset the form locally
                    $('#selectedSlot').val('');
                    $('#departmentSelect').val('all'); // Reset department filter
                    populateDoctorDropdown(globalDoctorsData); // Reset doctors to show all
                    resetSlotsView("Please select a doctor and date to see available slots.");
                } else {
                    showError($('#slotsContainer'), "Error: " + res.message);
                    refreshSlotView(); // Resync slots view
                }
            },
            error: function() {
                alert("Server connection error. Please try again later.");
            }
        });
    });

    function showBookingConfirmation(ref, patient, phone, category, doctor, date, slot) {
        $('#mRefNo').text(ref);
        $('#mPatientName').text(patient);
        $('#mPatientPhone').text(phone);
        $('#mCategory').text(category);
        $('#mDoctorName').text(doctor);
        $('#mDate').text(date);
        $('#mSlot').text(slot);

        $('#modalOverlay').addClass('active');
    }

    // Close Modal Event Waiter
    $('#closeModalBtn, #modalOverlay').on('click', function (e) {
        if (e.target.id === 'modalOverlay' || e.target.id === 'closeModalBtn') {
            $('#modalOverlay').removeClass('active');
            window.location.href = 'patient_dashboard.html';
        }
    });

    // Mobile Menu Toggle
    $('#menuBtn').on('click', function () {
        $(this).toggleClass('active');
        $('#navLinks').toggleClass('active');
    });

    // Close mobile menu when a link is clicked
    $('.nav-links a').on('click', function () {
        $('#menuBtn').removeClass('active');
        $('#navLinks').removeClass('active');
    });

    // Real-time validation listeners
    $('#patientName, #patientPhone, #doctorSelect, #appointmentDate').on('input blur change', function () {
        validateField($(this));
    });

    function validateField($field) {
        let val = $field.val() ? $field.val().trim() : "";
        let id = $field.attr('id');
        let isValid = true;
        let errorMsg = "";

        if (id === 'patientName') {
            if (!val) {
                isValid = false;
                errorMsg = "Patient name is required";
            } else if (val.length < 3) {
                isValid = false;
                errorMsg = "Patient name must contain at least 3 characters";
            }
        } else if (id === 'patientPhone') {
            // Basic regex for international phone numbers
            let phoneRegex = /^\+?[\d\s-]{10,15}$/;
            if (!val) {
                isValid = false;
                errorMsg = "Phone number is required";
            } else if (!phoneRegex.test(val)) {
                isValid = false;
                errorMsg = "Please enter a valid phone number";
            }
        } else if (id === 'doctorSelect') {
            if (!val) {
                isValid = false;
                errorMsg = "Please select a doctor";
            }
        } else if (id === 'appointmentDate') {
            if (!val) {
                isValid = false;
                errorMsg = "Date is required";
            }
        }

        if (!isValid) {
            showError($field, errorMsg);
        } else {
            clearError($field);
        }

        return isValid;
    }

    function validateForm() {
        let isNameValid = validateField($('#patientName'));
        let isPhoneValid = validateField($('#patientPhone'));
        let isDoctorValid = validateField($('#doctorSelect'));
        let isDateValid = validateField($('#appointmentDate'));

        let selectedTimeSlot = $('#selectedSlot').val();
        let isSlotValid = true;

        if (!selectedTimeSlot) {
            isSlotValid = false;
            showError($('#slotsContainer'), "Please select an available appointment time slot");
        } else {
            clearError($('#slotsContainer'));
        }

        return isNameValid && isPhoneValid && isDoctorValid && isDateValid && isSlotValid;
    }

    function showError($field, msg) {
        let $group = $field.closest('.form-group');
        $group.addClass('has-error');
        $field.addClass('error');
        $group.find('.error-msg').text(msg);
    }

    function clearError($field) {
        let $group = $field.closest('.form-group');
        $group.removeClass('has-error');
        $field.removeClass('error');
        $group.find('.error-msg').text('');
    }

    // We removed the static My Bookings rendering logic from this script as it's now handled entirely by the patient dashboard.

    // Sticky Nav Logic
    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $('nav').addClass('nav-sticky');
        } else {
            $('nav').removeClass('nav-sticky');
        }
    });
});
