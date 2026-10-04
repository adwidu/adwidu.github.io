let db = '';
function changeTheme() {
    const params = new URLSearchParams(window.location.search);

    for (const [key, value] of params){
        if(key == 't' && value == 'dark') {
            document.body.classList = ['dark']
        }
        if(key == 'db'){
            db = value;
        }
    }
    
}
function yes() {
    window.parent.postMessage({ 
    type: 'remove-all-scores'
    }, window.location.origin);
} 

function no() {
    window.parent.postMessage({ 
    type: 'dont-remove-all-scores'
    }, window.location.origin);
}
