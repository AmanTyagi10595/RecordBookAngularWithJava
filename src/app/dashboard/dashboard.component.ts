import { AuthServiceService } from "./../auth-service.service";
import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { FileUploader, FileLikeObject } from "ng2-file-upload";
import { AlertsService } from "../services/alerts.service";
import { Options, LabelType } from "ng5-slider";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as Highcharts from 'highcharts';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  closeResult: string;
  data = "test";
  profileForm: FormGroup;
  modalRef: any;
  rangeNotifier: boolean = false;
  totalCustomers: any = [];
  dateRangeNotifier = false;
  showBarGraphs: boolean = false;
  showPieGraphs: boolean = false;
  demo:boolean = false;
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

  //regarding date range picker
  dateRange: FormGroup;
  // rangesFooter = RangesFooter;
  inlineRange;

  //regarding range slider
  minValue: number = 1000;
  maxValue: number = 15000;
  options: Options = {
    floor: 0,
    ceil: 30000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min price:</b> ₹" + value;
        case LabelType.High:
          return "<b>Max price:</b> ₹" + value;
        default:
          return "₹" + value;
      }
    }
  };
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: AuthServiceService,
    private alerts: AlertsService
  ) {
    this.dateRange = fb.group({
      date: [{ begin: new Date(2020, 2, 10), end: new Date(2020, 2, 25) }]
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content);
    // this.modalRef = this.modalService.open(AbortModalComponent);
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ["", Validators.required],
      mobile: [""],
      address: [""],
      email: ["", [Validators.email, Validators.required]]
    });
    this.getAllCustomer();
  }
  onAddCustomers() {
    let files = this.myFiles();
    const formData = new FormData();
    files.forEach(file => {
      formData.append("imgUploader", file.rawFile);
    });
    let cum = {
      mo_num: this.profileForm.value.mobile,
      address: this.profileForm.value.address,
      email: this.profileForm.value.email,
      name: this.profileForm.value.name,
      balance:0
    };
    formData.append("test", JSON.stringify(cum));
    // if (this.profileForm.status == "VALID") {
    this.service.addCustomer(cum).subscribe(
      
      result => {
        // console.log("Hi data here: ", result)
        if (result["msg"] == "uploadSave") {
          this.alerts.sucessAddCustomer(", image also");
          this.getAllCustomer();
        } else {
          this.alerts.sucessAddCustomer(",but image could't");
          this.getAllCustomer();
        }
      },
      err => {
        console.log("error", err);
      }
    );

    // this.modalRef.close();
    // } else {
    // console.error("Invalid Form");
    // }
  }
  getAllCustomer() {
    this.rangeNotifier = false;
    this.service.getAllCustomer().subscribe(
      result => {
        console.log("Jai ho",result);
        this.totalCustomers = result;
      },
      err => {
        console.log("error", err)
      }
    );
  }
  myFiles() {
    console.log("yy", this.FilesUploader.queue);
    return this.FilesUploader.queue.map(fileItem => {
      return fileItem.file;
    });
  }
  deleteCustomer(email) {
    this.alerts
      .deleteComfirm()
      .then(result => {
        console.log("res", email);
        if (result && result.value) {
          let obj = {};
          obj["email"] = email;
          this.service.deleteCustomer(obj).subscribe(
            result => {
              console.log("result", result);
              if (result["status"] == "success") {
                this.alerts.successAlertDynamic("Deleted successfully");
                this.getAllCustomer();
              }
            },
            err => {
              console.log("error", err);
            }
          );
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  notifieCustomer(text) {
    let data = {};
    data["name"] = text.name;
    data["email"] = text.email;
    data["balance"] = text.balance;
    let body = new FormData();
    body.append('email', text.email);
    body.append('balance', text.balance);
    this.service.notifieSingleCustomer(body).subscribe(
      result => {
        this.alerts.successAlertDynamic("Notification Send");
      },
      err => {
        console.log("error here: ", err)
        this.alerts.failureAlertDynamic("Invalid Email");
      }
    );
  }
  getRangedCustomer() {
    // let obj = {
    //    minValue: this.minValue, 
    //    maxValue: this.maxValue 
    //   };
      let body = new FormData();
body.append('minValue', this.minValue.toString());
body.append('maxValue', this.maxValue.toString());
    this.service.getRangedCustomers(body).subscribe(
      result => {
        this.totalCustomers = result;
        this.rangeNotifier = true;
      },
      err => {
        console.log(err);
        this.alerts.failureAlert();
      }
    );
  }
  notifieRangedCustomer() {
    this.dateRangeNotifier = false;
    let data = [];
    this.totalCustomers.forEach(element => {
      let obj = {};
      obj["email"] = element.email;
      obj["name"] = element.name;
      obj["balance"] = element.balance;
      if (element.maxPromDate) {
        obj["maxPromDate"] = element.maxPromDate;
      }
      data.push(obj);
    });
    console.log("You checking here: ", data);
    this.service.notifieRangedCustomers(data).subscribe(
      result => {
        if (result["status"] == "success") {
          this.alerts.successAlertDynamic("All selected users Notified !");
        }
      },
      err => {
        console.log(err);
        this.alerts.failureAlert();
      }
    );
  }
  inlineRangeChange(event) {
    let data = event.target.value;
    let obj = {};
    obj["minValue"] = data.begin;
    obj["maxValue"] = data.end;
console.log("Dates: ", data.begin)

    this.service.dateRangedCustomers(obj).subscribe(
      result => {
        console.log(result);

        let array = [];
        result["msg"].forEach(element => {
          element.userinfo[0]["maxPromDate"] = element.maxPromDate;
          array.push(element.userinfo[0]);
        });
        console.log(array);
        this.totalCustomers = array;
        this.dateRangeNotifier = true;
      },
      err => {
        console.log(err);
      }
    );
  }

  //generate PDF by getting parsing HTML Table.
  generatePdf() {
    var doc = new jsPDF("p", "pt");
    var res = doc.autoTableHtmlToJson(document.getElementById("my-table"));
    console.log("res", res);

    var createdColumn = [res.columns[0], res.columns[1], res.columns[2]];
    // var createdData = [res.data[0], res.data[1], res.data[2]];
    doc.autoTable({ margin: { top: 80 } });

    var header = function(data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle("normal");
      //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
      doc.text("Testing Report", data.settings.margin.left, 50);
    };

    var options = {
      beforePageContent: header,
      margin: {
        top: 80
      },
      startY: doc.autoTableEndPosY() + 20
    };

    doc.autoTable(createdColumn, res.data, options);

    doc.save("table.pdf");
  }
  //Generating PDF by manualy passing dynamic data
  async generatePdf2() {
    var base64Img = "";
    function toDataURL(url, callback) {
      console.log("change to base 64");
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
          callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    }

    await toDataURL("https://i.picsum.photos/id/128/200/200.jpg", function(
      dataUrl
    ) {
      console.log("HBJFUGHiou,joik", dataUrl);
      base64Img = dataUrl;
    });

    var doc = new jsPDF("p", "pt");
    doc.autoTable({ margin: { top: 80 } });

    var array = [];
    this.totalCustomers.forEach(element => {
      let temArray = [];
      temArray.push(element.name);
      temArray.push(element.address);
      temArray.push(element.mo_num);
      temArray.push(element.balance);
      array.push(temArray);
    });
    console.log("array ", array);
    doc.autoTable({
      head: [["Name", "Address", "Mobile", "Balance"]],
      body: array,
      // for header and footer we added didDrawPage below
      didDrawPage: function(data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle("normal");

        if (base64Img) {
          doc.addImage(
            base64Img,
            "JPEG",
            data.settings.margin.left,
            15,
            10,
            10
          );
        }
        doc.text("Testing Report", data.settings.margin.left, 50);
      },
      // didDwarcell is use to overwrite the table cell using sub table or image
      // didDrawCell: function(data) {
      //   if (data.column.dataKey === 2 && data.cell.section === "body") {
      //     doc.autoTable({
      //       head: [["One", "Two"]],
      //       body: [["1", "2"]],
      //       startY: data.cell.y + 2,
      //       margin: { left: data.cell.x + data.cell.padding("left") },
      //       tableWidth: "wrap",
      //       theme: "grid",
      //       styles: {
      //         fontSize: 8,
      //         cellPadding: 1
      //       }
      //     });
      //   }
      //   if (data.column.index === 1 && data.cell.section === "body") {
      //     var td = data.cell.raw;
      //     var img = td.getElementsByTagName("img")[0];
      //     var dim = data.cell.height - data.cell.padding("vertical");
      //     var textPos = data.cell.textPos;
      //     doc.addImage(img.src, textPos.x, textPos.y, dim, dim);
      //   }
      // },
      columnStyles: {
        5: { cellWidth: 54 }
      },
      bodyStyles: {
        minCellHeight: 30
      }
    });

    doc.save("table.pdf");
  }
  // to show bar graphs
  showGraphsMethod(){ 
   var dataObj = {
                  name: "",
                  y: 0,
                  drilldown: ""
    }
    this.showBarGraphs = !this.showBarGraphs;
    this.showPieGraphs = false;
    this.totalCustomers.forEach(element => {
      this.chartOptions1.series[0]['data'].push({name : element.name,
        y : element.balance,
       drilldown : element.name });
      // console.log("run", this.chartOptions.series[0]['data'])
    });
 
  }

  //tetsing
  testing(){
    var obj ={};
    obj = {"name":"Yahoo", "age":25}
    this.service.testing(obj).subscribe(
      result => {
        console.log("Result : ", result);
      },
      err => {
        console.log("err : ", err);
      }
    );
  }
  // For graphs (bar chart)
  highcharts1 = Highcharts;
   chartOptions1 = {   
    chart: {
      type: 'column'
  },  
  title: {
      text: 'Browser market shares. January, 2018'
  },
  subtitle: {
      text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
  },
  accessibility: {
      announceNewData: {
          enabled: true
      }
  },
  xAxis: {
      type: 'category'
  },
  yAxis: {
      title: {
          text: 'Total percent shares'
      }

  },
  legend: {
      enabled: false
  },
  plotOptions: {
      series: {
          borderWidth: 0,
          dataLabels: {
              enabled: true,
              format: '{point.y:.1f} ₹'
          }
      }
  },

  tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}₹</b> of total<br/>'
  },
  
  series: [
    {
        name: "Browsers",
        colorByPoint: true,
          data:
           [                       
          ]
    }
],
   };

// secon graph (Pi chart)
showPiChart(){
  this.chartOptions2.series[0]['data'] = []
  this.showPieGraphs = !this.showPieGraphs;
  this.showBarGraphs = false;
  let totalSales =  0;
  this.totalCustomers.forEach(e => {
        totalSales = totalSales + e.balance
  });
  console.log(totalSales)
  this.totalCustomers.forEach(element => {
    let percent = Number(((element.balance/totalSales) * 100).toFixed(2))
    this.chartOptions2.series[0]['data'].push({
      name : element.name,
      y: percent
 });
  });
}

highcharts2 = Highcharts;
chartOptions2 = {  
  chart: {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false,
         type: 'pie'
     },
     title: {
         text: 'Browser market shares in January, 2018'
     },
     tooltip: {
         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
     },
     accessibility: {
         point: {
             valueSuffix: '%'
         }
     },
     plotOptions: {
         pie: {
             allowPointSelect: true,
             cursor: 'pointer',
             dataLabels: {
                 enabled: true,
                 format: '<b>{point.name}</b>: {point.percentage:.1f} %'
             }
         }
     },
     series: [{
         name: 'Brands',
         colorByPoint: true,
         data: []
     }],
       }
      
}