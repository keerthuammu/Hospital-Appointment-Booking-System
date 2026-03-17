/**
 * CarePlus Hospital System - Admin Management Logic
 */

// Immediate auth check - runs before page renders
(function() {
    $.ajax({
        url: 'backend/api/auth.php?action=check_session',
        method: 'GET',
        dataType: 'json',
        cache: false,
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        },
        success: function(res) {
            if (!res.success || res.role !== 'admin') {
                window.location.replace('login.html');
                return;
            }
        },
        error: function() {
            window.location.replace('login.html');
            return;
        }
    });
})();

$(document).ready(function() {
    
    // Double-check auth on ready
    $.ajax({
        url: 'backend/api/auth.php?action=check_session',
        method: 'GET',
        dataType: 'json',
        cache: false,
        success: function(res) {
            if (!res.success || res.role !== 'admin') {
                window.location.replace('login.html');
            } else {
                loadAppointments();
            }
        },
        error: function() {
            window.location.replace('login.html');
        }
    });

    // Tab switcher
    window.switchTab = function(tabName) {
        $('.nav-item').removeClass('active');
        $(`[onclick="switchTab('${tabName}')"]`).addClass('active');

        if(tabName === 'appointments') {
            $('#appointmentsTab').removeClass('d-none');
            $('#doctorsTab').addClass('d-none');
            $('#pageTitle').text('All Appointments');
            loadAppointments();
        } else {
            $('#appointmentsTab').addClass('d-none');
            $('#doctorsTab').removeClass('d-none');
            $('#pageTitle').text('Manage Doctors');
            loadDoctors();
        }
    };

    function loadAppointments() {
        $.ajax({
            url: 'backend/api/admin.php?action=get_appointments',
            method: 'GET',
            success: function(res) {
                let tbody = $('#appointmentsList');
                tbody.empty();
                if(res.success && res.appointments.length > 0) {
                    res.appointments.forEach(a => {
                        let badgeClass = a.status === 'Cancelled' ? 'bg-danger' : 
                                         a.status === 'Completed' ? 'bg-secondary' : 
                                         a.status === 'Pending' ? 'bg-warning text-dark' : 'bg-success';
                        tbody.append(`
                            <tr>
                                <td class="fw-bold text-secondary">#${a.reference_no}</td>
                                <td>
                                    <div class="fw-bold">${a.patient_name}</div>
                                </td>
                                <td>${a.patient_phone}</td>
                                <td>
                                    <div class="fw-bold text-primary">${a.doctor_name}</div>
                                    <small class="text-muted">${a.specialization}</small>
                                </td>
                                <td>
                                    <div class="fw-500">${a.appointment_date}</div>
                                    <small class="text-muted"><i class="bi bi-clock"></i> ${a.time_slot}</small>
                                </td>
                                <td>
                                    <span class="badge ${badgeClass} rounded-pill px-3 py-2">${a.status}</span>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    tbody.append(`<tr><td colspan="6" class="text-center py-4 text-muted">No appointments found.</td></tr>`);
                }
            }
        });
    }

    function loadDoctors() {
        $.ajax({
            url: 'backend/api/admin.php?action=get_doctors',
            method: 'GET',
            success: function(res) {
                let tbody = $('#doctorsList');
                tbody.empty();
                if(res.success && res.doctors.length > 0) {
                    res.doctors.forEach(d => {
                        let docJson = JSON.stringify(d).replace(/'/g, "&#39;");
                        tbody.append(`
                            <div class="col-md-6 col-xl-4">
                                <div class="glass-card h-100 p-4 d-flex flex-column" style="border-radius: 20px;">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 class="fw-bold mb-1" style="color: var(--primary-blue); font-size: 1.1rem;">${d.doctor_name}</h5>
                                            <small class="text-muted d-block" style="font-size: 0.8rem; word-break: break-all;">${d.email}</small>
                                        </div>
                                        <span class="badge bg-light text-dark border px-2 py-1">${d.specialization}</span>
                                    </div>
                                    <div class="mb-4 text-muted small">
                                        <div class="d-flex align-items-center mb-1">
                                            <i class="bi bi-briefcase me-2 text-primary"></i> <strong>Experience:</strong> &nbsp;${d.experience}
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-calendar-check me-2 text-primary"></i> <strong>Days:</strong> &nbsp;${d.available_days}
                                        </div>
                                    </div>
                                    <div class="d-flex gap-2 mt-auto pt-3 border-top w-100">
                                        <button class="btn btn-sm btn-outline-primary rounded-pill py-2 flex-grow-1 fw-bold" onclick='openEditModal(${docJson})'>Edit</button>
                                        <button class="btn btn-sm btn-outline-danger rounded-pill py-2 flex-grow-1 fw-bold" onclick="deleteDoctor(${d.doctor_id})">Remove</button>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                } else {
                    tbody.append(`<div class="col-12 text-center py-4 text-muted">No doctors found.</div>`);
                }
            }
        });
    }

    $('#addDoctorForm').on('submit', function(e) {
        e.preventDefault();
        let data = {
            name: $('#docName').val(),
            email: $('#docEmail').val(),
            specialization: $('#docSpec').val(),
            experience: $('#docExp').val(),
            fee: $('#docFee').val(),
            available_days: $('#docDays').val(),
            available_slots: $('#docSlots').val()
        };

        $.ajax({
            url: 'backend/api/admin.php?action=add_doctor',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(res) {
                if(res.success) {
                    alert('Doctor added successfully!');
                    $('#addDoctorModal').modal('hide');
                    $('#addDoctorForm')[0].reset();
                    loadDoctors();
                } else {
                    alert('Error: ' + res.message);
                }
            }
        });
    });

    window.openEditModal = function(doctor) {
        $('#editDocId').val(doctor.doctor_id);
        $('#editDocName').val(doctor.doctor_name);
        $('#editDocEmail').val(doctor.email);
        $('#editDocSpec').val(doctor.specialization);
        $('#editDocExp').val(doctor.experience);
        $('#editDocFee').val(doctor.fee);
        $('#editDocDays').val(doctor.available_days);
        $('#editDocSlots').val(doctor.available_slots);
        
        let editModal = new bootstrap.Modal(document.getElementById('editDoctorModal'));
        editModal.show();
    };

    $('#editDoctorForm').on('submit', function(e) {
        e.preventDefault();
        let data = {
            doctor_id: $('#editDocId').val(),
            name: $('#editDocName').val(),
            email: $('#editDocEmail').val(),
            specialization: $('#editDocSpec').val(),
            experience: $('#editDocExp').val(),
            fee: $('#editDocFee').val(),
            available_days: $('#editDocDays').val(),
            available_slots: $('#editDocSlots').val()
        };

        $.ajax({
            url: 'backend/api/admin.php?action=update_doctor',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(res) {
                if(res.success) {
                    alert('Doctor updated successfully!');
                    bootstrap.Modal.getInstance(document.getElementById('editDoctorModal')).hide();
                    loadDoctors();
                } else {
                    alert('Error: ' + res.message);
                }
            }
        });
    });

    window.deleteDoctor = function(id) {
        if(confirm('Are you sure you want to remove this doctor and all associated records?')) {
            $.ajax({
                url: 'backend/api/admin.php?action=delete_doctor',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({doctor_id: id}),
                success: function(res) {
                    if(res.success) {
                        loadDoctors();
                    } else {
                        alert('Error: ' + res.message);
                    }
                }
            });
        }
    }
});
