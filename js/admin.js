/**
 * CarePlus Hospital System - Admin Management Logic
 */
$(document).ready(function() {
    
    // Check auth
    $.ajax({
        url: 'backend/api/auth.php?action=check_session',
        method: 'GET',
        dataType: 'json',
        success: function(res) {
            if (!res.success || res.role !== 'admin') {
                window.location.href = 'login.html';
            } else {
                loadAppointments();
            }
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
                        tbody.append(`
                            <tr>
                                <td>
                                    <div class="fw-bold" style="color: var(--primary-blue);">${d.doctor_name}</div>
                                    <small class="text-muted">${d.email}</small>
                                </td>
                                <td><span class="badge bg-light text-dark border px-2 py-1">${d.specialization}</span></td>
                                <td>${d.experience}</td>
                                <td><small class="text-muted">${d.available_days}</small></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-1" onclick='openEditModal(${JSON.stringify(d)})'>Edit</button>
                                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteDoctor(${d.doctor_id})">Remove</button>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    tbody.append(`<tr><td colspan="5" class="text-center py-4 text-muted">No doctors found.</td></tr>`);
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
