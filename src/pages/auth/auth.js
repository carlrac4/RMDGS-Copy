export function AuthLevel(level){
    if(level == 1 || level == 2 || level == 3 || level == 4 || level == 5 || level == 6){
      return false;
    } else if (level == 8 || level == 7) {
      return true
    } else {
      
    } 
  }

  export function AuthLvlCollection(level, collector){
    if(level == 1 || level == 2 || level == 4 || level == 5 || collector =='true'){
      return false
    }else {
      return true
    }
  }