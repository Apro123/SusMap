import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  SHEETS_ID = "12jc_EN3Uh5RHPjjmI-osbys7oHBq9RPSWn71_4zhRSM";
  SHEETS_API_KEY = "AIzaSyCm9Nmy4Swo-1nNLurhv-kfzbr_DJd-yCQ";
  private baseURLpt1 = "https://sheets.googleapis.com/v4/spreadsheets/" + this.SHEETS_ID + "/values/'";
  //surround the name of the sheet with a single quotes
  private baseURLpt2 = "'?key=" + this.SHEETS_API_KEY;
  // ex api call https://sheets.googleapis.com/v4/spreadsheets/12jc_EN3Uh5RHPjjmI-osbys7oHBq9RPSWn71_4zhRSM/values/'ECONOMIC'?key=AIzaSyBZgDR2xgMIi_xlt-luKmuJPj2DUxsplnk
  private filters = [];

  private filterNames = [];
  private allFilterData = [];
  private _buildings = [];

  constructor(
    private storage: Storage,
    private http: HttpClient
  ) {
    // try {
    //   await this.storage.create();
    // } catch (error) {
    //   console.log(error);
    // }
  }

  //turns unparsed array to array of json objects from sheets return data
  async arrayToJSONWithHeaders(values): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      var tempArr = []; //returning this value
      for(let i = 1; i < values.length; i++) {
        var tempJSON = {}; //temp data to insert into tempArr

        for (let j = 0; j < values[i].length; j++) {
          tempJSON[(values[0][j]+"").toUpperCase()] = values[i][j]; //make all the element identifiers uppercase not the values themselves
        }
        tempArr.push(tempJSON);
      }

      resolve(tempArr);
    });
  }

  async buildPromise(name: string, refresh: boolean, debug: string): Promise<any> {
    name = (""+name).toUpperCase();//just in case
    return await new Promise<any>((res,rej) => {
      this.storage.get(name).then((val) => {
        if(val && !refresh) {
          console.log(name + " exists");
          res(val); //exists
        } else {

          this.http.get(this.baseURLpt1 + name + this.baseURLpt2).subscribe((data: {}) => {
            this.arrayToJSONWithHeaders(data['values']).then((parsedData: Array<any>) => {
              let copy = JSON.parse(JSON.stringify(parsedData));

              this.storage.set(name, copy);

              res(parsedData);
            });

          },
          (error) => {
            console.log(error);
            res(val);
          });

        }
      }).catch((err) => {
        console.log(err);
        rej(err);
      });
    });
  }

  async getBuildingFilterNames(refresh: boolean, debug: string): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      if(this.filterNames.length != 0 && this._buildings.length != 0) {
        console.log("get cache");
        resolve([this._buildings, this.filterNames]);
      } else {

        var promArr = [this.buildPromise("BUILDINGS", refresh, debug)];
        promArr.push(this.buildPromise("FILTERS", refresh, debug));
        forkJoin(promArr).subscribe((data)=> {
          this._buildings = data[0];
          if(this.filterNames.length == 0) {
            var tempFilterNames = data[1];
            for (let i = 0; i < tempFilterNames.length; i++) {
              var tempJSON = {};
              tempJSON["FILTER_NAME"] = tempFilterNames[i]["NAME"].toUpperCase(); //uppercase the filter name for later
              tempJSON["ICON"] = tempFilterNames[i]["ICON"]; //dont uppercase the icons
              tempJSON["ICON-SELECTED"] = tempFilterNames[i]["ICON-SELECTED"];
              tempJSON["ACTIVE"] = false;
              this.filterNames.push(tempJSON);
            }
          }

          resolve([this._buildings, this.filterNames]);
        });

      }
    });
  }

  //get all specific filter data
  async getAllFilterData(refresh: boolean): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      var promArr = []
      for (let i = 0; i < this.filterNames.length; i++) {
        promArr.push(this.buildPromise(this.filterNames[i]["FILTER_NAME"], refresh, "filter data"));
      }
      forkJoin(promArr).subscribe((data: []) => {
        for (let i = 0; i < data.length; i++) {
          var tempJSON = {};
          tempJSON["FILTER_NAME"] = this.filterNames[i]["FILTER_NAME"];
          tempJSON["ICON"] = this.filterNames[i]["ICON"]; //dont uppercase the icons
          tempJSON["ICON-SELECTED"] = this.filterNames[i]["ICON-SELECTED"];
          tempJSON["ACTIVE"] = this.filterNames[i]['ACTIVE'];
          tempJSON["DATA"] = data[i];

          //add icons to building ids whenever and set into buildings storage

          this.allFilterData.push(tempJSON);
        }
        resolve(this.allFilterData);
      });

    });
  }

  async getSpecificBuildingData(id: number) {
    return await new Promise<any>((resolve, reject) => {
      this.storage.get("BUILDINGS").then((val) => {
        const ind = val.findIndex(building => building['BUILDING_ID'] == id);
        var building = val[ind];
        val[ind]['DESCRIPTION'] = val[ind]["DESCRIPTION"].split("---");
        val[ind]['LEED HIGHLIGHTS'] = val[ind]['LEED HIGHLIGHTS'].split("---");
        val[ind]['AWARDS'] = val[ind]['AWARDS'].split("---");
        val[ind]['PROJECT TEAM'] = val[ind]['PROJECT TEAM'].split("---");
        resolve(val[ind]);
      })
    });
  }

  async getOneLineData(name: string) {
    return await new Promise<any>((resolve, reject) => {
      this.buildPromise(name, true, name).then((val) => {
        resolve(val[0]);
      });
    });
  }

  async getUpdatedToastTips(name: string) {
    var n = name + "_TIPS";
    return await new Promise<any>((resolve, reject) => {
      this.storage.get(n).then((val) => {
        if(val && val === true) {
          resolve(true); //set to true in production
        } else {
          this.storage.set(n, true);
          resolve(false);
        }
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  async getTOSPP() {
    return await new Promise<any>((resolve, reject) => {
      this.storage.get("TOSPP_TIPS").then((val) => {
        if(val && val === true) {
          resolve(true); //set to true in production
        } else {
          // this.storage.set(n, true);
          resolve(false);
        }
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }

  setTOSPP(val) {
    this.storage.set("TOSPP_TIPS", val);
  }


  // updateFilterData(filters) {
  //   this.filterNames = filters;
  // }
}
