import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filename'})
export class FilenamePipe implements PipeTransform {

  transform( fakeFilepath: string, defaultStr : string): string {

    if(fakeFilepath.length > 0 && fakeFilepath.indexOf("/") > -1){
      var strArr = fakeFilepath.split("/");
      return strArr[strArr.length - 1];
    }
    if(fakeFilepath.length > 0 && fakeFilepath.indexOf("\\") > -1){
      var strArr = fakeFilepath.split("\\");
      return strArr[strArr.length - 1];
    }
    return defaultStr

  }

}