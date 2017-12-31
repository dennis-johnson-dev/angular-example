import { Component, OnInit } from "@angular/core";

import { DataService, Datas } from "./services/data.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
  datas: Datas;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getDatas().subscribe(
      datas => {
        this.datas = datas;
      },
      err => {
        console.log(err);
      }
    );
  }
}
