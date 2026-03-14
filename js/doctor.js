/**
 * CarePlus Hospital System - Doctor Portal Logic
 */
$(document).ready(function() {
    
    // Check auth
    $.ajax({
        url: 'backend/api/auth.php?action=check_session',
        method: 'GET',
        dataType: 'json',
        success: function(res) {
            if (!res.success || res.role !== 'doctor') {
                window.location.href = 'login.html';
            } else {
                loadSchedule();
            }
        }
    });

    function loadSchedule() {
        $.ajax({
            url: 'backend/api/doctor.php?action=get_schedule',
            method: 'GET',
            success: function(res) {
                let tbody = $('#docAppointmentsList');
                tbody.empty();
                if(res.success && res.appointments.length > 0) {
                    res.appointments.forEach(a => {
                        let phone = a.registered_phone || a.patient_phone; // Prefer registered over guest
                        let actionHtml = '';
                        let badgeClass = a.status === 'Cancelled' ? 'bg-danger' : 
                                         a.status === 'Completed' ? 'bg-secondary' : 
                                         a.status === 'Pending' ? 'bg-warning text-dark' : 'bg-success';
                        
                        if (a.status === 'Confirmed') {
                            actionHtml = `<button class="btn btn-sm btn-outline-success rounded-pill px-3" onclick="updateStatus(${a.appointment_id}, 'Completed')">Mark Complete</button>`;
                        } else if (a.status === 'Pending') {
                            actionHtml = `<button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="updateStatus(${a.appointment_id}, 'Confirmed')">Confirm</button>`;
                        } else {
                            actionHtml = `<span class="badge ${badgeClass} px-3 py-2 rounded-pill">${a.status}</span>`;
                        }

                        tbody.append(`
                            <tr>
                                <td>
                                    <div class="fw-bold" style="color: var(--medical-teal);">${a.appointment_date}</div>
                                    <small class="text-muted"><i class="bi bi-clock"></i> ${a.time_slot}</small>
                                </td>
                                <td>
                                    <div class="fw-bold text-dark">${a.patient_name}</div>
                                    <small class="text-secondary">Ref: #${a.reference_no}</small>
                                </td>
                                <td>${phone}</td>
                                <td><span class="badge ${badgeClass} rounded-pill px-3 py-2">${a.status}</span></td>
                                <td>${actionHtml}</td>
                            </tr>
                        `);
                    });
                } else {
                    tbody.append(`<tr><td colspan="5" class="text-center py-4 text-muted">No appointments found.</td></tr>`);
                }
            }
        });
    }

    window.updateStatus = function(id, status) {
        if(confirm(`Mark appointment as ${status}?`)) {
            $.ajax({
                url: 'backend/api/doctor.php?action=update_status',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ appointment_id: id, status: status }),
                success: function(res) {
                    if(res.success) {
                        loadSchedule();
                    } else {
                        alert('Failed to update status.');
                    }
                }
            });
        }
    };

});
