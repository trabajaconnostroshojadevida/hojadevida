import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    success(message: string) {
        this.toast.fire({
            icon: 'success',
            title: message,
            background: '#fff',
            color: '#0F172A',
            iconColor: '#F97316' // Using accent color for icon if preferred, or keep standard
        });
    }

    error(message: string) {
        this.toast.fire({
            icon: 'error',
            title: message,
            background: '#fff',
            color: '#0F172A'
        });
    }

    warning(message: string) {
        this.toast.fire({
            icon: 'warning',
            title: message,
            background: '#fff',
            color: '#0F172A'
        });
    }

    info(message: string) {
        this.toast.fire({
            icon: 'info',
            title: message,
            background: '#fff',
            color: '#0F172A'
        });
    }
}
