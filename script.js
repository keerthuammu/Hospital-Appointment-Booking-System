$(document).ready(function () {
    let globalDoctorsData = [];
    let sessionBookings = []; // Store new bookings in session memory
    let globalBookedSlots = [];

    // Past Dates Validation: Set min attribute for date picker to today
    let today = new Date().toISOString().split('T')[0];
    $('#appointmentDate').attr('min', today);

    // 1. Initial Data Loading (AJAX)
    loadDoctors();
    renderMyBookings();

    function loadDoctors() {
        $.getJSON('doctors.json', function (data) {
            if (Array.isArray(data)) {
                globalDoctorsData = data;
                populateDepartmentDropdown(data);
                populateDoctorDropdown(data);
                renderHomeDoctors(data);
            } else {
                console.error("Doctor data is not an array.");
                showPageError("Failed to load specialty data format.");
            }
        }).fail(function (jqxhr, textStatus, error) {
            console.error("Error loading doctor data:", textStatus, error);
            showPageError("Please run this project using a local server (like Live Server) to see doctors and specialties.");
        });
    }

    function showPageError(msg) {
        // Show error message in place of doctors/specialties
        $('#homeDoctorsGrid').html(`<p style="text-align: center; color: #ef4444; grid-column: 1/-1;">${msg}</p>`);
        $('.placeholder-text').text(msg).css('color', '#ef4444');
        $('#departmentSelect').html(`<option value="all">${msg}</option>`);
    }

    function renderHomeDoctors(doctors) {
        let $grid = $('#homeDoctorsGrid');
        if (!$grid.length) return; // Not on home page
        $grid.empty();

        // Show only first 4 doctors on home page
        doctors.slice(0, 4).forEach(function (doc) {
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
        let depts = [];
        doctors.forEach(function(doc) {
            if (depts.indexOf(doc.specialization) === -1) {
                depts.push(doc.specialization);
            }
        });
        
        let $select = $('#departmentSelect');
        if (!$select.length) return;

        $select.find('option:not(:first)').remove(); // Clear existing except "All"
        depts.forEach(function (dept) {
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
            resetSlotsView("Please select a doctor and date to see available slots.");
        }

        // Clear any previous selection when dependencies change
        $('#selectedSlot').val("");
    }

    // 3. Dynamic Slot Loading and AJAX Availability Check
    function checkAvailabilityAndRenderSlots(doctorId, dateText) {
        $.ajax({
            url: 'bookings.json',
            method: 'GET',
            dataType: 'json',
            success: function (bookings) {
                let allBookings = bookings.concat(sessionBookings);

                // Filter booked slots for the chosen doctor and date
                let bookedSlotsForDocAndDate = allBookings
                    .filter(b => b.doctorId === doctorId && b.date === dateText)
                    .map(b => b.slot);

                // Track internally to prevent double booking on submission
                globalBookedSlots = bookedSlotsForDocAndDate;

                renderSlots(doctorId, bookedSlotsForDocAndDate);
            },
            error: function () {
                // Fallback to empty booked array if bookings.json not found
                console.warn("Could not load bookings.json, assuming no bookings.");
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
            resetSlotsView("No slots available for this doctor.");
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

    // 5. Handle Booking Submission & Validation
    $('#bookingForm').on('submit', function (e) {
        e.preventDefault();

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
            showError($('#slotsContainer'), "Error: Slot already booked. Please choose another slot.");
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
        showBookingConfirmation(refNo, patientName, patientPhone, category, doctorName, appointmentDate, selectedTimeSlot);

        // Save to session memory so it stays booked while page is open
        sessionBookings.push({
            id: refNo,
            doctorId: parseInt(doctorId),
            patientName: patientName,
            category: category,
            doctorName: doctorName,
            date: appointmentDate,
            slot: selectedTimeSlot
        });

        renderMyBookings();

        // Reset the form locally
        $('#bookingForm')[0].reset();
        $('#selectedSlot').val('');
        $('#departmentSelect').val('all'); // Reset department filter
        populateDoctorDropdown(globalDoctorsData); // Reset doctors to show all
        resetSlotsView("Please select a doctor and date to see available slots.");
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
                errorMsg = "Name must be at least 3 characters";
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
            showError($('#slotsContainer'), "Please select a time slot");
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

    // --- My Bookings Logic ---
    function renderMyBookings() {
        let $list = $('#myBookingsList');
        if (!$list.length) return; // Not on booking page or element missing

        $list.empty();
        if (sessionBookings.length === 0) {
            $list.append(`<div class="no-bookings-placeholder"><p>No active bookings found for this session.</p></div>`);
            return;
        }

        sessionBookings.forEach(function (booking, index) {
            let cardHtml = `
                <div class="booking-card">
                    <div class="bc-header">
                        <span class="bc-ref">${booking.id}</span>
                        <span style="font-size: 0.75rem; color: #16a34a; font-weight: 700;">Confirmed</span>
                    </div>
                    <div class="bc-body">
                        <p>Patient: <span>${booking.patientName}</span></p>
                        <p>Doctor: <span>${booking.doctorName}</span></p>
                        <p>Specialty: <span>${booking.category}</span></p>
                        <p>Schedule: <span>${booking.date} at ${booking.slot}</span></p>
                    </div>
                    <button class="cancel-btn" data-index="${index}">Cancel Appointment</button>
                </div>
            `;
            $list.append(cardHtml);
        });
    }

    // Handle Cancellation
    $(document).on('click', '.cancel-btn', function () {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;

        let index = $(this).data('index');
        sessionBookings.splice(index, 1);

        renderMyBookings();
        refreshSlotView(); // Free up the slot in the UI if user is looking at the same doctor/date

        // Dynamic notification
        alert("Boarding pass / Appointment has been successfully cancelled.");
    });

    // Sticky Nav Logic
    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $('nav').addClass('nav-sticky');
        } else {
            $('nav').removeClass('nav-sticky');
        }
    });
});
