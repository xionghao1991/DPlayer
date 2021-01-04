import videoTemplate from '../src/template/player.art'

export function test(){
    console.log('--');
}
class Main {
    do(){
        console.log('do', videoTemplate());
    }
}
let main = new Main();
main.do();
