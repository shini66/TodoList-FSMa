// Helper function to show toast alerts using SweetAlert2
function toastAlert(msg, type = 'success') {
    Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    }).fire({
        icon: type,
        title: msg
    });
}

function alertConfirm(title, text, confirmButtonText, cancelButtonText, onConfirm) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        },
        buttonsStyling: false
        });
    Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        reverseButtons: true
        }).then((result) => {
        if (result.isConfirmed) onConfirm();
        else if (result.dismiss === Swal.DismissReason.cancel) toastAlert('Acción cancelada', 'warning');
    });
}