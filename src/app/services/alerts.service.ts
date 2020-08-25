import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class AlertsService {
  constructor() {}

  sucessAlert(email) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Sale added to  <span style="color:#3385ff">${email}<span>.`,
      showConfirmButton: false,
      timer: 2500
    });
  }
  sucessAddCustomer(data) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `User added <span style="color:#3385ff">${data}<span>.`,
      showConfirmButton: false,
      timer: 2500
    });
  }

  failureAlert() {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `Oops...`,
      showConfirmButton: false,
      text: "Something went wrong!",
      timer: 2500
    });
  }
  deleteComfirm(): Promise<any> {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
  }
  Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: toast => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
  });
  loginSuccess() {
    this.Toast.fire({
      icon: "success",
      title: "Signed in successfully"
    });
  }
  successAlertDynamic(text) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `<span style="color:#3385ff">${text}<span>.`,
      showConfirmButton: false,
      timer: 2500
    });
  }
  failureAlertDynamic(text) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `Oops...`,
      showConfirmButton: true,
      text: text,
      timer: 2500
    });
  }
}
