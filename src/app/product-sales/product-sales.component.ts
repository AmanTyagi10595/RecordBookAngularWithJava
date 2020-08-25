import { Component, OnInit } from "@angular/core";
import { AuthServiceService } from "./../auth-service.service";
import { FormBuilder } from "@angular/forms";
import { ConditionalExpr } from "@angular/compiler";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { AlertsService } from "../services/alerts.service";
import { UploadfilesService } from "../services/uploadfiles.service";
import { FileUploader, FileLikeObject } from "ng2-file-upload";

@Component({
  selector: "app-product-sales",
  templateUrl: "./product-sales.component.html",
  styleUrls: ["./product-sales.component.css"]
})
export class ProductSalesComponent implements OnInit {
  today = new Date();
  allCustomersEmail = [];
  result: any = [];
  obj = {
    email: ""
  };
  oneCustomerSale:any;
  saleRecord: any;
  mySwitch: boolean = true;
  minDate: any;
  customerBalance: any;
  selectedFile: File;
  process = true;
  customerDetails = {
    img_url :"",
    address : ""
};
  public FilesUploader: FileUploader = new FileUploader({
    url: "http://localhost:3000/saleRecord/add",
    disableMultipart: true,
    allowedMimeType: [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/x-eps",
      "image/bmp",
      "application/illustrator",
      "image/tiff"
    ],
    autoUpload: false
  });

  constructor(
    private service: AuthServiceService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private alerts: AlertsService,
    private Uploadfiles: UploadfilesService
  ) {
    this.saleRecord = this.fb.group({
      amount: [""],
      payedAmout: [""],
      sale_date: [""],
      promis_date: [""],
      email: [""]
    });
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.process = true;
      if (params && params.email) {
        console.log("params", params);
        this.customerDetails.img_url = params.img_url;
        this.customerDetails.address = params.address
        this.obj.email = params.email;
        this.saleRecord.patchValue({
          email: params.email
        });
        this.getCustomerBalance();
      }
      if (this.obj.email) {
        this.getOneUserSale();
      } else {
        this.getAllUsersSale();
      }
    });
  }

  getOneUserSale() {
    this.service.getOneUserSale(this.obj).subscribe(result => {
      console.log("here is one user sale",result)
      this.oneCustomerSale = result;
      this.process = false;
    });
  }
  getAllUsersSale() {
    this.service.getAllUsersSale().subscribe(result => {
      this.oneCustomerSale = result;
      console.log("input data", result);
      this.process = false;
    });
  }
  onAddSale() {
    let files = this.myFiles();
    const formData = new FormData();
    files.forEach(file => {
      formData.append("imgUploader", file.rawFile);
    });
    formData.append("test", JSON.stringify(this.saleRecord.value));
    this.service.addSalesData(this.saleRecord.value).subscribe(
      result => {
        console.log("result", result);
        this.alerts.sucessAlert(this.saleRecord.value.email);
        this.saleRecord.reset();
        if (this.obj.email) {
          this.getOneUserSale();
        } else {
          this.getAllUsersSale();
        }
      },
      err => {
        this.alerts.failureAlert();
        console.log("error: ", err);
      }
    );
  }
  async getUserEmail(event) {
    this.allCustomersEmail = [];
    if (event.target.value.length > 3) {
      await this.service.getLikeCustomer(event.target.value).subscribe(
        result => {
          this.result = result;
          this.result.forEach(e => {
            this.allCustomersEmail.push(e.email);
          });
        },
        err => {
          console.log("error: ", err);
        }
      );
    }
  }
  deleteOneSale(_id) {
    this.alerts.deleteComfirm().then(result => {
      if (result.value) {
        this.service.deleteOneSale(_id).subscribe(
          result => {
            Swal.fire("Deleted!", "This sale has been deleted.", "success");
            this.getOneUserSale();
          },
          err => {
            console.error("not deleted");
            this.alerts.failureAlert();
          }
        );
      }
    });
  }
  onSelectSaleDate(event) {
    this.minDate = this.saleRecord.value.sale_date;
  }
  getCustomerBalance() {
    this.service.getCustomerBalance(this.obj.email).subscribe(
      result => {
        this.customerBalance = result;
      },
      err => {
        console.error("not deleted", err);
      }
    );
  }

  myFiles() {
    console.log("yy", this.FilesUploader.queue);
    return this.FilesUploader.queue.map(fileItem => {
      return fileItem.file;
    });
  }
}
