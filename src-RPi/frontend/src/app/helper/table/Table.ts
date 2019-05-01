import { DisplaySensor } from 'src/app/models/sensor.model';
import { SortSetting } from './Table.model';

export class Table {

  public sortSetting : SortSetting;
  public data : any[];

  constructor( data : any[], sort? : SortSetting) {

    this.data = data;

    if(sort){

      this.sortSetting = sort;
      this.sortTable();

    } else {
      this.sortSetting = {
        item : null,
        desc : null
      }
    }


  }

  public sortTable(): void{
    var item = this.sortSetting.item;
    if(!this.sortSetting.desc){
      this.data = this.data.sort( (a, b)=> {
        var aData = a[item];
        var bData = b[item];
        if(typeof aData === "string" || typeof bData === "string"){
          aData = aData || '';
          bData = bData || '';
          return aData.localeCompare(bData);
        } else {
          return aData - bData;
        }
      });
    } else {
      this.data.sort( (a, b)=> {
        var aData = a[item];
        var bData = b[item];
        if(typeof aData === "string" || typeof bData === "string"){
          aData = aData || '';
          bData = bData || '';
          return bData.localeCompare(aData);
        } else {
          return bData - aData;
        }
        
      });
    }
  }

  public toggleSort(item : string): void{
    if(this.sortSetting.desc && this.sortSetting.item === item){
      this.sortSetting.desc = false;
    } else {
      this.sortSetting.desc = true;
      this.sortSetting.item = item;
    }
    this.sortTable();
  }

  public updateData(data : any[]): void{
    
    this.data = data;

    if(this.sortSetting.item !== null){
      this.sortTable();
    }

  }

  public getSortIcon(item : string): string[]{
    if(item === this.sortSetting.item){
      return this.sortSetting.desc ? ['fas','caret-down'] : ['fas','caret-up'];
    } 
    return null;
  }

  public isSortedBy(item : string): boolean {
    return this.sortSetting.item === item;
  }
}

export class SensorTable extends Table {

  constructor( data : DisplaySensor[]){

    super(data);

  }

}

