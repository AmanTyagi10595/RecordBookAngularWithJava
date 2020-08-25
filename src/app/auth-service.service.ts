import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
@Injectable({
  providedIn: "root"
})
export class AuthServiceService {
  constructor(private http: HttpClient) {}

  url = "http://localhost:8080/";
  addCustomer(cum) {
    console.log("testing", cum);
    return this.http.post(`${this.url}customer/custom`, cum);
  }
  getAllCustomer() {
    return this.http.get(`${this.url}customer/custom`, httpOptions);
  }
  getOneUserSale(obj) {
    return this.http.get(`${this.url}sales/saleOfOneUser/${obj.email}/`, httpOptions);
  }
  addSalesData(sales) {
    console.log("in service", sales);
    return this.http.post(`${this.url}sales/add`, sales);
  }
  getAllUsersSale() {
    return this.http.get(`${this.url}sales/getAllSale`, httpOptions);
  }
  getLikeCustomer(data) {
    return this.http.get(`${this.url}customer/like?data=` + data, httpOptions);
  }
  deleteOneSale(_id) {
    console.log("here is the ID: ", _id)
    return this.http.delete(`${this.url}sales/${_id}`, httpOptions);
  }
  getCustomerBalance(email) {
    return this.http.get(`${this.url}customer/findBalanceByEmail/${email}/`, httpOptions);
  }
  deleteCustomer(obj) {
    return this.http.delete(`${this.url}customer/custom/${obj["email"]}`, httpOptions);
  }
  uploadFile(files) {
    return this.http.post(`${this.url}api/Upload`, files);
  }
  notifieSingleCustomer(obj) {
    console.log(obj)
    return this.http.post(`${this.url}customer/email`, obj);
  }
  getRangedCustomers(obj) {
    console.log("Range: ", obj)
    return this.http.post(`${this.url}customer/findCustomerByBalanceRange`, obj);
  }
  notifieRangedCustomers(obj) {
    return this.http.post(`${this.url}customer/notifiedRanged`, obj);
  }
  testing(obj) {
    return this.http.post(`${this.url}customer/testing`, obj);
  }
  dateRangedCustomers(obj) {
    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
   var date1 = convert(obj["minValue"]);
   var date2 = convert(obj["maxValue"]);
   console.log("Date going in apis",obj["minValue"], " and ",  typeof obj["minValue"] );
   
    return this.http.post(`${this.url}customer/findCustomerByDateRange/${obj["minValue"]}/${obj["maxValue"]}`, httpOptions);
  }
}
